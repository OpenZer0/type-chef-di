import { Keys } from "../Keys";

export function InitMethod() {
    return (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const metadata: any = Reflect.getMetadata(Keys.INIT_METHOD_PROPERTY_DECORATOR_KEY, target.constructor) || {};
        // @ts-ignore
        metadata[Keys.INIT_METHOD_PROPERTY_DECORATOR_KEY] = propertyKey;

        Reflect.defineMetadata(Keys.INIT_METHOD_PROPERTY_DECORATOR_KEY, metadata, target.constructor);
    };
}
