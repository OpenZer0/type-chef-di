import { IResolver } from "../../interfaces/IResolver";
import { Keys } from "../../Keys";
import { IMethodWrapper } from "../../interfaces/IMethodWrapper";
import { IInitializer } from "./IInitializer";

export class MethodWrapperModifier implements IInitializer {

    constructor(readonly resolver: IResolver) {
    }

    async run(instance: any, definition: any): Promise<any> {
        return this.setMethodWrapper(instance, definition);
    }

    async setMethodWrapper(resolvedInstance: any, definition: any) {
        const wrapperMeta = Reflect.getMetadata(Keys.METHOD_WRAPPER_KEY, resolvedInstance.constructor) || {};
        if (!wrapperMeta) return resolvedInstance;

        for (const key in wrapperMeta) {
            const resolveRunAfter: IMethodWrapper = await this.resolver.resolve(wrapperMeta[key]);
            const descriptorOriginal = Reflect.getMetadata(Keys.METHOD_DESCRIPTOR_KEY, resolvedInstance.constructor) || {};
            resolvedInstance[key] =  async function (this: any, ...args: any) {
                return resolveRunAfter.run(() => descriptorOriginal.value?.apply(this, args), args);
            };
        }

        return resolvedInstance;
    }

}
