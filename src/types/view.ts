import { IService } from "./service";

export interface IViewProvider {
    render(...params: any[]): Promise<string>;
}

export interface IReactViewProvider extends IViewProvider, IService {
    render(component: React.ReactElement): Promise<string>;
}
