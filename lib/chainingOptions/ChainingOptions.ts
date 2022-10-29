import { Keys } from "../Keys";
import { IContainerChainingOptions } from "../interfaces/IContainerChainingOptions";
import { Container } from "../Container";
import { IInstantiatable } from "../interfaces/IInstantiatable";
import { ConstantInstantiation } from "../definitions/ConstantInstantiation";
import { FactoryInstantiation } from "../definitions/FactoryInstantiation";
import { FactoryResultInstantiation } from "../definitions/FactoryResultInstantiation";
import { ConstructorInstantiation } from "../definitions/ConstructorInstantiation";

export class ChainingOptions implements IContainerChainingOptions {
    instantiable: IInstantiatable;

    constructor(private readonly container: Container, private readonly key: string) {
        this.instantiable = this.container.definitionsRepository.getDefinition(key);
    }

    private setDefinitionChanges() {
        this.container.definitionsRepository.definitions.set(this.key, this.instantiable);
    }

    asPrototype(): this {
        this.instantiable.definition.instantiationMode = 'prototype';
        this.setDefinitionChanges();
        return this;
    }

    asSingleton(): this {
        this.instantiable.definition.instantiationMode = 'singleton';
        this.setDefinitionChanges();
        return this;
    }

    asConstant(): this {
        this.instantiable = new ConstantInstantiation({
            key: this.key,
            content: this.instantiable.definition.content,
            instantiationMode: this.instantiable.definition.instantiationMode
        });
        this.setDefinitionChanges();
        return this;
    }

    /*
    * set the @FactoryMethod meta to definition or asFactory() param or 'create'
    * */
    asFactory(factoryFnName?: string) {
        const getFactoryMethod = (ctr: any) => {
            const meta = Reflect.getMetadata(Keys.FACTORY_METHOD_PROPERTY_DECORATOR_KEY, ctr) || {};
            return meta[Keys.FACTORY_METHOD_PROPERTY_DECORATOR_KEY];
        };

        const factoryDefinition = {
            key: this.key,
            content: this.instantiable.definition.content,
            factoryFn: "create",
            instantiationMode: this.instantiable.definition.instantiationMode
        };

        const metaFactoryMethod = getFactoryMethod(this.instantiable.definition.content);

        if (factoryFnName !== undefined) {
            factoryDefinition.factoryFn = factoryFnName;
        } else if (metaFactoryMethod !== undefined) {
            factoryDefinition.factoryFn = metaFactoryMethod;
        } else {
            factoryDefinition.factoryFn = "create";
        }

        this.instantiable = new FactoryInstantiation(factoryDefinition, this.container);
        this.setDefinitionChanges();
        return this;
    }


    asFactoryResult(factoryKey: string): this {
        const factory = this.container.definitionsRepository.getDefinition(factoryKey);
        if (!(factory instanceof FactoryInstantiation)) {
            throw new Error("factoryKey is not a factory");
        }

        this.instantiable = new FactoryResultInstantiation({
                key: this.key,
                content: this.instantiable.definition.content,
                factoryKey,
                factoryMethodContext: {},
                instantiationMode: this.instantiable.definition.instantiationMode
            },
            this.container);

        this.setDefinitionChanges();
        return this;
    }

    withContext(context: {}): this {
        if (!(this.instantiable instanceof ConstructorInstantiation || this.instantiable instanceof FactoryInstantiation)) {
            throw new Error("cannot set context to  " + this.instantiable.definition.key);
        }
        this.instantiable.definition.context = context;
        this.setDefinitionChanges();
        return this;
    }

    withMethodContext(context: {}): this {
        if (!(this.instantiable instanceof FactoryResultInstantiation)) {
            throw new Error("cannot set context to  " + this.instantiable.definition.key);
        }
        this.instantiable.definition.factoryMethodContext = context;
        this.setDefinitionChanges();
        return this;
    }

    addTags(tagsObj: object) {
        this.container.definitionsRepository.addTags(this.key, tagsObj);
    }

}
