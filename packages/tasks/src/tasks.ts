import { Service } from '@spicerack/core';
import { ITask } from '@spicerack/core/src/interfaces/tasks';

export abstract class Task extends Service implements ITask {
    /**
     * Unique ID for this task.
     * This is used to stop duplicate tasks of the same type from being scheduled.
     * 
     * @var {string}
     */
    public abstract readonly uid: string;

    /**
     * Runs the task.
     * 
     * @param {...any[]} args 
     * @returns {Promise<any>}
     */
    public abstract async run(...args: any[]): Promise<any>;
}