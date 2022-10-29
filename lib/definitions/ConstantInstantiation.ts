import { IInstantiatable } from "../interfaces/IInstantiatable";
import { IConstantDefinition } from "./definitionInterfaces/IConstantDefinition";

export class ConstantInstantiation implements IInstantiatable {
    tags = {};

    definition: IConstantDefinition;

    constructor(definition: IConstantDefinition) {
        this.definition = definition;
    }

    async instantiate() {
        return this.definition.content;
    }
}
