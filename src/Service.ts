import { injectable } from './container';

@injectable()
export abstract class Service {
    protected ready: Promise<void>;

    constructor() {
        this.boot = this.boot.bind(this);

        this.ready = this.boot();
    }

    protected async boot(): Promise<void> {};
}