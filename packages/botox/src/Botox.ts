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

class Container implements Inject.IContainer {
    protected dependencies: Inject.TDependencyMap = {};

    readonly parent: null | Inject.IContainer;

    constructor(parent?: Inject.IContainer) {
        this.parent = parent || null;
    }

    get<T extends Inject.TInjectable = any>(identifier: Inject.TDependencyIdentifier): undefined | T {
        const dep = this.dependencies[identifier];

        if (!dep && this.parent) {
            return this.parent.get(identifier);
        }

        if (!dep) {
            return;
        }

        return this.prepareReturnedValue(dep.value, dep.config);
    }

    register(
        identifier: Inject.TDependencyIdentifier,
        value: Inject.TInjectable,
        config: Inject.TDependencyConfig = DEFAULT_DEPENDENCY_CONFIG,
    ): void {
        this.dependencies[identifier] = {
            config,
            value: this.prepareStoredValue(value, config, identifier),
        };
    }

    unregister(identifier: Inject.TDependencyIdentifier): void {
        delete this.dependencies[identifier];
    }

    public clone(): Inject.IContainer {
        return new Container(this);
    }
    
    protected prepareReturnedValue(value: any, config: Inject.TDependencyConfig): any {
        if (!config.cache && config.construct) {
            return new value;
        }

        return value;
    }

    protected prepareStoredValue(value: any, config: Inject.TDependencyConfig, identifier: Inject.TDependencyIdentifier): any {
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

function prepareInjectable(injectable: Generic.TConstructor<any>): void {
    injectable[INJECTABLES_PROPERTY] = injectable[INJECTABLES_PROPERTY] || [];
}

function augmentClass<T>(constructor: Generic.TConstructor<T>): Generic.TConstructor<T> {
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

                    const values = [args[index], injectable && container.get(injectable.identifier)];
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

export function injectable() {
    return function InjectableFactory(target: any): any {
        prepareInjectable(target);
        return augmentClass(target);
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

    const augmented = augmentClass(constructor);
    return new augmented(...args);
}
