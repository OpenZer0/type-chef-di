import { ChainingOptions } from "./ChainingOptions";
import { AsPrototypeCO } from "./AsPrototypeCO";
import { AsFactoryResultCO } from "./AsFactoryResultCO";
import { AsFactoryCO } from "./AsFactoryCO";
import { Container } from "../Container";
import { IInstantiatable } from "../interfaces/IInstantiatable";

export class InstantiationModeCO {

    private instantiable: IInstantiatable;
    private chainingOptions: ChainingOptions;

    constructor(private readonly container: Container, private readonly key: string) {
        this.instantiable = this.container.definitionsRepository.getDefinition(key);
        this.chainingOptions = new ChainingOptions(container, key);
    }

    asPrototype(): AsPrototypeCO {
        this.chainingOptions.asPrototype();
        return new AsPrototypeCO(this.container, this.key);
    }

    asSingleton(): AsPrototypeCO {
        this.chainingOptions.asSingleton();
        return new AsPrototypeCO(this.container, this.key);
    }

    asConstant(): void {
        this.chainingOptions.asConstant();
    }

    addTags(tags: object) {
        this.chainingOptions.addTags(tags);
    }

    asFactoryResult(factoryKey: string): AsFactoryResultCO {
        this.chainingOptions.asFactoryResult(factoryKey);
        return new AsFactoryResultCO(this.container, this.key);
    }

    asFactory(factoryFn?: string): AsFactoryCO {
        this.chainingOptions.asFactory(factoryFn);
        return new AsFactoryCO(this.container, this.key);
    }

    withContext(context: {}): void {
        this.chainingOptions.withContext(context);
    }
}
