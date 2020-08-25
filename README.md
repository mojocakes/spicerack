**Spicerack** is a lightweight framework written in Typescript for both frontend and backend projects.

I say framework, but it's not anything new or fancy. Rather it's dependency injection using Inversify, a collection of interfaces for useful/common stuff, and then some default implementations of those interfaces that mostly use other libraries.

The intention of Spicerack is to share a similar architecture for backend apps that use node.js and frontend apps using react, and allow you to swap out pieces as you see fit.


Go to the [documentation.](docs/index.md)
## Quick start

1. Create a new App class, injecting any services you need from the container.
```ts
import { App, inject } from '@spicerack/core';
import { IDependencyContainer, IConfig } from '@spicerack/types';
import { Config } from './services';

export class MyApp extends App {
    /**
     * Registers any required services with the dependency container.
     * 
     * @param {IDependencyContainer} container
     * @returns {Promise<void>}
     */
    public static async registerDependencies(container: IDependencyContainer): Promise<void> {
        container.bind('services.config').to(Config).inSingletonScope();
    }

    constructor(@inject('services.config') protected config: IConfig) {
        //
    }

    /**
     * Runs automatically when the app is booted.
     * "this.ready" promise will be resolved when this method resolves.
     * 
     * @returns {Promise<void>}
     */
    async boot(): Promise<void> {
        const name = this.config.get('name');
        console.log(`My app "${name}" is running!`);
    }
}
```

2. Run the application.
```ts
import { boot } from '@spicerack/core';
import { MyApp } from './MyApp';

boot(MyApp);
```

### Backend
### Frontend