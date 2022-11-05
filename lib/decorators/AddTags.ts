import { Keys } from "../Keys";

export function AddTags(tags: string[] | string) {
    return (
        target: Function
    ) => {
        if (typeof tags === "string") {
            tags = [tags];
        }

        const metadata: any = Reflect.getMetadata(Keys.ADD_TAGS_KEY, target.prototype) || {};
        metadata[Keys.ADD_TAGS_KEY] = tags;
        Reflect.defineMetadata(Keys.ADD_TAGS_KEY, metadata, target.prototype);
    };
}
