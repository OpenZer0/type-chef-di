export class Keys {
    static readonly INJECT_PROPERTY_DECORATOR_KEY: unique symbol = Symbol("INJECT_PROPERTY_DECORATOR_KEY");
    static readonly FACTORY_METHOD_PROPERTY_DECORATOR_KEY: unique symbol = Symbol("FACTORY_METHOD_PROPERTY_DECORATOR_KEY");
    static readonly INIT_METHOD_PROPERTY_DECORATOR_KEY: unique symbol = Symbol("INIT_METHOD_PROPERTY_DECORATOR_KEY");
    static readonly SETTER_METHOD_PROPERTY_DECORATOR_KEY: unique symbol = Symbol("SETTER_METHOD_PROPERTY_DECORATOR_KEY");
    static readonly IS_REQUIRED_PARAM: unique symbol = Symbol("IS_REQUIRED_PARAM");
    static readonly PROPERTY_INJECT_KEY: unique symbol = Symbol("PROPERTY_INJECT_KEY");
    static readonly BEFORE_METHOD_KEY: unique symbol = Symbol("BEFORE_METHOD_KEY");
    static readonly AFTER_METHOD_KEY: unique symbol = Symbol("AFTER_METHOD_KEY");
    static readonly METHOD_WRAPPER_KEY: unique symbol = Symbol("METHOD_WRAPPER_KEY");
    static readonly ADD_TAGS_KEY: unique symbol = Symbol("ADD_TAGS_KEY");
    static readonly INJECTABLE_KEY: unique symbol = Symbol("INJECTABLE_KEY");
    static readonly OTHER_INJECTION_REQUIRED: unique symbol = Symbol("OTHER_INJECTION_REQUIRED");
    static readonly AUTO_CREATE_DEPENDENCY: unique symbol = Symbol("AUTO_CREATE_DEPENDENCY");

}
