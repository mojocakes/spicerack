import nodeSchedule from 'node-schedule';
import { IScheduledTask, ITask, ITaskManager, IIntervalGrammar } from '@spicerack/core/src/interfaces/tasks';

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
            this.schedule = nodeSchedule.scheduleJob(this.cron, this.task.run);

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
     * @param {IIntervalGrammar} interval 
     * @param {number?} frequency 
     */
    public every(interval: IIntervalGrammar, frequency: number = 1): IScheduledTask {
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
