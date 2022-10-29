import { IInitializer } from "./initializers/IInitializer";
import { RunInitMethodInitializer } from "./initializers/RunInitMethodInitializer";
import { IResolver } from "../interfaces/IResolver";
import { RunSettersInitializer } from "./initializers/RunSettersInitializer";
import { Utils } from "../Utils";
import { InjectPropertiesInitializer } from "./initializers/InjectPropertiesInitializer";
import { RunBeforeModifier } from "./initializers/RunBeforeModifier";
import { RunAfterModifier } from "./initializers/RunAfterModifier";
import { MethodWrapperModifier } from "./initializers/MethodWrapperModifier";

export class Initializers {
    initializers: IInitializer[] = [
        new RunBeforeModifier(this.resolver),
        new RunAfterModifier(this.resolver),
        new MethodWrapperModifier(this.resolver),

        new InjectPropertiesInitializer(this.resolver),
        new RunSettersInitializer(this.resolver),
        new RunInitMethodInitializer(this.resolver),
    ];

    constructor(private readonly resolver: IResolver, initializers?: IInitializer[]) {
        if (initializers) this.initializers = initializers;
    }

    async runInitializers(instance: any, definition: any) {
        if (!instance || !Utils.isClass(definition.content)) return instance;

        for (const initializer of this.initializers) {
            instance = await initializer.run(instance, definition);
        }

        return instance;
    }


}
