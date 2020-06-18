import { injectable } from './container';

@injectable()
export abstract class Service {
    public readonly ready: Promise<void>;

    constructor() {
        this.boot = this.boot.bind(this);

        this.ready = this.boot();
    }

    public async boot(): Promise<void> {};
}