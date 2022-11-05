import { Container } from "../lib/Container";
import { AddTags } from "../lib/decorators/AddTags";

@AddTags("tag1")
class Foo1 {
    name = "foo1";

}

@AddTags(["tag2", "tagMultiple"])
class Foo2 {
    name = "foo2";

}

@AddTags(["tag3", "tagMultiple"])
class Foo3 {
    name = "foo3";
}

describe("Tag test", () => {
    test("Resolve Tags", async () => {
        const container = new Container();
        container.registerTypes([Foo1, Foo2, Foo3]);

        const tagMultipleResult = await container.resolveByTags( "tagMultiple");
        expect(!!tagMultipleResult.find(instance => instance.name === "foo2") && !!tagMultipleResult.find(instance => instance.name === "foo3")).toBe(true);
        const tag1Result = await container.resolveByTags( "tag1");
        expect(!!tag1Result.find(instance => instance.name === "foo1")).toBe(true);
        const multiResult = await container.resolveByTags( ["tagMultiple", "tag1"]);
        expect(!!multiResult.find(instance => instance.name === "foo2") && !!multiResult.find(instance => instance.name === "foo3") && !!multiResult.find(instance => instance.name === "foo1")).toBe(true);
    });
});
