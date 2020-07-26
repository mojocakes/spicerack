import { IApp } from './interfaces/application';
import { IDependencyContainer } from './interfaces/container';
import { Service } from './Service';
import rootContainer from './container';

/**
 * The App class is typically the root of a project,
 * although in more complicated setups you may have more than one.
 * 
 * It registers dependencies with the container,
 * and performs any other initial setup.
 */
export abstract class App extends Service implements IApp {
    protected container: IDependencyContainer = rootContainer;

    constructor() {
        super();
        this.registerDependencies = this.registerDependencies.bind(this);

        this.ready = this.registerDependencies(this.container).then(this.boot);
    }

    /**
     * Registers any required services with the dependency container.
     * 
     * @param {IDependencyContainer} container
     * @returns {void}
     */
    protected async registerDependencies(container: IDependencyContainer): Promise<void> {
        //
    }
}
