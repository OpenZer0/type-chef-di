import { Keys } from "../Keys";

export function InjectProperty<I = any>(key: string) {
    return function inject<
        T extends  Record<K, I>,
        K extends string>(target: T, propertyKey: K) {
        const ctr = target.constructor;
        const metadata: any = Reflect.getMetadata(Keys.PROPERTY_INJECT_KEY, ctr) || {};
        metadata[propertyKey] = key;
        Reflect.defineMetadata(Keys.PROPERTY_INJECT_KEY, metadata, ctr);
    };
}
