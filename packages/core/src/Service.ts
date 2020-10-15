import * as Types from '@spicerack/types';
import { registerInjectable } from '@spicerack/inject';

export abstract class Service implements Types.Generic.IService {
    /**
     * Resolves when this class is ready to be consumed.
     * 
     * @var {Promise<void>}
     */
    public ready: Promise<void> = Promise.resolve();

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
        await Promise.all(services.map(s => s.ready));
    }
}

registerInjectable(Service);
