import { IService } from "./generic";

export type TIntervalGrammar =
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

export interface ITask extends IService {
    /**
     * Unique ID for this task.
     * This is used to stop duplicate tasks of the same type from being scheduled.
     * 
     * @var {string}
     */
    readonly uid: string;

    /**
     * Runs the task.
     * 
     * @param {...any} args 
     * @returns {Promise<any>}
     */
    run(...args: any[]): Promise<any>;
}

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
     * @param {TIntervalGrammar} interval 
     * @param {number?} frequency 
     */
    every(interval: TIntervalGrammar, frequency?: number): IScheduledTask;

    /**
     * Schedules this task using a custom CRON string.
     * 
     * @param {string} cron
     * @returns {IScheduledTask}
     */
    setCron(cron: string): IScheduledTask;
}

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
     * @param {ITask} task
     * @returns {void}
     */
    schedule(task: ITask): IScheduledTask;
}
