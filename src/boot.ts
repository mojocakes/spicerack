import { IApp } from './types';
import container from './container';

export function boot(App: IApp) {
    const app = container.resolve(App);
    app.boot();
}