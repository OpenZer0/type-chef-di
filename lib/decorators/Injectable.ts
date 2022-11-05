import { Keys } from "../Keys";
import { IInstantiationMode } from "../interfaces/IInstantiatable";


export interface IInjectableOptions {
    instantiation: IInstantiationMode;
}

export function Injectable(options: IInjectableOptions = {instantiation: "singleton"}) {
    return (
        target: Function
    ) => {
        const metadata: any = Reflect.getMetadata(Keys.INJECTABLE_KEY, target.prototype) || {};
        metadata[Keys.INJECTABLE_KEY] = options;
        Reflect.defineMetadata(Keys.INJECTABLE_KEY, metadata, target.prototype);
    };
}
