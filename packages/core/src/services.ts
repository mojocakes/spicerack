import * as Types from '@spicerack/types';
import { registerInjectable } from '@spicerack/inject';

export abstract class Service implements Types.Generic.IService {
    /**
     * Resolves when this class is ready to be consumed.
     * 
     * @var {Promise<void>}
     */
    public readonly ready: Promise<void> = Promise.resolve();
}

registerInjectable(Service);
