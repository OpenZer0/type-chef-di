import { instantiationMode } from "../../interfaces/IInstantiatable";

export interface IBaseDefinition {
    instantiationMode: instantiationMode;
    key: string;
    content: any;
}
