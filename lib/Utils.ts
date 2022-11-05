import { Type } from "./interfaces/IType";

export class Utils {

    static isClass = (fn: any) => /^\s*class/.test(fn?.toString());

    static getRequiredParamLength(constructor: any) {
        return constructor.length || 0;
    }

    static getMeta<R>(key: string | symbol, ctr: Type, def: R): R {
        if (!Utils.isClass(ctr)) return def;
        const meta = Reflect.getMetadata(key, ctr.prototype) || {};
        return meta[key] || def;
    }
}
