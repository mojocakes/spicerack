import { IRouteControllerConstructor } from "./routes";

export interface IServerConfig {
    port?: number;
    hostname?: string;
}

export interface IRequest {}
export interface IResponse {
    end(message: string): void;
}

export interface IServer {
    listen(config?: IServerConfig): IServer;

    get(route: string, controller: IRouteControllerConstructor): void;
    on(route: string, controller: IRouteControllerConstructor): void;
    post(route: string, controller: IRouteControllerConstructor): void;
    put(route: string, controller: IRouteControllerConstructor): void;
}
