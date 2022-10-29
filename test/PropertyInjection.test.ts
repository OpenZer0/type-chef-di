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
});
