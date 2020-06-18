export interface IService {
    ready: Promise<any>;

    boot(): Promise<any>;
}
