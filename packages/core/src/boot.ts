import { App, Generic } from '@spicerack/types';
import { container } from '@spicerack/inject';

/**
 * Boots an application.
 * 
 * 1. Registers any dependencies specified with the container (via static method on the App class.)
 * 2. Created a new instance of the class and resolves the dependencies via the container.
 * 
 * @param {Generic.IStaticallyRegistersDependencies<IApp>} App
 * @returns {Promise<IApp>}
 */
export async function boot<T extends App.IApp>(App: Generic.IStaticallyRegistersDependencies<T>): Promise<T> {
    // Resolve any dependencies required by the app.
    await App.registerDependencies(container);

    // Run the app.
    return container.resolve(App);
}
