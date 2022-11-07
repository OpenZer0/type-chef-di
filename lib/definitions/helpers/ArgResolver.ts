import { IResolver } from "../../interfaces/IResolver";
import { IInjectParamMeta } from "../../decorators/Inject";
import { Keys } from "../../Keys";

export class ArgResolver {

    constructor(private readonly resolver: IResolver) {
    }

    paramIsNotRequired(param: IInjectParamMeta): boolean {
        return !this.resolver.hasKeyInDefinition(param.key) && !param?.isRequired;
    }

    async resolveArguments(meta: any, context: any, decoratorKey: symbol | string): Promise<any[]> {
        let args: IInjectParamMeta[] = meta[decoratorKey];
        if (!args) return [];
        if (context) {
            args = this.mapContextToArgs(args, context);
        }

        const resolvedArgs = [];
        for (const arg of args) {
            if (!arg && this.resolver.options.enableAutoCreate) {
                resolvedArgs.push(Keys.OTHER_INJECTION_REQUIRED);
            } else if (this.paramIsNotRequired(arg)) {
                resolvedArgs.push(undefined);
            } else {
                resolvedArgs.push(typeof arg.key === "string" ? await this.resolver.resolve(arg.key, arg.isRequired) : await this.resolver.resolveByType(arg.key));
            }
        }
        return resolvedArgs;
    }

    mapContextToArgs(args: IInjectParamMeta[], ctx: any): IInjectParamMeta[] {
        return args.map((arg: IInjectParamMeta) => {
            if (ctx[arg.key]) {
                return {key: ctx[arg.key], isRequired: arg.isRequired, index: arg.index};
            }
            return arg;
        });
    }
}
