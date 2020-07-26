import { IApp } from './types';
import container from '../packages/core/container';
import { TaskManager } from './TaskManager';

interface IAppConstructor {
    new(...args: any[]): IApp
}

export function boot(App: IAppConstructor) {
    // TODO: register services...
    container.bind('taskManager').to(TaskManager).inSingletonScope();

    // Resolve any dependencies required by the app and runs
    container.resolve(App);
}