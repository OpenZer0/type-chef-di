import "reflect-metadata";
import { IContainer } from "./interfaces/IContainer";
import { InstantiationModeCO } from "./chainingOptions/InstantiationModeCO";
import { IInstantiatable, instantiationMode } from "./interfaces/IInstantiatable";
import { IResolver } from "./interfaces/IResolver";
import { ConstructorInstantiation } from "./definitions/ConstructorInstantiation";
import { ConstantInstantiation } from "./definitions/ConstantInstantiation";
import { IInterceptor } from "./interfaces/IInterceptor";
import { Initializers } from "./modifiers/Initializers";
import { Utils } from "./Utils";
import { DefinitionRepository } from "./DefinitionRepository";
import { Keys } from "./Keys";
import { v4 as uuidv4 } from "uuid";
import { Type } from "./interfaces/IType";

export type singletonsType = Map<string, any>;

export interface IContainerOption {
    enableAutoCreate: boolean; // if dependency not exist in the container, creat it and register
}


export class Container implements IContainer, IResolver {

    definitionsRepository = new DefinitionRepository(this.options);
    protected singletons: singletonsType = new Map<string, any>();
    interceptors: IInterceptor[] = [];

    initializers = new Initializers(this);

    protected DEFAULT_INSTANTIATION: instantiationMode = "singleton";

    constructor(public readonly options: IContainerOption = {
        enableAutoCreate: false
    }) {
    }

    /**
     * Key-Value registration. You can inject the registered keys with @Inject(key) decorator
     */
    public register(key: string, value: any): InstantiationModeCO {
        const decoratorTags = this.getTagsMeta(value);
        this.setDefinition(key, this.getDefaultInstantiationDef(key, value, decoratorTags));
        return new InstantiationModeCO(this, key);
    }

    /**
     * Types registration to the container with a random key
     * (type injection don't need keys but if {autoCreate: false} you need to register everything)
     * @param constructors
     */
    public registerTypes(constructors: Type[]): void {
        for (const constructor of constructors) {
            this.register(uuidv4(), constructor);
        }
    }

    /**
     * Resolve type
     * @param constructor resolvable ctr
     */
    public async resolveByType<T>(constructor: Type): Promise<T> {
        const def = this.definitionsRepository.getDefinitionByType(constructor);

        if (def === Keys.AUTO_CREATE_DEPENDENCY && this.options.enableAutoCreate) {
            this.registerTypes([constructor]);
            return this.resolveByType(constructor);
        } else if (def) {
            return (this.definitionsRepository.getDefinitionByType(constructor) as IInstantiatable).instantiate();
        } else {
            throw new Error(`cannot resolve ${constructor}`);
        }
    }

    /**
     * Resolve key
     * @param key registered key (by register(key: string, value: any))
     */
    public async resolve<T>(key: string): Promise<T> {
        const instantiatable: IInstantiatable = this.definitionsRepository.getDefinition(key);

        switch (instantiatable.definition.instantiationMode) {
            case "prototype": {
                const originalInstance = await this.resolvePrototype<T>(instantiatable.definition.key);
                return this.applyModificationToInstance(originalInstance, instantiatable.definition);
            }
            case "singleton": {
                return this.resolveSingleton<T>(instantiatable);
            }
            default: {
                throw new Error(`Cannot resolve: ${key} because instantiationMode is:  ${instantiatable.definition.instantiationMode}`);
            }
        }
    }

    async applyModificationToInstance(instance: any, definition: any) {
        instance = await this.initializers.runInitializers(instance, definition);
        return instance;
    }

    async getBySpecificTags(tags: object): Promise<any[]> {
        const keys = this.definitionsRepository.getDefinitionKeysBySpecificTags(tags);

        const result = [];
        for (const key of keys) {
            result.push(await this.resolve(key));
        }

        return result;
    }

    async getByTags(tags: string[]): Promise<any[]> {
        const keys = this.definitionsRepository.getDefinitionKeysByTags(tags);

        const result = [];
        for (const key of keys) {
            result.push(await this.resolve(key));
        }

        return result;
    }

    addInterceptor(interceptor: IInterceptor): void {
        this.interceptors.push(interceptor);
    }


    /**
     * resolve test for all keys.
     */
    async containerTest() {
        for (const key of this.definitionsRepository.definitions.keys()) {
            try {
                await this.resolve<any>(key);
            } catch (err) {
                throw new Error(`Not proper registration. details: ${err}`);
            }
        }
    }

    /**
     * run interceptors. Run this after all key was registered.
     */
    async done(): Promise<any> {
        await this.containerTest();
        this.runInterceptors();
    }

    private runInterceptors() {
        this.interceptors.forEach((interceptor: IInterceptor) => {
            interceptor.intercept(this);
        });
    }

    hasKeyInDefinition(key: string): boolean {
        return this.definitionsRepository.definitions.has(key);
    }

    private setDefinition(key: string, definition: IInstantiatable) {
        this.definitionsRepository.definitions.set(key, definition);
    }

    private getDefaultInstantiationDef(key: string, content: any, decoratorTags: any): IInstantiatable {

        if (Utils.isClass(content)) {
            const classInstance = new ConstructorInstantiation({
                key,
                content,
                context: {},
                instantiationMode: this.DEFAULT_INSTANTIATION,
            }, this);
            classInstance.tags = decoratorTags;
            return classInstance;
        }
        return new ConstantInstantiation({
            key,
            content,
            instantiationMode: this.DEFAULT_INSTANTIATION
        });
    }

    private async resolvePrototype<T>(key: string): Promise<T> {
        return this.definitionsRepository.getDefinition(key).instantiate();
    }

    private async resolveSingleton<T>(instantiatable: IInstantiatable): Promise<T> {
        if (!this.singletons.has(instantiatable.definition.key)) {
            let newInstance = await instantiatable.instantiate();
            newInstance = this.applyModificationToInstance(newInstance, instantiatable.definition);

            this.singletons.set(instantiatable.definition.key, newInstance);
            return this.singletons.get(instantiatable.definition.key);
        }
        return this.singletons.get(instantiatable.definition.key);
    }

    private getTagsMeta(ctr: Type) {
        if (!Utils.isClass(ctr)) return;
        const meta = Reflect.getMetadata(Keys.ADD_TAGS_KEY, ctr.constructor) || {};
        return meta[Keys.ADD_TAGS_KEY];
    }
}
