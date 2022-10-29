import { Keys } from "../Keys";

export function InjectProperty(key: string) {
    return function inject(target: object, propertyKey: any) {
        const ctr = target.constructor;
        const metadata: any = Reflect.getMetadata(Keys.PROPERTY_INJECT_KEY, ctr) || {};
        metadata[propertyKey] = key;
        Reflect.defineMetadata(Keys.PROPERTY_INJECT_KEY, metadata, ctr);
    };
}
