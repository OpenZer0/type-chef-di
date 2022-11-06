import { Keys } from "../Keys";

export function MethodWrapper< V extends TypedPropertyDescriptor<(...args: unknown[]) => void>>(key: string) {
    return (
        target: object,
        propertyKey: string,
        descriptor: V
    ) => {

        const metadata: any = Reflect.getMetadata(Keys.METHOD_WRAPPER_KEY, target.constructor) || {};
        // @ts-ignore
        metadata[propertyKey] = key;
        Reflect.defineMetadata(Keys.METHOD_WRAPPER_KEY, metadata, target.constructor);
        Reflect.defineMetadata(Keys.METHOD_DESCRIPTOR_KEY, {...descriptor}, target.constructor);
    };
}
