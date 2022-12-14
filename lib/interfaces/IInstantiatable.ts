import { IBaseDefinition } from "../definitions/definitionInterfaces/IBaseDefinition";

export type IInstantiationMode = "prototype" | "singleton";

export interface IInstantiatable {
    definition: IBaseDefinition;
    tags: string[];

    instantiate(): Promise<any>;
}
