import { Container, Injectable } from "../../lib";

@Injectable
class SayService {

    public getString() {
        return "pizza";
    }
}

@Injectable
class SayService2 {

    public getString() {
        return "coffee";
    }
}


@Injectable
class Client {
    constructor(private readonly sayService: SayService, private readonly sayService2: SayService2) {
    }

    public say() {
        return `I like ${this.sayService.getString()} and ${this.sayService2.getString()}`;
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


async function run() {
    const container = new Container({enableAutoCreate: true});
    const service = await container.resolveByType<Service>(Service); // new Service(new Client(new SayService(), new SayService2()));
    console.log(service.check()); // client says: I like pizza and coffee
}

run();