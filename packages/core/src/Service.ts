import * as Types from '@/types';

export abstract class Service implements Types.Generic.IService {
    /**
     * Resolves when this class is ready to be consumed.
     * 
     * @var {Promise<void>}
     */
    public abstract readonly ready: Promise<void>;

    /**
     * Run any async setup here.
     * Intended to be used to return "this.ready" promise.
     * 
     * @returns {Promise<void>}
     */
    protected async boot(): Promise<void> {
        //
    }

    /**
     * Waits for services to be ready for use.
     * 
     * @param {...Types.Generic.IService} services 
     * @returns {Promise<void>}
     */
    protected async bootServices(...services: Types.Generic.IService[]): Promise<void> {
        await Promise.all(services.map(service => {
            if (!service.ready) {
                throw new Error(`Argument passed to bootServices is not a service (${service.constructor.name})`);
            }
            return service.ready
        }));
    }
}
