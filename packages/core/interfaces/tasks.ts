import { IService } from "./generic";

export interface ITaskManager {
    /**
     * Gets a scheduled task.
     * 
     * @param {string} taskName
     * @returns {null | IScheduledTask}
     */
    get(taskName: string): null | IScheduledTask;

    /**
     * Schedules a task to be run.
     * 
     * @param {IScheduledTaskConstructor} task
     * @returns {void}
     */
    schedule(task: IScheduledTaskConstructor): IScheduledTask;
}

export interface IScheduledTaskConstructor {
    new (...args: any[]): ITask;
}

export interface ITask extends IService {
    /**
     * Runs the task.
     * 
     * @param {...any} args 
     * @returns {Promise<any>}
     */
    run(...args: any[]): Promise<any>;
}

export type ICommonIntervalGrammar =
    | 'millisecond'
    | 'milliseconds'
    | 'second'
    | 'seconds'
    | 'minute'
    | 'minutes'
    | 'hour'
    | 'hours'
    | 'day'
    | 'days'
    | 'month'
    | 'months'
;

export interface IScheduledTask {
    /**
     * The frequency this task runs at expresses as a cron string.
     * 
     * @var {string}
     */
    readonly cron: string;

    /**
     * The task
     * 
     * @var {ITask}
     */
    readonly task: ITask;

    /**
     * Starts the task
     * 
     * @returns {IScheduledTask}
     */
    start(): IScheduledTask;

    /**
     * Stops the task
     * 
     * @returns {IScheduledTask}
     */
    stop(): IScheduledTask;

    /**
     * Checks whether this task is running
     * 
     * @returns {boolean}
     */
    running(): boolean;

    /**
     * Sets how often this task should run.
     * 
     * @param {ICommonIntervalGrammar} interval 
     * @param {number?} frequency 
     */
    every(interval: ICommonIntervalGrammar, frequency?: number): IScheduledTask;

    /**
     * Schedules this task using a custom CRON string.
     * 
     * @param {string} cron
     * @returns {IScheduledTask}
     */
    setCron(cron: string): IScheduledTask;
}
