import { IDependencyContainer } from './container';

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
    registerDependencies(container: IDependencyContainer): Promise<void>;
}
