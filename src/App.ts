import { Config } from './';
import { IContainer, IApp } from '@framework/types';
import { Service } from './Service';
import rootContainer from './container';

/**
 * The App class is the root of a project.
 * It registers dependencies with the container,
 * and performs any other initial setup.
 */
export abstract class App extends Service implements IApp {
    constructor(
        protected container: IContainer = rootContainer
    ) {
        super();
        this.register = this.register.bind(this);

        this.register();
    }

    protected register(): void {
        this.container.bind('config').to(Config);
    }
}
