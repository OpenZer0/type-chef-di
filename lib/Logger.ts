import { logLevelType } from "./Container";

export class Logger {
    constructor(private readonly ctx: string, private readonly logLevel: logLevelType) {
    }

    private logStr(message: string, ctx?: string) {
        return `[type-chef-di][${ctx || this.ctx}] ${message}`;
    }

    debug(msg: string, ctx?: string) {
        if (this.logLevel === "debug") {
            console.log(this.logStr(msg, ctx));
        }
    }
}
