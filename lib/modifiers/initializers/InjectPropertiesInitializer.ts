import { IInitializer } from "./IInitializer";
import { Keys } from "../../Keys";
import { ArgResolver } from "../../definitions/helpers/ArgResolver";
import { IResolver } from "../../interfaces/IResolver";

export class InjectPropertiesInitializer implements IInitializer {
    argResolver: ArgResolver = new ArgResolver(this.resolver);

    constructor(readonly resolver: IResolver) {
    }

    async run(resolvedInstance: any, definition: any): Promise<any> {
        return this.injectProperties(resolvedInstance, definition);
    }

    async injectProperties(resolvedInstance: any, definition: any): Promise<any> {
        const propertiesMeta = Reflect.getMetadata(Keys.PROPERTY_INJECT_KEY, definition.content) || {};
        if (!propertiesMeta) return resolvedInstance;

        const setInstanceProperty = (key: any, value: any) => {
            resolvedInstance[key] = value;
        };

        for (const key in propertiesMeta) {
            const resolvedKey = typeof  propertiesMeta[key] === "string" ? await this.resolver.resolve( propertiesMeta[key]) : await this.resolver.resolveByType( propertiesMeta[key]);
            setInstanceProperty(key, resolvedKey);
        }

        return resolvedInstance;
    }


}
