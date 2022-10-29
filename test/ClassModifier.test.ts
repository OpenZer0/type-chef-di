import { Container } from "../lib/Container";
import { MethodWrapper } from "../lib/decorators/MethodWrapper";
import { MyMethodWrapper } from "./testClass/MyMethodWrapper";
import { IRunBefore } from "../lib/interfaces/IRunBefore";
import { RunBefore } from "../lib/decorators/RunBefore";
import { RunAfter } from "../lib/decorators/RunAfter";
import { IMethodWrapper } from "../lib/interfaces/IMethodWrapper";
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


export class TestAfter {
    static testVar = "something";

    @RunAfter("MyRunAfter")
    testFn() {
        return TestAfter.testVar;
    }
}

class MyRunAfter implements IRunAfter {
    run(): any {
        TestAfter.testVar = "change";
    }

}

describe("RunAfter tests", () => {
    test("RunAfter tests", async () => {
        const container = new Container();
        container.register("MyRunAfter", MyRunAfter);
        container.register("TestAfter", TestAfter);
        const testObj = await container.resolve<TestAfter>("TestAfter");
        expect(testObj.testFn()).toBe("something");
        expect(TestAfter.testVar).toBe("change");
    });
});


export class MyMethodWrapper2 implements IMethodWrapper {
    run(next: Function, params: any[]): any {
        let count = 1;
        count += next(...params);
        return count + 1;
    }

}

describe("Wrapper tests", () => {
    test("wrapper after a functiom", async () => {
        const container = new Container();

        class Test {

            @MethodWrapper("MyMethodWrapper2")
            testFn() {
                return 10;
            }
        }

        container.register("MyMethodWrapper2", MyMethodWrapper2);
        container.register("test", Test);
        const testObj = await container.resolve<Test>("test");
        expect(testObj.testFn()).toBe(12);
    });

    test("wrapper before a functiom", async () => {
        const container = new Container();

        class Test {

            @MethodWrapper("MyMethodWrapper")
            testFn(container: any) {
            }
        }

        container.register("MyMethodWrapper", MyMethodWrapper);
        container.register("test", Test);
        const testObj = await container.resolve<Test>("test");
        testObj.testFn(container);
        expect(await container.resolve("asd")).toBe("asd");
    });
});
