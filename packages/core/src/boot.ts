import { App, Generic, Inject } from '@spicerack/types';
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
export async function boot<T extends App.IApp>(
    App: Generic.INewable<T>,
    /**
     * Register any dependencies with the container before the
     * application is booted.
     * 
     * @param {IDependencyContainer} container
     * @returns {Promise<void>}
     */
    registerDependencies?: (container: Inject.IContainer) => Promise<void>,
): Promise<T> {
    // Resolve any dependencies required by the app.
    if (registerDependencies) {
        await registerDependencies(container);
    }

    // Run the app.
    return container.resolve(App);
}
