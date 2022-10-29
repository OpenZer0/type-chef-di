import { ChainingOptions } from "./ChainingOptions";
import { AsFactoryCO } from "./AsFactoryCO";
import { Container } from "../Container";
import { IInstantiatable } from "../interfaces/IInstantiatable";


export class AsPrototypeCO {

    private instantiatable: IInstantiatable;
    private chainingOptions: ChainingOptions;

    constructor(private readonly container: Container, private readonly key: string) {
        this.instantiatable = this.container.definitionsRepository.getDefinition(key);
        this.chainingOptions = new ChainingOptions(container, key);
    }

    withContext(context: {}) {
        this.chainingOptions.withContext(context);
    }

    asFactory(factoryFn?: string): AsFactoryCO {
        this.chainingOptions.asFactory(factoryFn);
        return new AsFactoryCO(this.container, this.key);
    }


}
