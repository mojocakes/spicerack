/*
// register a singleton
container.register('IDENTIFIER', MyConstructor);
// register a constructor
container.register('IDENTIFIER', MyConstructor, { construct: false });
// register multiple
container.registerAll({
    'IDENTIFIER': MyConstructor,
    'IDENTIFIER_TWO': MyConstructorTwo,
});
// 
*/

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
            value: this.prepareStoredValue(value, config),
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

    protected prepareStoredValue(value: any, config: Inject.TDependencyConfig): any {
        if (config.cache && config.construct) {
            return new value;
        }

        return value;
    }
}

export const container = new Container();
container.register('A', class { name: 'Service A (INJECTED)' });

function prepareInjectable(injectable: Generic.TConstructor<any>): void {
    injectable[INJECTABLES_PROPERTY] = injectable[INJECTABLES_PROPERTY] || [];
}

export function injectable() {
    return function InjectableFactory(target: any): any {
        prepareInjectable(target);

        class BotoxInjectable extends target {
            constructor(...args: any[]) {
                const maxArgs = Math.max(args.length, target[INJECTABLES_PROPERTY].length);
                const augmentedArgs = new Array(maxArgs)
                    .fill(null)
                    .map((val, index) => {
                        const injectable = target[INJECTABLES_PROPERTY][index];

                        const values = [args[index], container.get(injectable.identifier)];
                        const value = values[0] || values[1];

                        if (!value) {
                            throw new Error(`Could not resolve argument #${index} in ${target.name} (${injectable})`);
                        }

                        return value;
                    });

                super(...augmentedArgs);
            }
        }
        Object.defineProperty(BotoxInjectable, 'name', { value: target.name });

        return BotoxInjectable;

        // return target;
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

export function make<T extends Object = any>(constructor: Generic.TConstructor<T>): T {
    const augmented = injectable()(constructor);
    return augmented();
}
