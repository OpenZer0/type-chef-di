import { IInstantiationMode } from "../../interfaces/IInstantiatable";

export interface IBaseDefinition {
    instantiationMode: IInstantiationMode;
    key: string;
    content: any;
}
