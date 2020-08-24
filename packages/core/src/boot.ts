import { IApp } from './interfaces/application';
import container from './container';
import { IStaticallyRegistersDependencies } from './interfaces/generic';

/**
 * Boots an application.
 * 
 * 1. Registers any dependencies specified with the container (via static method on the App class.)
 * 2. Created a new instance of the class and resolves the dependencies via the container.
 * 
 * @param App 
 */
export async function boot(App: IStaticallyRegistersDependencies<IApp>) {
    // Resolve any dependencies required by the app.
    await App.registerDependencies(container);

    // Run the app.
    container.resolve(App);
}