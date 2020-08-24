import { IServer, IRouteControllerConstructor, IRequest, IResponse, IRouteController } from "./types";
import express, { Application } from "express";
import { inject, injectable } from '../packages/core/src/container';
import { Config } from "./Config";

@injectable()
export class ExpressServer implements IServer {
    protected app: Application;

    constructor(
        @inject('config') protected config: Config<any>,
    ) {
        this.app = express();
    }

    public listen(): IServer {
        const port = this.config.get('PORT', 8080);
        const hostname = this.config.get('HOST', 'localhost');

        this.app.listen(port, hostname, () => {
            console.info(`Server is running: http://${hostname}:${port}`);
        });
        return this;
    }

    public get(route: string, controller: IRouteControllerConstructor) {
        this.app.get(route, (request, response) => {
            return this.makeController(controller, request, response).handle();
        });
    }

    public on(route: string, controller: IRouteControllerConstructor) {
        ['get', 'post', 'put'].forEach(method => {
            this.app[method](route, (request: IRequest, response: IResponse) => {
                return this.makeController(controller, request, response).handle();
            });
        })
    }

    public post(route: string, controller: IRouteControllerConstructor) {
        this.app.get(route, (request, response) => {
            return this.makeController(controller, request, response).handle();
        });
    }

    public put(route: string, controller: IRouteControllerConstructor) {
        this.app.get(route, (request, response) => {
            return this.makeController(controller, request, response).handle();
        });
    }

    protected makeController(
        controller: IRouteControllerConstructor,
        request: IRequest,
        response: IResponse,
    ): IRouteController {
        if ((controller as any).make) {
            return (controller as any).make(request, response)
        }

        return new controller(request, response);
    }
}
