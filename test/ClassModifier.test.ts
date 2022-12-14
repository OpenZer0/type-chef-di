import { Container } from "../lib/Container";
import { IRunBefore } from "../lib/interfaces/IRunBefore";
import { RunBefore } from "../lib/decorators/RunBefore";
import { RunAfter } from "../lib/decorators/RunAfter";
import { IRunAfter } from "../lib/interfaces/IRunAfter";


class MyRunBefore implements IRunBefore {
    run(): any {
        TestBefore.testVar = "change";
    }

}

export class TestBefore {
    static testVar = "something";

    @RunBefore("MyRunBefore")
    testFn() {
        return TestBefore.testVar;
    }
}

describe("RunBefore tests", () => {
    test("wrapper after a functiom", async () => {
        const container = new Container();
        container.register("MyRunBefore", MyRunBefore);
        container.register("TestBefore", TestBefore);
        const testObj = await container.resolve<TestBefore>("TestBefore");
        expect(testObj.testFn()).toBe("change");
    });
});

class MyRunAfter implements IRunAfter {
    run(): any {
        TestAfter.testVar = "change";
    }

}

class MyRunAfter2 implements IRunAfter {
    run(): any {
        TestAfter.testVar = "change2";
    }

}


export class TestAfter {
    static testVar = "something";

    @RunAfter("MyRunAfter")
    testFn() {
        return TestAfter.testVar;
    }

    @RunAfter(MyRunAfter2)
    testFn2() {
        return TestAfter.testVar;
    }
}

describe("RunAfter tests", () => {
    test("RunAfter tests", async () => {
        const container = new Container({enableAutoCreate: true});
        container.register("MyRunAfter", MyRunAfter);
        container.register("TestAfter", TestAfter);
        const testObj = await container.resolve<TestAfter>("TestAfter");
        expect(testObj.testFn()).toBe("something");
        expect(TestAfter.testVar).toBe("change");
        testObj.testFn2();
        expect(TestAfter.testVar).toBe("change2");
    });
});
