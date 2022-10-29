import { ChainingOptions } from "./ChainingOptions";
import { Container } from "../Container";
import { IInstantiatable } from "../interfaces/IInstantiatable";

export class AsFactoryCO {
    private instantiatable: IInstantiatable;
    private chainingOptions: ChainingOptions;

    constructor(private readonly container: Container, private readonly key: string) {
        this.instantiatable = this.container.definitionsRepository.getDefinition(key);
        this.chainingOptions = new ChainingOptions(container, key);
    }

    withContext(context: {}) {
        this.chainingOptions.withContext(context);
    }

}
