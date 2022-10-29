import { Container } from "../Container";
import { ChainingOptions } from "./ChainingOptions";
import { IInstantiatable } from "../interfaces/IInstantiatable";

export class AsFactoryResultCO {
    private instantiatable: IInstantiatable;
    private chainingOptions: ChainingOptions;

    constructor(private readonly container: Container, private readonly key: string) {
        this.instantiatable = this.container.definitionsRepository.getDefinition(key);
        this.chainingOptions = new ChainingOptions(container, key);
    }

    withMethodContext(context: {}) {
        this.chainingOptions.withMethodContext(context);
    }
}
