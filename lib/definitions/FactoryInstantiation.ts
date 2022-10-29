import { IFactoryDefinition } from "./definitionInterfaces/IFactoryDefinition";
import { ConstructorInstantiation } from "./ConstructorInstantiation";
import { IInstantiatable } from "../interfaces/IInstantiatable";
import { IResolver } from "../interfaces/IResolver";

export class FactoryInstantiation implements IInstantiatable {
    tags = {};

    definition: IFactoryDefinition;

    constructorInstantiation: ConstructorInstantiation;

    constructor(definition: IFactoryDefinition, resolver: IResolver) {
        this.definition = definition;

        this.constructorInstantiation = new ConstructorInstantiation({
                key: definition.key,
                content: definition.content,
                context: definition.context,
                instantiationMode: definition.instantiationMode
            },
            resolver);
    }

    async instantiate() {
        return this.constructorInstantiation.instantiate();
    }
}
