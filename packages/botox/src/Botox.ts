import { Generic, Inject } from '@/types';

/**
 * cache: true, construct: true = returns same instance of class every time
 * cache: false, construct: false / cache: true, construct: false = returns class constructor
 * cache: false, construct: true = returns new instance of class every time
 */
export const DEFAULT_DEPENDENCY_CONFIG: Inject.TDependencyConfig = {
    cache: true,
    construct: true,
};

export const INJECTABLES_PROPERTY = '__injected_arguments';

export class Container<TDepList extends Record<Inject.TDependencyIdentifier, any>> implements Inject.IContainer<TDepList> {
    protected dependencies: Inject.TDependencyMap<any> = {};

    readonly parent: null | Inject.IContainer<any>;

    constructor(parent?: Inject.IContainer<any>) {
        this.parent = parent || null;
    }

    public get(identifier: keyof TDepList)
    // : TDepList[keyof TDepList] // TODO: Commenting this out = "any", leaving it in created a union type
    {
        const dep = this.dependencies[identifier];

        if (!dep && this.parent) {
            return this.parent.get(identifier);
        }

        if (!dep) {
            throw new Error(`No dependency registered with key "${identifier}"`);
        }

        return this.prepareReturnedValue(dep.value, dep.config);
    }

    public register(
        identifier: keyof TDepList,
        value: Inject.TInjectable,
        config: Inject.TDependencyConfig = DEFAULT_DEPENDENCY_CONFIG,
    ): void {
        this.dependencies[identifier] = {
            config,
            value: this.prepareStoredValue(value, config, identifier),
        };
    }

    public unregister(identifier: keyof TDepList): void {
        delete this.dependencies[identifier];
    }

    public clone(): Inject.IContainer<any> {
        return new Container<TDepList>(this);
    }
    
    protected prepareReturnedValue(value: any, config: Inject.TDependencyConfig): any {
        if (!config.cache && config.construct) {
            return new value;
        }

        return value;
    }

    protected prepareStoredValue(value: any, config: Inject.TDependencyConfig, identifier: keyof TDepList): any {
        if (config.cache && config.construct) {
            if (!this.isConstructor(value)) {
                throw new Error(`Container error: provided value for "${identifier}" is not newable.`);
            }

            return new value;
        }

        return value;
    }

    /**
     * Determines whether a value can be constructed by calling "new"
     *
     * @param {any} value
     * @return {boolean}
     */
    protected isConstructor(value: any): boolean {
        return !!value.prototype && !!value.prototype.constructor.name;
    }
}

export const container = new Container();

export const DEFAULT_INJECTABLE_CONFIG: Inject.TInjectableConfig = {
    container: container,
}

function prepareInjectable(injectable: Generic.TConstructor<any>): void {
    injectable[INJECTABLES_PROPERTY] = injectable[INJECTABLES_PROPERTY] || [];
}

function augmentClass<T>(constructor: Generic.TConstructor<T>, config: Inject.TInjectableConfig): Generic.TConstructor<T> {
    class BotoxInjectable extends constructor {
        constructor(...args: any[]) {
            const maxArgs = Math.max(args.length, constructor[INJECTABLES_PROPERTY].length);
            let lastArgIndex = -1;
            const augmentedArgs = new Array(maxArgs)
                .fill(null)
                .map((val, index) => {
                    lastArgIndex++;
                    if (lastArgIndex !== index) {
                        throw new Error(`Optional constructor arguments cannot come before required ones in ${constructor.name}`);
                    }

                    const injectable = constructor[INJECTABLES_PROPERTY][index];

                    const values = [args[index], injectable && config.container.get(injectable.identifier)];
                    const value = values[0] || values[1];

                    if (!value) {
                        throw new Error(`Could not resolve "${injectable?.identifier || 'unkown'}" at argument #${index} in ${constructor.name}`);
                    }

                    return value;
                });

            super(...augmentedArgs);
        }
    }

    Object.defineProperty(BotoxInjectable, 'name', { value: constructor.name });

    return BotoxInjectable;
}

export function injectable(config: Inject.TInjectableConfig = DEFAULT_INJECTABLE_CONFIG) {
    return function InjectableFactory(target: any): any {
        prepareInjectable(target);
        return augmentClass(target, config);
    };
}

export function inject(identifier: Inject.TDependencyIdentifier, config: Inject.TDependencyConfig = DEFAULT_DEPENDENCY_CONFIG) {
    return function injectFactory(
        target: any,
        propertyKey: string | symbol,
        descriptor?: number,
    ): any {
        prepareInjectable(target);

        // let types = {
        //     "design:type": Reflect.getMetadata("design:type", target, propertyKey),
        //     "design:paramtypes": Reflect.getMetadata("design:paramtypes", target, propertyKey),
        //     "design:returntype": Reflect.getMetadata("design:returntype", target, propertyKey),
        // }

        if (descriptor === undefined) {
            return null;
        }

        target[INJECTABLES_PROPERTY][descriptor] = {
            config,
            identifier,
        };

        return propertyKey;
    }
}

export function make<T extends Generic.TConstructor<any> = Generic.TConstructor<any>>(constructor: Generic.TConstructor<T>, ...args: any[]): T {
    if (!constructor[INJECTABLES_PROPERTY]) {
        prepareInjectable(constructor);
    }

    // TODO: Cannot call make() and use a custom container
    const augmented = augmentClass(constructor, DEFAULT_INJECTABLE_CONFIG);
    return new augmented(...args);
}
