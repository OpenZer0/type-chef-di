import { Keys } from "../Keys";
import { Type } from "../interfaces/IType";
import { IRunAfter } from "../interfaces/IRunAfter";

export function RunAfter(key: string | Type<IRunAfter>) {
    return (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {

        const metadata: any = Reflect.getMetadata(Keys.AFTER_METHOD_KEY, target.constructor) || {};
        // @ts-ignore
        metadata[propertyKey] = key;

        Reflect.defineMetadata(Keys.AFTER_METHOD_KEY, metadata, target.constructor);
        Reflect.defineMetadata(Keys.METHOD_DESCRIPTOR_KEY, {...descriptor}, target.constructor);
    };
}
