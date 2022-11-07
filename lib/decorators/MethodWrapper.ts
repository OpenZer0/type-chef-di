import { Keys } from "../Keys";
import { Type } from "../interfaces/IType";
import { IMethodWrapper } from "../interfaces/IMethodWrapper";
import "reflect-metadata";

export function MethodWrapper(key: string | Type<IMethodWrapper>) {
    return (
        target: object,
        propertyKey: string,
        descriptor: any
    ) => {

        const metadata: any = Reflect.getMetadata(Keys.METHOD_WRAPPER_KEY, target.constructor) || {};
        // @ts-ignore
        metadata[propertyKey] = key;
        Reflect.defineMetadata(Keys.METHOD_WRAPPER_KEY, metadata, target.constructor);
        Reflect.defineMetadata(Keys.METHOD_DESCRIPTOR_KEY, {...descriptor}, target.constructor);
    };
}
