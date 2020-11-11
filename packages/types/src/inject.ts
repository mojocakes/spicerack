export namespace Inject {
    // The dependency injection container.
    export interface IContainer {
        /**
         * Retrieves a service or value from the container.
         * 
         * @param {TServiceIdentifier} identifier
         * @returns {T = any}
         */
        get<T = any>(identifier: TServiceIdentifier): T;
        
        /**
         * Registers a service or value with the container.
         * 
         * @param {TInjectable} injectable
         * @param {TServiceIdentifier=} identifier
         * @returns {void}
         */
        register(injectable: TInjectable, identifier: TServiceIdentifier): void;

        /**
         * Resolves a service's dependencies from the container.
         * 
         * @param {TInjectable} injectable
         * @returns {T = any}
         */
        resolve<T = any>(injectable: TInjectable): T;
    }

    // Types that can be registered with the container.
    // export type TInjectable =
    //     | {
    //         new(...args: any[]): any;
    //     }
    // ;
    export type TInjectable = any; // allows for abstract classes

    // Available service identifiers.
    export type TServiceIdentifier = string | symbol;
}
