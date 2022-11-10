import { Keys } from "../Keys";
import { IConstructorDefinition } from "./definitionInterfaces/IConstructorDefinition";
import { IInstantiatable } from "../interfaces/IInstantiatable";
import { IResolver } from "../interfaces/IResolver";
import { ArgResolver } from "./helpers/ArgResolver";
import { Utils } from "../Utils";
import { IInjectParamMeta } from "../decorators/Inject";

export class ConstructorInstantiation implements IInstantiatable {
    tags: string[] = [];

    definition: IConstructorDefinition;
    argResolver: ArgResolver;

    constructor(definition: IConstructorDefinition, private readonly resolver: IResolver) {
        this.definition = definition;
        this.argResolver = new ArgResolver(resolver);
    }

    async instantiate() {
        return this.resolveConstructor(this.definition.content, this.definition.context, Keys.INJECT_PROPERTY_DECORATOR_KEY);
    }

    async resolveParentArgs(ctr: any) {
        const args: any[] = [];
        const parentCtr = Object.getPrototypeOf(ctr);
        const parentArgs: any[] = Reflect.getMetadata("design:paramtypes", parentCtr) || [];
        for (const parentArg of parentArgs) {
            args.push(await this.resolver.resolveByType(parentArg));
        }

        return args;
    }

    /*
    * If has OTHER_INJECTION_REQUIRED arg (arg without key), this function will inject by type
    *  - if enable AutoCreate in the options then if the container item not found it will create and register
    * */
    async resolveArgsWithoutKey(ctr: any, args: IInjectParamMeta[] | any): Promise<any[]> {
        const constructorArgs = Reflect.getMetadata("design:paramtypes", ctr) || [];
        // correction if 0 param in constructorArgs
        if (args.length === 0) {
            for (let i = 0; i < Utils.getRequiredParamLength(ctr); i++) {
                args.push(Keys.OTHER_INJECTION_REQUIRED);
            }
        }

        for (let i = 0; i < args.length; i++) {
            if (args[i] === Keys.OTHER_INJECTION_REQUIRED) {
                args[i] = await this.resolver.resolveByType(constructorArgs[i]);
            }
        }
        return args;
    }

    private isResolvable(ctr: any) {
        const meta: any = Reflect.getMetadata(Keys.INJECT_PROPERTY_DECORATOR_KEY, ctr) || {};
        const constructorArgs = Reflect.getMetadata("design:paramtypes", ctr) || [];
        const propsMeta = meta[Keys.INJECT_PROPERTY_DECORATOR_KEY] || [];
        for (let i = 0; i < constructorArgs.length; i++) {
            if (!propsMeta[i] && !this.resolver.options.enableAutoCreate) {
                throw new Error(`Can't resolve: ${Utils.logClass(ctr, i)} maybe try to register it or use {enableAutoCreate: true}`);
            } else if (!propsMeta[i] && this.resolver.options.enableAutoCreate && Utils.isPrimitiveCtr(constructorArgs[i])) {
                throw new Error(`Can't resolve primitive without registration ${Utils.logClass(ctr, i)}`);
            }
        }
    }

    private async resolveConstructor(ctr: any, context: any, decoratorKey: symbol) {
        this.isResolvable(ctr);
        const meta: any = Reflect.getMetadata(decoratorKey, ctr) || {};
        let args: any[] = await this.argResolver.resolveArguments(meta, context, Keys.INJECT_PROPERTY_DECORATOR_KEY);
        if (args.length === 0) {
            args = await this.resolveParentArgs(ctr);
        }

        if (this.resolver.options.enableAutoCreate) {
            args = await this.resolveArgsWithoutKey(ctr, args);
        }
        return new ctr(...args);
    }

}
