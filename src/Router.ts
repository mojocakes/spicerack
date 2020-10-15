import { Service } from '../packages/core/src/Service';
import { injectable, inject } from "../packages/core/src/container";
import { IServer } from "./types";
import { RouteController } from "./RouteController";

export interface iRouter {}

class HomepageController extends RouteController {
    handle(): void {
        this.response.end('Hello World!');
    }
}

@injectable()
export class Router extends Service implements iRouter {
    constructor(
        @inject('server') protected server: IServer
    ) {
        super();
        this.handle = this.handle.bind(this);

        this.ready.then(this.handle);
    }

    protected async handle(): Promise<void> {
        this.server.get('/', HomepageController);
    }
}
