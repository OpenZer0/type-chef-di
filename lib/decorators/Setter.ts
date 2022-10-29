import { Keys } from "../Keys";

export function Setter() {
    return (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const metadata: any = Reflect.getMetadata(Keys.SETTER_METHOD_PROPERTY_DECORATOR_KEY, target.constructor) || {};

        if (metadata[Keys.SETTER_METHOD_PROPERTY_DECORATOR_KEY] === undefined) {
            metadata[Keys.SETTER_METHOD_PROPERTY_DECORATOR_KEY] = [];
        }

        metadata[Keys.SETTER_METHOD_PROPERTY_DECORATOR_KEY].push(propertyKey); // push setter methods.

        Reflect.defineMetadata(Keys.SETTER_METHOD_PROPERTY_DECORATOR_KEY, metadata, target.constructor);
    };
}
