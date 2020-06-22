**Spicerack** is a lightweight framework written in Typescript for both frontend and backend projects.

I say framework, but it's not anything new or fancy. Rather it's dependency injection using Inversify, a collection of interfaces for useful/common stuff, and then some default implementations of those interfaces that mostly use other libraries.

The intention of Spicerack is to share a similar architecture for backend apps that use node.js and frontend apps using react, and allow you to swap out pieces as you see fit.


Go to the [documentation.](docs/index.md)
## Quick start

1. Create a new App class, injecting any services you need from the container.
```typescript
import { App, IConfig } from 'spicerack';
import { inject } from 'spicerack/container';

class MyApp extends App {
    constructor(@inject('config') protected config: IConfig) {
        //
    }

    async boot(): Promise<void> {
        const name = this.config.get('name');
        console.log(`My app "${name}" is running!`);
    }
}
```

2. Run the application.
```typescript
import { boot } from 'spicerack';

boot(MyApp);
```

### Backend
### Frontend