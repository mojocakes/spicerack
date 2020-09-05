import { Inject } from './inject';

// "make" method is supposed to be static but it doesn't work
export namespace Generic {
    export interface IFactory<T> {
        new(...args: any[]): any;
        make<A extends []>(...args: A): T;
    }

    export interface IService {
        /**
         * Resolves when the service can be utilised.
         * 
         * @var {Promise<any>}
         */
        readonly ready: Promise<any>;
    }

    export interface IStaticallyRegistersDependencies<T> {
        new(...args: any[]): T
    
        /**
         * Register any dependencies with the container before the
         * application is booted.
         * 
         * @param {IDependencyContainer} container
         * @returns {Promise<void>}
         */
        registerDependencies(container: Inject.IContainer): Promise<void>;
    }
}
