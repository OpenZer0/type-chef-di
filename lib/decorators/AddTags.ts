import { Keys } from "../Keys";

export function AddTags(tags: any) {
    return (
        target: object
    ) => {
        const metadata: any = Reflect.getMetadata(Keys.ADD_TAGS_KEY, target.constructor) || {};
        metadata[Keys.ADD_TAGS_KEY] = tags;
        Reflect.defineMetadata(Keys.ADD_TAGS_KEY, metadata, target.constructor);
    };
}
