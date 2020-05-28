export interface IRouteController {
    handle(): void;
}
export interface IRouteControllerConstructor {
    new(...args: any[]): IRouteController;
}

export interface iRouter {
    register(route: string, controller: IRouteController): void;
}

export interface IRoute {

}
