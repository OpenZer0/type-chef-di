import { Container } from "../../lib/Container";
import { Injectable } from "../../lib/decorators/Injectable";
import { Inject } from "../../lib/decorators/Inject";

describe("Inject Without Keys && without registerTypes (automatic injection and registration) enableAutoCreate", () => {
    test("[1.] enableAutoCreate", async () => {
        const container = new Container({enableAutoCreate: true, initializers: []});

        const service = await container.resolveByType<Service>(Service);
        expect(service.check()).toBe("client says: hello something and something else str");
    });

    test(" [2.] enableAutoCreate && default params", async () => {
        const container = new Container({enableAutoCreate: true, initializers: []});

        const service2 = await container.resolveByType<Service2>(Service2);
        expect(service2.test()[0]).toBe("default str test");
        expect(service2.test()[1]).toBe("hello something");
    });

    test("Inject by type without registerTypes && default params && enableAutoCreate false", async () => {
        const container = new Container({enableAutoCreate: false, initializers: []});

        try {
            await container.resolveByType<Service2>(Service2);
        } catch (err) {
            expect("throw error").toBe("throw error");
            return;
        }

        expect("throw error").toBe("don't throw error");
    });

    test("@Inject(key) with - Inject by type without registerTypes && default params && enableAutoCreate", async () => {
        const container = new Container({enableAutoCreate: true, initializers: []});

        container.register("Client3", Client3);
        const service3 = await container.resolveByType<Service3>(Service3);
        expect(service3.test()[0]).toBe("default str test, injected");
        expect(service3.test()[1]).toBe("hello something");
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


// [3.]

@Injectable
class Client3 {
    constructor(private readonly something: Something, private readonly defaultStr = "default str test, injected") {
    }

    public say() {
        return `hello ${this.something.getValue()}`;
    }

    public getDefaultStr() {
        return this.defaultStr;
    }
}


@Injectable
class Service3 {
    constructor(@Inject("Client3") private readonly client: IClient) {
    }

    public test() {
        return [this.client.getDefaultStr(), this.client.say()];
    }
}


export interface IClient {
    say(): any;

    getDefaultStr(): any;
}
