import { Inject } from "../../lib/decorators/Inject";
import { FactoryMethod } from "../../lib/decorators/FactoryMethod";

export class FactoryClass {

    constructor(@Inject("factoryParam1") private readonly value: string) {

    }

    getValue() {
        return this.value;
    }

    create() {
        return "This is ths FactoryClass create() result.";
    }

    @FactoryMethod()
    factoryMethodName(@Inject("factoryMethodKey1") value: string, @Inject("factoryMethodKey2") value2: string) {
        return `factoryMethodName result: value: ${value} value2: ${value2}`;
    }

    create2() {
        return "create2 result";
    }
}
