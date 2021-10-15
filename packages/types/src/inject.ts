import { Generic } from "./generic";

export namespace Inject {
    // The dependency injection container.
    export interface IContainer<TDepList extends Record<Inject.TDependencyIdentifier, any>> {
        /**
         * Retrieves a service or value from the container.
         * 
         * @param {keyof TDepList} identifier
         * @returns {undefined | T}
         */
        get(identifier: keyof TDepList): TDepList[keyof TDepList];
        
        /**
         * Registers a service or value with the container.
         * 
         * @param {keyof TDepList=} identifier
         * @param {TInjectable} value
         * @param {TDependencyConfig=} config
         * @returns {void}
         */
        register(
            identifier: keyof TDepList,
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

        readonly parent: null | IContainer<any>;

        clone(): IContainer<any>;
    }

    export type TInjectable = Generic.TConstructor<any>;

    export type TInjectableConfig = {
        container: IContainer<any>;
    };

    export type TDependencyIdentifier = string | number;

    export type TDependencyConfig = {
        cache?: boolean;
        construct?: boolean;
    };

    export type TDependency<T extends Object = any> = T | Generic.TConstructor<T>;

    export type TDependencyMap<TIdentifiers extends TDependencyIdentifier = TDependencyIdentifier> = Record<TIdentifiers, { value: TDependency, config: TDependencyConfig }>;
}
