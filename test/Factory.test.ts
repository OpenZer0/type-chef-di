/* tslint:disable:quotemark */
import { Container } from "../lib/Container";
import { FactoryClass } from "./testClass/FactoryClass";

describe("Factory test", () => {
    test("Factory methods test", async () => {
        const container = new Container();

        const firstFactoryParam = "firstFactoryParam";
        const secondFactoryParam = "secondFactoryParam";
        const factoryConstructorPram1 = "factoryParam1 constant data";

        container.register('otherParam1', "replaced1").asConstant();
        container.register('otherParam2', "replaced2").asConstant();


        container.register('factoryParam1', factoryConstructorPram1).asConstant();
        container.register('factoryMethodKey1', firstFactoryParam).asConstant();
        container.register('factoryMethodKey2', secondFactoryParam).asConstant();

        container.register('factoryKey', FactoryClass).asFactory();
        const factory = await container.resolve<FactoryClass>('factoryKey');
        expect(factory.getValue()).toBe(factoryConstructorPram1);

        container.register('factoryResult', String).asFactoryResult('factoryKey');

        const factoryResult = await container.resolve<String>('factoryResult');
        expect(factoryResult).toBe("factoryMethodName result: value: " + firstFactoryParam + " value2: " + secondFactoryParam);

        container.register('factoryKey2', FactoryClass).asFactory('create2'); // call factoryObj.create2()
        container.register('factoryResult2', String).asFactoryResult('factoryKey2');
        const factoryResult2 = await container.resolve<FactoryClass>('factoryResult2');
        expect(factoryResult2).toBe('create2 result');

        const factory1 = await container.resolve<FactoryClass>('factoryKey');
        expect(factory1.getValue()).toBe(factoryConstructorPram1);


        // replace method param test
        container.register('factoryKey3', FactoryClass).asFactory();
        container.register('factoryResult3', String).asFactoryResult('factoryKey3').withMethodContext({
            'factoryMethodKey1': 'otherParam1',
            'factoryMethodKey2': 'otherParam2'
        });
        const factoryResult3 = await container.resolve<FactoryClass>('factoryResult3');
        expect(factoryResult3).toBe("factoryMethodName result: value: " + 'replaced1' + " value2: " + 'replaced2');

    });
    test("using unknown factory key", async () => {
        const container = new Container();
        try {
            expect(container.register('factoryResult', String).asFactoryResult('factoryKey')).toThrow("factoryKey is not a factory");
        } catch (e) {
        }

    });
    test("factory with context test", async () => {
        const txt1 = "some string";
        const container = new Container();
        container.register('factoryParam1', txt1);
        container.register('factoryKey3', FactoryClass).asFactory().withContext('factoryParam1');
        const expected = await container.resolve<FactoryClass>("factoryKey3");
        expect(expected.getValue()).toBe("some string");

    });

});
