import { IFactoryResultDefinition } from "./definitionInterfaces/IFactoryResultDefinition";
import { IInstantiatable } from "../interfaces/IInstantiatable";
import { Container } from "../Container";
import { ArgResolver } from "./helpers/ArgResolver";

export class FactoryResultInstantiation implements IInstantiatable {
    tags: string[] = [];

    definition: IFactoryResultDefinition;
    argResolver: ArgResolver;

    constructor(definition: IFactoryResultDefinition, private readonly container: Container) {
        this.definition = definition;
        this.argResolver = new ArgResolver(this.container);
    }

    async instantiate() {
        return this.getFactoryResult(this.definition);
    }

    public async getFactoryResult<T>(factoryResultDefinition: IFactoryResultDefinition): Promise<T> {
        if (factoryResultDefinition.factoryKey === undefined) throw new Error(`cannot resolve ${factoryResultDefinition.key} as factory because do not have factoryKey`);
        const factoryDefinition: any = this.container.definitionsRepository.getDefinition(factoryResultDefinition.factoryKey).definition;
        const factoryObj = await this.container.resolve(factoryResultDefinition.factoryKey) as any;
        if (!factoryDefinition?.factoryFn) factoryDefinition.factoryFn = "create";
        const meta = Reflect.getMetadata(factoryDefinition.factoryFn, factoryDefinition.content) || {};
        const factoryFnArgs: any = await this.argResolver.resolveArguments(meta, factoryResultDefinition.factoryMethodContext, factoryDefinition.factoryFn);
        const result = factoryObj[factoryDefinition.factoryFn](...factoryFnArgs);
        return result as T;
    }

}
