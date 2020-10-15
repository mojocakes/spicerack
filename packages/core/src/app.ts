import * as Types from '@spicerack/types';
import { registerInjectable } from '@spicerack/inject';
import { Service } from './Service';

/**
 * The App class is typically the root of a project,
 * although in more complicated setups you may have more than one.
 * 
 * It registers dependencies with the container,
 * and performs any other initial setup.
 */
export abstract class App extends Service implements Types.App.IApp {
    /**
     * Registers any required services with the dependency container.
     * 
     * @param {Types.Inject.IContainer} container
     * @returns {void}
     */
    public static async registerDependencies(container: Types.Inject.IContainer): Promise<void> {
        //
    }
}

registerInjectable(App);
