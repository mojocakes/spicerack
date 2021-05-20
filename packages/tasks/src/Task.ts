import * as uuid from 'uuid';
import { Tasks } from '@/types';
import { Service } from '@/core';

export abstract class Task extends Service implements Tasks.ITask {
    /**
     * Whether this task is running (internal)
     */
    protected _isRunning: boolean = false;

    /**
     * Checks whether this task is running
     * 
     * @returns {boolean}
     */
    public get isRunning(): boolean {
        return this._isRunning;
    }

    /**
     * Unique ID for this task.
     * This is used to stop duplicate tasks of the same type from being scheduled.
     * 
     * @var {string}
     */
    public readonly id: string = uuid.v1();

    /**
     * Handles the task (this is called by the public "run" method)
     * 
     * @param {...any[]} args 
     * @returns {Promise<any>}
     */
    protected abstract async handle(...args: any[]): Promise<any>;

    /**
     * Runs the task and sets this._isRunning to true while in progress.
     * 
     * @param {...any[]} args 
     * @returns {Promise<any>}
     */
    public async run<T = any>(...args: any[]): Promise<T> {
        try {
            this._isRunning = true;
            return this.handle(...args);
        } catch (e) {
            this._isRunning = false;
            throw e;
        }
    }
}