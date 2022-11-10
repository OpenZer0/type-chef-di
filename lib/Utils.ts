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

    static logClass(ctr: any, missParamIndex?: number) {
        const constructorArgs = Reflect.getMetadata("design:paramtypes", ctr) || [];
        const classStr = `${ctr.name}(${constructorArgs.map((arg: any, i: number) => {
           if (i === missParamIndex) {
               return "?";
           }
           return  arg.name;
           // @ts-ignore
        }).join(", ")}) `;
        return classStr + (missParamIndex !== undefined ? `Please check the ${missParamIndex + 1}. param: ${constructorArgs[missParamIndex]?.name}` : "");
    }

    static isPrimitiveCtr(ctr: any) {
        return ctr.name === "String" || ctr.name === "Number";
    }
}
