export interface IInitializer {
    run(resolvedInstance: any, definition: any): Promise<any>;
}