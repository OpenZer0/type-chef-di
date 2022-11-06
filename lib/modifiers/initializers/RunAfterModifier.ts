import { Keys } from "../../Keys";
import { IRunAfter } from "../../interfaces/IRunAfter";
import { IResolver } from "../../interfaces/IResolver";
import { IInitializer } from "./IInitializer";

export class RunAfterModifier implements IInitializer {

    constructor(readonly resolver: IResolver) {
    }

    async run(instance: any, definition: any): Promise<any> {
        return this.setRunAfter(instance, definition);
    }

    async setRunAfter(resolvedInstance: any, definition: any) {
        const afterMeta = Reflect.getMetadata(Keys.AFTER_METHOD_KEY, resolvedInstance.constructor) || {};
        if (!afterMeta) return resolvedInstance;

        for (const key in afterMeta) {
            const resolveRunAfter: IRunAfter = await this.resolver.resolve(afterMeta[key]);
            const descriptorOriginal = Reflect.getMetadata(Keys.METHOD_DESCRIPTOR_KEY, resolvedInstance.constructor) || {};
            resolvedInstance[key]  = function (this: any, ...args: any) {
                const res = descriptorOriginal.value?.apply(this, args);
                resolveRunAfter.run();
                return res;
            };
        }

        return resolvedInstance;
    }

}
