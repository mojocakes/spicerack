import nodeSchedule from 'node-schedule';
import {
    ICommonIntervalGrammar,
    IScheduledTask,
    IScheduledTaskConstructor,
    ITask,
    ITaskManager,
} from "./types/tasks";
import { Service } from "../packages/core/Service";
import { container } from "./";

@container.injectable()
export class TaskManager implements ITaskManager {
    protected tasks: Record<string, IScheduledTask> = {};

    constructor() {
        this.schedule = this.schedule.bind(this);
    }

    /**
     * Gets a scheduled task.
     * 
     * @param {string} taskName
     * @returns {null | IScheduledTask}
     */
    get(taskName: string): null | IScheduledTask {
        return this.tasks[taskName] || null;
    }

    /**
     * Schedules a task to be run.
     * 
     * @param {IScheduledTaskConstructor} task
     * @returns {void}
     */
    public schedule(task: IScheduledTaskConstructor): IScheduledTask {
        if (this.tasks[task.name]) {
            throw new Error(`"${task.name}" is already in the queue`);
        }

        const scheduledTask = new ScheduledTask(container.default.resolve(task), this);
        this.tasks[task.name] = scheduledTask;
        return scheduledTask;
    }
}

export abstract class Task extends Service implements ITask {
    public abstract handle(...args: any[]): any;
}

export class ScheduledTask implements IScheduledTask {
    /**
     * The frequency this task runs at.
     * 
     * @var {string}
     */
    public get cron(): string {
        return this._cron;
    }

    protected _cron: string = '';

    protected schedule: any = null;

    constructor(
        public readonly task: ITask,
        protected taskManager: ITaskManager,
    ) {
        // bind methods
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.running = this.running.bind(this);
        this.every = this.every.bind(this);
        this.setCron = this.setCron.bind(this);
    }

    /**
     * Starts the task
     * 
     * @returns {IScheduledTask}
     */
    public start(): IScheduledTask {
        if (!this.running()) {
            console.log('starting task');
            this.schedule = nodeSchedule.scheduleJob(this.cron, this.task.handle);

            if (this.schedule === null) {
                throw new Error('Issue scheduling task');
            }
        }

        return this;
    }

    /**
     * Stops the task
     * 
     * @returns {IScheduledTask}
     */
    public stop(): IScheduledTask {
        if (this.running()) {
            console.log('stopping task');
            this.schedule.cancel();
            this.schedule = null;
        }

        return this;
    }

    /**
     * Checks whether this task is running
     * 
     * @returns {boolean}
     */
    public running(): boolean {
        return !!this.schedule;
    }

    /**
     * Sets how often this task should run.
     * 
     * @param {ICommonIntervalGrammar} interval 
     * @param {number?} frequency 
     */
    public every(interval: ICommonIntervalGrammar, frequency: number = 1): IScheduledTask {
        switch (interval) {
            case 'second':
            case 'seconds': {
                this._cron = `*/${frequency} * * * * *`;
                break;
            }
            case 'minute':
            case 'minutes': {
                this._cron = `* */${frequency} * * * *`;
                break;
            }
            case 'hour':
            case 'hours': {
                this._cron = `* * */${frequency} * * *`;
                break;
            }
            case 'day':
            case 'days': {
                this._cron = `* * * */${frequency} * *`;
                break;
            }
            default:
                throw new Error(`invalid interval value "${interval}"`);
        }

        return this;
    }

    /**
     * Schedules this task using a custom CRON string.
     * 
     * @param {string} cron
     * @returns {IScheduledTask}
     */
    public setCron(cron: string): IScheduledTask {
        this._cron = cron;
        return this;
    }
}