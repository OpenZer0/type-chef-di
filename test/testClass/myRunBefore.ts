import { IRunBefore } from "../../lib/interfaces/IRunBefore";

export class MyRunBefore implements IRunBefore {

    run() {
        console.log("run before....");
    }
}
