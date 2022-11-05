import { IInstantiatable } from "./interfaces/IInstantiatable";
import { IContainerOption } from "./Container";
import { Keys } from "./Keys";
import { Type } from "./interfaces/IType";

export class DefinitionRepository {
    definitions = new Map<string, IInstantiatable>();


    constructor(private readonly options: IContainerOption) {
    }

    getDefinitions(): Map<string, IInstantiatable> {
        return this.definitions;
    }

    getDefinition(key: string): IInstantiatable {
        if (!this.definitions.has(key)) {
            throw new Error(`${key} instance is undefined`);
        }
        return this.definitions.get(key) as IInstantiatable;
    }

    getDefinitionByType(constructor: Type): IInstantiatable | symbol {
        for (const [key, value] of this.definitions.entries()) {
            if (value.definition.content === constructor) {
                return value;
            }
        }

        if (this.options.enableAutoCreate) {
            return Keys.AUTO_CREATE_DEPENDENCY;
        }

        throw new Error(`definition not found by type: ${constructor}`);
    }

    getDefinitionKeysBySpecificTags(tags: string[]): string[] {
        const resultKeys: string[] = [];

        this.definitions.forEach((value: IInstantiatable, key: string) => {
            const foundTag = tags.find(tag => value.tags.includes(tag));
            if (foundTag) {
                resultKeys.push(key);
            }
        });

        return resultKeys;
    }

    addTags(key: string, tags: string[]): string[] {
        const definition = this.getDefinition(key);
        definition.tags.push(...tags);
        return definition.tags;
    }

}
