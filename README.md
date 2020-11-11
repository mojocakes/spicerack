**Spicerack** is a lightweight framework written in Typescript for both frontend and backend projects.

I say framework, but it's not anything new or fancy. Rather it's dependency injection using Inversify, a collection of interfaces for useful/common stuff, and then some default implementations of those interfaces that mostly use other libraries.

The intention of Spicerack is to share a similar architecture for backend apps that use node.js and frontend apps using react, and allow you to swap out pieces as you see fit.


Go to the [documentation.](docs/index.md)
## Quick Example

index.ts
```ts
import { boot } from '@spicerack/core';
import { MyApp } from './MyApp';
import { Config } from './services';

boot(MyApp, container => {
    // register stuff with the container that can be injected into your classes
    container.register(Config, 'services.config');
});
```

MyApp.ts
```ts
import { App } from '@spicerack/core';
import { inject } from '@spicerack/inject';
import { IConfig } from '@spicerack/types';

export class MyApp extends App {
    public constructor(@inject('services.config') protected config: IConfig) {
        super();
        this.ready = this.boot();
    }

    /**
     * Prepare dependencies.
     * 
     * @returns {Promise<void>}
     */
    protected async boot(): Promise<void> {
        await this.config.ready;
        const name = this.config.get('name');
        console.log(`${name} is running!`);
    }
}
```

2. Run the application.


### Backend
### Frontend