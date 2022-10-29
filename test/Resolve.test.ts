import { Container } from "../lib/Container";
import { Inject } from "../lib/decorators/Inject";
import { Address } from "./testClass/Address";
import { FactoryClass } from "./testClass/FactoryClass";
import { InitMethod } from "../lib/decorators/InitMethod";
import { Setter } from "../lib/decorators/Setter";


describe("resolve tests", () => {
    describe("Constant tests", () => {

        test("resolve string constant test", async () => {
            const container = new Container();
            container.register("constant", "insertCreativeName");
            const expected = await container.resolve<string>("constant");
            expect(expected).toBe("insertCreativeName");
        });

        test("resolve integer constant test", async () => {
            const container = new Container();
            container.register("constant", 123124);
            const expected = await container.resolve<Number>("constant");
            expect(expected).toBe(123124);
        });

        test("resolving undefined", async () => {
            const container = new Container();
            const undef = undefined;
            container.register("undefined", undef);
            const expected = await container.resolve("undefined");
            expect(expected).toBeUndefined();
        });

        test("resolve function  test", async () => {
            const container = new Container();
            container.register("function", (value: string) => {
                return value;
            });
            const expected = await container.resolve<Function>("function");
            expect(expected("function param")).toBe("function param");
        });


        test("resolving promise", async () => {
            const container = new Container();
            const promise = new Promise((resolve, reject) => {
                resolve("promise res");
            });
            container.register("Promise", promise).asConstant();

            const expected = container.resolve("Promise");
            expect(await expected).toBe(await promise);
        });
    });

    describe("Class tests", () => {
        test("resolve class without dependency", async () => {
            class A {
                value = "testVal";

                getVal() {
                    return this.value;
                }

                constructor() {
                }
            }

            const container = new Container();

            container.register("classWithoutDependency", A);
            const expected = await container.resolve<A>("classWithoutDependency");
            expect(expected.getVal()).toBe("testVal");
        });

        test("resolve class with multiple lvl of dependency test", async () => {
            const container = new Container();

            class Client {

                constructor(@Inject("value") private readonly value: string) {
                }

                public say() {
                    return `hello ${this.value}`;
                }
            }

            class Service {

                constructor(@Inject("client") private readonly client: Client) {
                }

                public check() {
                    return `client says: ${this.client.say()}`;
                }
            }

            container.register("value", "world").asConstant();
            container.register("client", Client);
            container.register("service", Service);
            const service = await container.resolve<Service>("service");
            const expected = service.check();
            expect(expected).toBe("client says: hello world");
        });

        test("Resolve changed up register test", async () => {
            class Client {
                constructor(@Inject("value") private readonly value: string) {
                }

                public say() {
                    return `hello ${this.value}`;
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
            container.register("service", Service);
            container.register("client", Client);
            container.register("value", "world");

            const client = await container.resolve("client");
            const service = await container.resolve<Service>("service");

            const expected = service.check();
            expect(expected).toBe("client says: hello world");
        });
    });

    test("registering twice and resolving", async () => {
        const container = new Container();
        const sym = "asd";
        const sym2 = "dsa";
        container.register("key", sym);
        container.register("key", sym2);
        const expected = await container.resolve("key");
        expect(expected).toBe(sym2);
    });


    test("resolving an object", async () => {
        const container = new Container();
        const addr = new Address("Zenta", "NK", "3");
        container.register("objectKey", new Address("Zenta", "NK", "3"));
        const expected = await container.resolve("objectKey");
        expect(expected).toStrictEqual(addr);
    });

    test("resolving empty-string symbol", async () => {
        const container = new Container();
        const variable = "asd";
        container.register("", variable);
        const expected = await container.resolve("");
        expect(expected).toBe(variable);
    });

});


describe("containerTest  test", () => {
    test("containerTest fail", async () => {
        const container = new Container();

        const firstFactoryParam = "firstFactoryParam";
        const secondFactoryParam = "secondFactoryParam";

        container.register("factoryMethodKey1", firstFactoryParam).asConstant();
        container.register("factoryMethodKey2", secondFactoryParam).asConstant();

        container.register("factoryKey", FactoryClass).asFactory();
        try {
            await container.containerTest();
            fail("container test should be fail");
        } catch (err) {
            expect(err).not.toBeNull();
        }

    });
    test("not valid resolve", async () => {
        const container = new Container();
        try {
            container.register("asd", "asd").asFactoryResult("string");
            // const expected = ;
            expect(await container.resolve("asd")).toThrow("factoryKey is not a factory");
        } catch (e) {
        }
    });
    test("resolving a singleton", async () => {
        const container = new Container();
        const address = new Address("Zenta", "NK", "3");
        container.register("address", address).asPrototype();
        const expected = await container.resolve("address");
        expect(expected).toBe(address);
    });

    test("containerTest don't fail", () => {
        const container = new Container();

        container.register("constantKey", "some constant").asConstant();

        container.register("function", (value: string) => {
            return value;
        });

        class Client {

            constructor(@Inject("value") private readonly value: string) {
            }

            public say() {
                return `hello ${this.value}`;
            }
        }

        class Service {

            constructor(@Inject("client") private readonly client: Client) {
            }

            public check() {
                return `client says: ${this.client.say()}`;
            }
        }

        container.register("value", "world").asConstant();
        container.register("client", Client);
        container.register("service", Service);

        try {
            container.containerTest();
        } catch (err) {
            fail("this should not fail." + err);
        }

    });

});


describe("@InitMethod  test", () => {
    test("Init decorator with args test", async () => {
        const container = new Container();

        class InitTestClass {
            panda: string = "sad panda";

            @InitMethod()
            initMethodTest(@Inject("param1") param1: string) {
                this.panda = `${param1}happy panda`;
            }

        }


        const param1 = "Very ";

        container.register("InitTestClass", InitTestClass);
        container.register("param1", param1);

        const initClass = await container.resolve<InitTestClass>("InitTestClass");
        expect(initClass.panda).toBe(`${param1}happy panda`);
    });

});

describe("@Setter  test", () => {
    test("Setter decorator test", async () => {
        const container = new Container();

        class SetterTestClass {
            panda: string = "sad panda";
            dragon: string = "sad dragon";

            @Setter()
            set pandaSetter(@Inject("param1") param1: string) {
                this.panda = param1;
            }

            @Setter()
            set dragonSetter(@Inject("param2") param2: string) {
                this.dragon = param2;
            }


            constructor() {
            }
        }


        const param1 = "happy panda";
        const param2 = "happy dragon";

        container.register("SetterTestClass", SetterTestClass);
        container.register("param1", param1);
        container.register("param2", param2);

        const initClass = await container.resolve<SetterTestClass>("SetterTestClass");
        expect(initClass.panda).toBe("happy panda");
        expect(initClass.dragon).toBe("happy dragon");
    });
    test("optional parameter setting", async () => {
        const container = new Container();

        class SetterTestClass {
            panda: string = "sad panda";

            @Setter()
            set pandaSetter(@Inject("param1") param1: string) {
                this.panda = param1;
            }

        }

        const param1 = "happy panda";
        container.register("SetterTestClass", SetterTestClass);
        container.register("param1", param1);

        const initClass = await container.resolve<SetterTestClass>("SetterTestClass");
        expect(initClass.panda).toBe("happy panda");

    });
    test("using optional parameter", async () => {
        const container = new Container();

        class SetterTestClass {
            panda: string = "sad panda";

            constructor(@Inject("param1") panda: string = "happy panda") {
                this.panda = panda;
            }
        }

        container.register("SetterTestClass", SetterTestClass);
        const initClass = await container.resolve<SetterTestClass>("SetterTestClass");
        expect(initClass.panda).toBe("happy panda");

    });

});
describe("optional parameter detect test", () => {
    test("optional test", async () => {
        const container = new Container();

        class TestClass {
            panda: string = "sad panda";
            dragon: string;
            test: string;

            constructor(@Inject("param1") panda: string,
                        @Inject("notFoundKey") dragon: string = "happy dragon",
                        @Inject("param1") test: string = "not good") {
                this.test = test;
                this.panda = panda;
                this.dragon = dragon;
            }
        }

        const param1 = "happy panda";
        const param2 = "sad dragon";
        container.register("SetterTestClass", TestClass);
        container.register("param1", param1);
        container.register("param2", param2);
        const initClass = await container.resolve<TestClass>("SetterTestClass");
        expect(initClass.panda).toBe("happy panda");
        expect(initClass.dragon).toBe("happy dragon");
        expect(initClass.test).toBe("happy panda");
    });

});

