import { IResolver } from "../../interfaces/IResolver";
import { IParam } from "../../decorators/Inject";
import { Keys } from "../../Keys";

export class ArgResolver {

    constructor(private readonly resolver: IResolver) {
    }

    paramIsNotRequired(param: IParam): boolean {
        return !this.resolver.hasKeyInDefinition(param.key) && !param?.isRequired;
    }

    async resolveArguments(meta: any, context: any, decoratorKey: symbol | string): Promise<any[]> {
        let args: IParam[] = meta[decoratorKey];
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
                resolvedArgs.push(await this.resolver.resolve(arg.key, arg.isRequired));
            }
        }
        return resolvedArgs;
    }

    mapContextToArgs(args: IParam[], ctx: any): IParam[] {
        return args.map((arg: IParam) => {
            if (ctx[arg.key]) {
                return {key: ctx[arg.key], isRequired: arg.isRequired, index: arg.index};
            }
            return arg;
        });
    }
}
