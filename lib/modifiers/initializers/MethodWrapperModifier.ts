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
        const beforeMeta = Reflect.getMetadata(Keys.METHOD_WRAPPER_KEY, resolvedInstance.constructor) || {};
        if (!beforeMeta) return resolvedInstance;

        for (const key in beforeMeta) {
            const resolveMethodWrapper: IMethodWrapper = await this.resolver.resolve(beforeMeta[key]);
            const originalFn = resolvedInstance[key];

            resolvedInstance[key] = (...params: any) => {
                return resolveMethodWrapper.run(originalFn, params);
            };
        }

        return resolvedInstance;
    }

}
