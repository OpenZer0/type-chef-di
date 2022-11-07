import "reflect-metadata";
import { Keys } from "../Keys";
import { Type } from "../interfaces/IType";

/*
* Save meta for constructor parameter or function parameter
* */
export function Inject<T = any>(propertyKey?: string | Type<T>) {
    return (
        target: any,
        key: string | symbol,
        parameterIndex: number
    ) => {
        const ctrOrTarget = key ? target.constructor : target;
        const metaKey = key ? key : Keys.INJECT_PROPERTY_DECORATOR_KEY;

        const reqParamCount = target[key]?.length || target?.length;

        const metadata: any = Reflect.getMetadata(metaKey, ctrOrTarget) || {};
        if (metadata[metaKey] === undefined) {
            metadata[metaKey] = [];
            metadata[Keys.IS_REQUIRED_PARAM] = [];
        }

        const param: IInjectParamMeta = {key: propertyKey, isRequired: (parameterIndex < reqParamCount), index: parameterIndex};

        // @ts-ignore
        metadata[metaKey][parameterIndex] = param;
        Reflect.defineMetadata(metaKey, metadata, ctrOrTarget);
    };
}

export interface IInjectParamMeta {
    key: any;
    isRequired: boolean;
    index: number;
}
