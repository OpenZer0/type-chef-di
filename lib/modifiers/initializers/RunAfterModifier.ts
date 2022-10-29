import { Keys } from "../../Keys";
import { IRunAfter } from "../../interfaces/IRunAfter";
import { IResolver } from "../../interfaces/IResolver";
import { IInitializer } from "./IInitializer";

export class RunAfterModifier implements IInitializer {

    constructor(private readonly resolver: IResolver) {
    }

    async run(instance: any, definition: any): Promise<any> {
        return this.setRunAfter(instance, definition);
    }

    async setRunAfter(resolvedInstance: any, definition: any) {
        const beforeMeta = Reflect.getMetadata(Keys.AFTER_METHOD_KEY, resolvedInstance.constructor) || {};
        if (!beforeMeta) return resolvedInstance;

        for (const key in beforeMeta) {
            const resolveRunAfter: IRunAfter = await this.resolver.resolve(beforeMeta[key]);
            const originalFn = resolvedInstance[key];

            resolvedInstance[key] = (...params: any) => {
                const result = originalFn(...params);
                resolveRunAfter.run();

                return result;
            };
        }

        return resolvedInstance;
    }

}
