import { IRouteController, IRequest, IResponse } from "./types";

export abstract class RouteController implements IRouteController {
    constructor(
        protected request: IRequest,
        protected response: IResponse
    ) {}

    public abstract handle(): void;
}
