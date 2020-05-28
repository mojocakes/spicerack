import { App, ExpressServer, ReactView, Router } from '.';

export class ServerApplication extends App {
    protected register(): void {
        super.register();
        this.container.bind('server').to(ExpressServer).inSingletonScope();
        this.container.bind('router').to(Router).inSingletonScope();
        this.container.bind('view').to(ReactView).inSingletonScope();
    }

    protected async boot(): Promise<void> {
        await this.ready;

        // Resolving services from the container initialises them.
        const server = this.container.get<ExpressServer>('server');
        this.container.get('router');
        this.container.get('view');

        server.listen();
    }
}
