import { Keys } from "../../Keys";
import { IResolver } from "../../interfaces/IResolver";
import { ArgResolver } from "../../definitions/helpers/ArgResolver";
import { IInitializer } from "./IInitializer";

export class RunInitMethodInitializer implements IInitializer {
    argResolver: ArgResolver = new ArgResolver(this.resolver);

    constructor(readonly resolver: IResolver) {
    }

    async run(resolvedInstance: any, definition: any): Promise<any> {
        return this.runInitMethod(resolvedInstance, definition);
    }

    async runInitMethod(resolvedInstance: any, definition: any): Promise<any> {
        const initMethodMeta = Reflect.getMetadata(Keys.INIT_METHOD_PROPERTY_DECORATOR_KEY, definition.content) || {};
        const initMethod: string = initMethodMeta[Keys.INIT_METHOD_PROPERTY_DECORATOR_KEY];
        if (initMethod === undefined) {
            return resolvedInstance;
        }
        const initMethodParamsMeta = Reflect.getMetadata(initMethod, definition.content) || {};
        const initFnArgs: any = await this.argResolver.resolveArguments(initMethodParamsMeta, definition.context, initMethod);
        resolvedInstance[initMethod](...initFnArgs);

        return resolvedInstance;
    }


}
