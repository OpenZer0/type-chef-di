import { Keys } from "../Keys";
import { Type } from "../interfaces/IType";

export function InjectProperty<I = any>(key: string | Type<I>) {
    return function inject<
        T extends  Record<K, I>,
        K extends string>(target: T, propertyKey: K) {
        const ctr = target.constructor;
        const metadata: any = Reflect.getMetadata(Keys.PROPERTY_INJECT_KEY, ctr) || {};
        metadata[propertyKey] = key;
        Reflect.defineMetadata(Keys.PROPERTY_INJECT_KEY, metadata, ctr);
    };
}
