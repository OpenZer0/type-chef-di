import { Container } from "../../lib/Container";
import { Injectable } from "../../lib/decorators/Injectable";

describe("Inject Without Keys (registerTypes)", () => {
    test("[1.] simple inject without keys and registerTypes", async () => {
        const container = new Container({enableAutoCreate: true});
        await container.registerTypes([
            Something,
            Client,
            Service,
            SomethingElse
        ]);

        const service = await container.resolveByType<Service>(Service);
        expect(service.check()).toBe("client says: hello something and something else str");
    });

    test(" [2.] inject by types && default params", async () => {
        const container = new Container({enableAutoCreate: true});
        await container.registerTypes([
            Something,
            Client2,
            Service2,
            SomethingElse
        ]);

        const service2 = await container.resolveByType<Service2>(Service2);
        expect(service2.test()[0]).toBe("default str test");
        expect(service2.test()[1]).toBe("hello something");
    });
});

// [1.] classes

@Injectable
class Something {

    public getValue() {
        return "something";
    }
}

@Injectable
class SomethingElse {

    public getValue() {
        return "something else str";
    }
}


@Injectable
class Client {
    constructor(private readonly something: Something, private readonly somethingElse: SomethingElse) {
    }

    public say() {
        return `hello ${this.something.getValue()} and ${this.somethingElse.getValue()}`;
    }
}

@Injectable
class Service {
    constructor(private readonly client: Client) {
    }

    public check() {
        return `client says: ${this.client.say()}`;
    }
}

// [2.] classes

@Injectable
class Client2 {
    constructor(private readonly something: Something, private readonly defaultStr = "default str test") {
    }

    public say() {
        return `hello ${this.something.getValue()}`;
    }

    public getDefaultStr() {
        return this.defaultStr;
    }
}

@Injectable
class Service2 {
    constructor(private readonly client: Client2) {
    }

    public test() {
        return [this.client.getDefaultStr(), this.client.say()];
    }
}
