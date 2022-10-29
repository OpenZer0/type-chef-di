import { Container } from "../lib/Container";
import { MyInterceptor } from "./testClass/MyInterceptor";


describe("Interceptor tests", () => {
    test("Interceptor test", async () => {
        const container = new Container();

        const myInterceptor = new MyInterceptor();
        container.addInterceptor(myInterceptor);
        await container.done();

        const expected = await container.resolve("valami");
        expect(expected).toBe("valami");
    });
});
