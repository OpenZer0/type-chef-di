export class Utils {

    static isClass = (fn: any) => /^\s*class/.test(fn?.toString());

    static getRequiredParamLength(constructor: any) {
        return constructor.length || 0;
    }
}
