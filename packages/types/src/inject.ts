import { Generic } from "./generic";

export namespace Inject {
    // The dependency injection container.
    export interface IContainer {
        /**
         * Retrieves a service or value from the container.
         * 
         * @param {TDependencyIdentifier} identifier
         * @returns {undefined | T}
         */
        get<T extends TInjectable = any>(identifier: TDependencyIdentifier): undefined | T;
        
        /**
         * Registers a service or value with the container.
         * 
         * @param {TDependencyIdentifier=} identifier
         * @param {TInjectable} value
         * @param {TDependencyConfig=} config
         * @returns {void}
         */
        register(
            identifier: TDependencyIdentifier,
            value: TInjectable,
            config?: TDependencyConfig,
        ): void;

        /**
         * Resolves a service's dependencies from the container.
         * 
         * @param {TInjectable} injectable
         * @returns {T = any}
         */
        // resolve<T = any>(injectable: TInjectable): T;

        readonly parent: null | IContainer;

        clone(): IContainer;
    }

    export type TInjectable = Generic.TConstructor<any>;

    export type TInjectableConfig = {
        container: IContainer;
    };

    export type TDependencyIdentifier = string | number;

    export type TDependencyConfig = {
        cache?: boolean;
        construct?: boolean;
    };

    export type TDependency<T extends Object = any> = T | Generic.TConstructor<T>;

    export type TDependencyMap = Record<TDependencyIdentifier, { value: TDependency, config: TDependencyConfig }>;
}
