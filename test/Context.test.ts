import { Container } from "../lib/Container";
import { Inject } from "../lib/decorators/Inject";


class Client {

    constructor(@Inject("value") private readonly value: string, @Inject("value2") private readonly value2: string) {
    }

    public getValue() {
        return this.value;
    }

    public getValue2() {
        return this.value2;
    }
}

const txt1 = "some string";
const txt2 = "some other string";
const container = new Container();

describe("Context test", () => {

    test("without context and one as singleton", async () => {
        container.register("value2", "idk");
        container.register("value", "world").asSingleton();
        container.register("Client3", Client);

        const Client3 = await container.resolve<Client>("Client3");
        const expected3 = Client3.getValue();
        expect(expected3).toBe("world");

        const expected4 = Client3.getValue2();
        expect(expected4).toBe("idk");

    });
    test("with context and a constant", async () => {
        container.register("txt1", txt1);
        container.register("value2", "idk");
        container.register("Client1", Client).withContext({"value": "txt1"});

        const Client1 = await container.resolve<Client>("Client1");
        const expected5 = Client1.getValue();
        expect(expected5).toBe(txt1);

        const expected6 = Client1.getValue2();
        expect(expected6).toBe("idk");

    });
    test("with context", async () => {
        container.register("txt1", txt1);
        container.register("txt2", txt2);
        container.register("Client2", Client).withContext({"value": "txt2", "value2": "txt1"});

        const Client2 = await container.resolve<Client>("Client2");
        const expected = Client2.getValue();
        expect(expected).toBe(txt2);

        const expected2 = Client2.getValue2();
        expect(expected2).toBe(txt1);

    });
});
