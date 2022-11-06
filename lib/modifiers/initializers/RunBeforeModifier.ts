import { Keys } from "../../Keys";
import { IRunBefore } from "../../interfaces/IRunBefore";
import { IResolver } from "../../interfaces/IResolver";
import { IInitializer } from "./IInitializer";

export class RunBeforeModifier implements IInitializer {
    constructor(readonly resolver: IResolver) {

    }

    async run(instance: any, definition: any): Promise<any> {
        return this.setBeforeMethod(instance, definition);
    }

    async setBeforeMethod(resolvedInstance: any, definition: any): Promise<any> {
        const beforeMeta = Reflect.getMetadata(Keys.BEFORE_METHOD_KEY, resolvedInstance.constructor) || {};
        if (!beforeMeta) return resolvedInstance;

        for (const key in beforeMeta) {
            const resolveRunBefore: IRunBefore = await this.resolver.resolve(beforeMeta[key]);
            const descriptorOriginal = Reflect.getMetadata(Keys.METHOD_DESCRIPTOR_KEY, resolvedInstance.constructor) || {};
            resolvedInstance[key]  =  function (this: any, ...args: any) {
                resolveRunBefore.run();
                return descriptorOriginal.value?.apply(this, args);
            };
        }

        return resolvedInstance;
    }

}
