![DALL·E 2022-11-12 23 28 30 - Pizza with code bacground, cyberpunk style (1) (1)](https://user-images.githubusercontent.com/48491140/201497104-1836aea0-27cc-42fa-909c-26219dda6d61.png)

# type-chef-di [![npm version](https://img.shields.io/npm/v/type-chef-di)](https://www.npmjs.com/package/type-chef-di) ![NPM Downloads](https://img.shields.io/npm/dw/type-chef-di)




[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/summary/new_code?id=OpenZer0_type-chef-di)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=OpenZer0_type-chef-di&metric=bugs)](https://sonarcloud.io/summary/new_code?id=OpenZer0_type-chef-di)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=OpenZer0_type-chef-di&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=OpenZer0_type-chef-di)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=OpenZer0_type-chef-di&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=OpenZer0_type-chef-di)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=OpenZer0_type-chef-di&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=OpenZer0_type-chef-di)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=OpenZer0_type-chef-di&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=OpenZer0_type-chef-di)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=OpenZer0_type-chef-di&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=OpenZer0_type-chef-di)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=OpenZer0_type-chef-di&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=OpenZer0_type-chef-di)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=OpenZer0_type-chef-di&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=OpenZer0_type-chef-di)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=OpenZer0_type-chef-di&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=OpenZer0_type-chef-di)


## Type-chef-di is a general purpose dependency injection framework, focused on simplicity and extendability.

### Documentation: https://zer0-2.gitbook.io/type-chef-di

### Setup:

tsconfig.json:
```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  "target": "es6"
}
```
Install the npm package:

```sh
npm install type-chef-di
```

https://www.npmjs.com/package/type-chef-di

One of the feature that may be interesting for you is the Type resolution. essentially, you can resolve types without registering them to the DI. The DI container will try to resolve by looking the constructor param types recuresively.

```typescript
import { Container, Injectable } from "type-chef-di";

@Injectable()
class SayService {

    public getString() {
        return "pizza";
    }
}

@Injectable()
class SayService2 {

    public getString() {
        return "coffee";
    }
}


@Injectable()
class Client {
    constructor(private readonly sayService: SayService,
                private readonly sayService2: SayService2) {
    }

    public say() {
        return `I like ${this.sayService.getString()} and ${this.sayService2.getString()}`;
    }
}

@Injectable({instantiation: "singleton"})
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
```

You can choose the instantiation mode: singleton / new instance.

but if you want to use interfaces, you can do so with this automatic resolution just use the @Inject decorator with the type.

```typescript
constructor(@Inject<IOptions>(OptionClass) options: IOptions,
 @Inject<IOptions>(OptionClass2) options2: IOptions) {}
```

Registration process can be manual or automatic.
Manually eg container.register("key", value), .registerTypes([Service, FoodFactory])
then you can inject the registered key into the constructor with the Inject('key') decorator.

```typescript
class Service {

    constructor(@Inject("serviceStr") private readonly value: string) {
    }

    public say() {
        return `${this.value}`;
    }
}
class Client {

    constructor(
             @Inject("clientStr") private readonly value: string,
             @Inject("service") private readonly service: Service // or  @Inject<IService>(Service)
             ) {
    }

    public say() {
        return `I like ${this.value} and ${this.service.say()}`;
    }
}


async function run() {
    const container = new Container();
    container.register("clientStr", "coffee").asConstant();
    container.register("serviceStr", "pizza").asConstant();
    container.register("service", Service).asPrototype();
    container.register("client", Client).asSingleton();
    const service = await container.resolve<Client>("client"); // new Service('pizza');
    const service2 = await container.resolveByType<Client>(Client); // new Client('coffee', new Service('pizza'));
    console.log(service.say()); // client says: I like pizza and coffee
    console.log(service2.say()); // client says: I like pizza and coffee
}

run();
```

If you want more control over the injection process you can use the token injection. This lets you inject the value that you registered.

The DI can't resolve automatically the primitive types / interfaces: eg. string, number, interfaces... You must specify  the value and use the @Inject decorator for that

```typescript
constructor(service: Service,
 @Inject('options') options: IOptions)

constructor(service: Service,
 @Inject<IOptions>(OptionClass) options: IOptions,
 @Inject<IOptions>(OptionClass2) options2: IOptions)
```

Explanation:

`service: Service`: if {enableAutoCreate: true} you don't have to do anything it will register and resolve automatically. if false you need to register before resolution eg container.registerByType(Service)  but you can inject it with @Inject if you want.

`@Inject('options') options: IOptions` - this cannot be resolved automatically because this is just a general interface (IOptions), you need to specify (by registering) a token eg 'option' and inject via @Inject("key")

`@Inject(OptionClass) options: IOptions, @Inject<IOptions>(OptionClass2) options2: IOptions)`  - You can directly specify the class that you want to inject, this way you don't need to register the OptionClass (the generic will check the passed type correctness)


If the key is not registered, the resolution process will fail.
You can check the container after you finished the configuration:
container.done()
This will try to resolve all the registered keys, and types.


After instatniation you can also run Initializers eg. MethodWrapper, RunBefore, InitMethod erc. or you can easily create your own.

```typescript
export class MeasureWrapper implements IMethodWrapper {
    constructor() { // DI will resolve dependencies (type & key injection)
    }

    async run(next: Function, params: any[]) {
        // run code before
        const start = new Date().getTime();
        
        // call original fn
        const res = await next() // (params automatically added)
        
        //run code after
        const end = new Date().getTime();
        const time = end - start;
        console.log(`Execution time: ${time} ms`)
        
        // return fn result
        return res;
    }

}

 class Test {

    @MeasureWrapper(MeasureWrapper) // or use registerd string key
    foo(p1:string, p2: string){
        console.log("original fn: ", p1, p2)
        // ...
    }       
}

/* After Test.foo is called
 it will log the  `Execution time: ${time} ms` because of the @MeasureWrapper */
 

```


There are a few more features:

```typescript
@RunBefore(key: string | Type<IRunBefore>) // run before method call
@RunAfter(key: string | Type<IRunAfter>) // run after method call
@AddTags(tags) // resolve tagged classes
@InitMethod() // run init fuction after instantiation
@InjectProperty<T>(key: string | Type<T>) // @Inject just for class props
```
I tried to keep this readme short, if you are interested, check the documentation https://zer0-2.gitbook.io/type-chef-di/

There are still things to improve and document, you can help,
if you would like to improve the documentation, click on the "edit on GitHub" button and make a pull request.

![Maurer Krisztián](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yvztdtigbpibxyjhiby7.png)
