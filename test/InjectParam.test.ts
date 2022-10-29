import { Container } from "../lib/Container";
import { Inject } from "../lib/decorators/Inject";

describe("InjectParam tests", () => {
    test("InjectParam const test", async () => {
        class Client {

            constructor(@Inject("value") private readonly value: string) {
            }

            public say() {
                return `hello ${this.value}`;
            }
        }

        const container = new Container();
        container.register("value", "world");
        container.register("client", Client);

        const client = await container.resolve<Client>("client");
        const expected = client.say();
        expect(expected).toBe("hello world");

    });

    test("InjectParam class test", async () => {
        class Client {
            constructor() {
            }

            public say() {
                return `hello world`;
            }
        }

        class Service {

            constructor(@Inject("client") private readonly client: Client) {
            }

            public check() {
                return `client says: ${this.client.say()}`;
            }
        }

        const container = new Container();
        container.register("client", Client);
        container.register("service", Service);

        const service = await container.resolve<Service>("service");
        const expected = service.check();
        expect(expected).toBe("client says: hello world");

    });

    test("inject multiple params", async () => {
        class Client {
            constructor(@Inject("name") private readonly name: string, @Inject("age") private readonly age: Number) {
            }

            public say() {
                return `My name is ${this.name}, and I'm ${this.age} years old`;
            }
        }

        const container = new Container();

        container.register("name", "John");
        container.register("age", 30);
        container.register("client", Client);

        const client = await container.resolve<Client>("client");
        const expected = client.say();
        expect(expected).toBe("My name is John, and I'm 30 years old");

    });

});
