import { Container } from "../lib/Container";
import { IInitializer } from "../lib/modifiers/initializers/IInitializer";
import { IBaseDefinition } from "../lib/definitions/definitionInterfaces/IBaseDefinition";
import { IResolver } from "../lib/interfaces/IResolver";

class StatusInitializer implements IInitializer {
    constructor(readonly resolver: IResolver) {
    }

    run(resolvedInstance: any, definition: IBaseDefinition): Promise<any> {
        resolvedInstance.status = "init";
        return resolvedInstance;
    }
}

class Service {
    status: string = "none";

    public getStatus() {
        return this.status;
    }
}

describe("IInitializer tests", () => {

    test("should add initializer", async () => {
        const container = new Container({enableAutoCreate: true, initializers: [StatusInitializer]});
        expect(container.initializers.initializers.find((initializer) =>  initializer instanceof StatusInitializer)).not.toBe(undefined);
    });

    test("should modify the instance", async () => {
        const container = new Container({enableAutoCreate: true, initializers: [StatusInitializer]});
        const service = await container.resolveByType<Service>(Service);
        expect(service.getStatus()).toBe("init");
    });
});
