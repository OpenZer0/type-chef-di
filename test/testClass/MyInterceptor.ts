import { IInterceptor } from "../../lib/interfaces/IInterceptor";
import { Container } from "../../lib/Container";

export class MyInterceptor implements IInterceptor {

    intercept(container: Container): void {
        container.register("valami", "valami");
    }

}
