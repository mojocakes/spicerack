import { IApp } from '../../types/src/application';
import { IDependencyContainer } from './interfaces/container';
import { Service } from './services';

/**
 * The App class is typically the root of a project,
 * although in more complicated setups you may have more than one.
 * 
 * It registers dependencies with the container,
 * and performs any other initial setup.
 */
export abstract class App extends Service implements IApp {
    /**
     * Registers any required services with the dependency container.
     * 
     * @param {IDependencyContainer} container
     * @returns {void}
     */
    public static async registerDependencies(container: IDependencyContainer): Promise<void> {
        //
    }
}
