import { IMethodWrapper } from "../../lib/interfaces/IMethodWrapper";

export class MyMethodWrapper implements IMethodWrapper {

    run(next: Function, params: any[]): any {
        console.log("wrapper before..");
        next(...params);
        console.log("wrapper after..");
    }

}
