import { Injectable } from "../lib/decorators/Injectable";
import { Container } from "../lib/Container";

describe("Context test", () => {

    test("without context and one as singleton", async () => {
        const container = new Container({enableAutoCreate: true})

        const c = await container.resolveByType<C>(C)
        expect(c.d1.T).toBe("hello");

    });

});



@Injectable
class D1 {
    T = "hello";

    constructor() {
    }
}
@Injectable
class D2 {
    T = "hello2";

    constructor() {
    }
}
@Injectable
class A {
    constructor(public readonly d1: D1) {
    }
}

@Injectable
class B extends A {
    constB = "bbbb"
}

@Injectable
class C extends B {
    constC = "CCCC"
}
