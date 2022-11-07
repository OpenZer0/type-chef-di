import { InjectProperty } from "../lib/decorators/InjectProperty";
import { Container } from "../lib/Container";

describe("Property injection tests", () => {
    test("Injecting a property", async () => {
        const container = new Container();

        class Test {
            @InjectProperty("value")
            testProp: any;

        }

        container.register("value", "panda");

        container.register("test", Test);
        const expected = await container.resolve<Test>("test");
        expect(expected.testProp).toBe("panda");
    });
    test("Not injecting a property", async () => {
        const container = new Container();

        class Test {
            @InjectProperty("value")
            testProp: any;

            constructor() {
            }
        }

        try {
            container.register("test", Test);
            expect(await container.resolve<Test>("test")).toThrow("value instance is undefined");
        } catch (e) {
        }
    });

    test("inject type property", async () => {
        const container = new Container({enableAutoCreate: true});

        interface IFoo {
        getNumber(): number;
        }

        class Foo implements IFoo {
            getNumber() {
                return 69;
            }
        }
        class Foo2 implements IFoo {
            getNumber() {
                return 420;
            }
        }

        class Test {

            @InjectProperty<IFoo>(Foo)
            testProp!: IFoo;

            @InjectProperty<IFoo>(Foo2)
            testProp2!: IFoo;
        }

        const testInstance = await container.resolveByType<Test>(Test);
        expect(testInstance.testProp.getNumber()).toBe(69);
        expect(testInstance.testProp2.getNumber()).toBe(420);
    });
});
