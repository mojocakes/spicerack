import { injectable } from './container';
import { IService } from './interfaces/generic';

@injectable()
export abstract class Service implements IService {
    public ready: Promise<void>;

    constructor() {
        this.boot = this.boot.bind(this);
        this.ready = this.boot();
    }

    /**
     * Runs any setup required before resolving this.ready.
     * 
     * @returns {Promise<void>}
     */
    protected async boot(): Promise<void> {};
}