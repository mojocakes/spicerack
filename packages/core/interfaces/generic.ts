export interface IService {
    /**
     * Resolves when the service can be utilised.
     * 
     * @var {Promise<any>}
     */
    readonly ready: Promise<any>;
}
