import { IBaseDefinition } from "../../definitions/definitionInterfaces/IBaseDefinition";
import { IResolver } from "../../interfaces/IResolver";

export interface IInitializer {
    resolver: IResolver;
    run(resolvedInstance: any, definition: IBaseDefinition): Promise<any>;
}
