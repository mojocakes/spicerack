import { Generic } from "./generic";
import { Data } from "./data";

export namespace Tasks {
    export interface ITask extends Generic.IService {
        /**
         * Checks whether this task is running
         * 
         * @returns {boolean}
         */
        readonly isRunning: boolean;

        /**
         * Unique ID for this task.
         * This is used to stop duplicate tasks of the same type from being scheduled.
         * 
         * @var {string}
         */
        readonly id: string;
    
        /**
         * Runs the task.
         * 
         * @param {...any} args 
         * @returns {Promise<any>}
         */
        run(...args: any[]): Promise<any>;
    }
    
    export interface IScheduledTask extends ITask {
        /**
         * The schedule for this task.
         * 
         * @var {ITaskSchedule}
         */
        readonly schedule: ITaskSchedule;

        /**
         * Sets the run schedule of this task.
         * 
         * @param {ITaskSchedule} schedule How often this task should run.
         */
        setSchedule(schedule: ITaskSchedule): IScheduledTask;
    }
    
    export interface ITaskManager extends Data.IRepository<IScheduledTask>, Generic.IService {
        /**
         * Retrieves all scheduled tasks.
         * 
         * @returns {Promise<IScheduledTask[]>}
         */
        all(): Promise<IScheduledTask[]>

        /**
         * Unschedules and removes all tasks.
         * 
         * @returns {Promise<void>}
         */
        clear(): Promise<void>;

        /**
         * Saves a scheduled task. Schedule will be applied.
         * 
         * @param {IScheduledTask} task
         * @returns {Promise<T>}
         */
        save(task: IScheduledTask): Promise<IScheduledTask>;

        /**
         * Saves multiple scheduled tasks. Schedules will be applied.
         * 
         * @param {IScheduledTask[]} tasks
         * @returns {Promise<IScheduledTask[]>}
         */
        saveAll(tasks: IScheduledTask[]): Promise<IScheduledTask[]>;

        /**
         * Schedules a task and saves.
         * 
         * @param {ITask} task
         * @param {ITaskSchedule} schedule
         * @returns {Promise<void>}
         */
        schedule(task: ITask, schedule: ITaskSchedule): Promise<IScheduledTask>;
    }

    export interface ITaskSchedule {
        readonly config: {
            at?: null | Date;
            every?: null | TTaskInterval;
            skip?: null | number;
            from?: null | Date;
        };

        /**
         * Gets the next date/time this schedule should run.
         * 
         * @var {null | Date}
         */
        readonly next: null | Date;

        /**
         * Sets the date / time that this schedule will run at, and specifies it will run ONCE.
         * 
         * @param date 
         */
        at(date: Date): ITaskSchedule;

        /**
         * Sets the interval for this schedule, and specifies it will run MULTIPLE TIMES.
         * ie. "day" = once every 24 hours
         * 
         * @param interval 
         */
        every(interval: TTaskInterval): ITaskSchedule;

        /**
         * Sets the start date/time of the schedule
         * ie. "new Date('2021-01-01 00:00')" = start running from midnight on new year's eve 2021
         * 
         * @param date 
         */
        from(date: Date): ITaskSchedule;

        /**
         * Sets how many intervals should be skipped each time
         * ie. "4" = every 4 days
         * 
         * @param times 
         */
        skip(times: number): ITaskSchedule;
    }

    export type TTaskInterval =
        | 'millisecond'
        | 'second'
        | 'minute'
        | 'hour'
        | 'day'
        | 'month'
        | 'year'
    ;
}
