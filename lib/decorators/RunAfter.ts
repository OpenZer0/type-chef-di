import { Keys } from "../Keys";

export function RunAfter(key: string) {
    return (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {

        const metadata: any = Reflect.getMetadata(Keys.AFTER_METHOD_KEY, target.constructor) || {};
        // @ts-ignore
        metadata[propertyKey] = key;

        Reflect.defineMetadata(Keys.AFTER_METHOD_KEY, metadata, target.constructor);
    };
}
