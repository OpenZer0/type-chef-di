import { Keys } from "../Keys";

export function MethodWrapper(key: string) {
    return (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {

        const metadata: any = Reflect.getMetadata(Keys.METHOD_WRAPPER_KEY, target.constructor) || {};
        // @ts-ignore
        metadata[propertyKey] = key;

        Reflect.defineMetadata(Keys.METHOD_WRAPPER_KEY, metadata, target.constructor);
    };
}
