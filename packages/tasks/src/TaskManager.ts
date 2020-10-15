// # types
import { Tasks } from '@spicerack/types';
// #
import { registerInjectable } from "@spicerack/inject";
import { Service } from '@spicerack/core';
import { ScheduledTask } from './ScheduledTask';

export class TaskManager extends Service implements Tasks.ITaskManager {
    /**
     * A local cache of tasks.
     */
    protected tasks: Record<string, Tasks.IScheduledTask> = {};

    /**
     * One second interval that is used to check and run scheduled tasks.
     * 
     * @var {undefined | number}
     */
    private interval: undefined | number;

    /**
     * A cache of task ids and when their next run will be.
     * 
     * @var {Record<string, null | Date>}
     */
    private taskRunTimes: Record<string, null | Date> = {};

    constructor() {
        super();
        
        // bind methods
        this.boot = this.boot.bind(this);
        this.clear = this.clear.bind(this);
        this.get = this.get.bind(this);
        this.save = this.save.bind(this);
        this.saveAll = this.saveAll.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.now = this.now.bind(this);
        this.tick = this.tick.bind(this);
        this.updateTaskRunTimes = this.updateTaskRunTimes.bind(this);

        this.ready = this.boot();
    }

    /**
     * Retrieves all scheduled tasks.
     * 
     * @returns {Promise<IScheduledTask[]>}
     */
    public async all(): Promise<Tasks.IScheduledTask[]> {
        await this.ready;
        return Object.values(this.tasks);
    }

    /**
     * Unschedules and removes all tasks.
     * 
     * @returns {Promise<void>}
     */
    public async clear(): Promise<void> {
        await this.ready;
        await Promise.all(Object.keys(this.tasks).map(uid => this.delete(uid)));
    }

    /**
     * Deletes a scheduled task.
     * 
     * @param {string} id 
     * @returns {Promise<void>}
     */
    public async delete(id: string): Promise<void> {
        await this.ready;
        // TODO: perform unschedule
        delete this.tasks[id];
    }

    /**
     * Gets a scheduled task.
     * 
     * @param {string} taskName
     * @returns {Promise<null | IScheduledTask>}
     */
    public async get(taskName: string): Promise<null | Tasks.IScheduledTask> {
        await this.ready;
        return this.tasks[taskName] || null;
    }
    /**
     * !NOT IMPLEMENTED!
     * Fetches any scheduled tasks that match the given query.
     * 
     * @returns {Promise<null[] | Tasks.IScheduledTask[]>}
     */
    public async query(): Promise<null[] | Tasks.IScheduledTask[]> {
        throw new Error('This method is not implemented.');
        return [];
    }

    /**
     * Schedules a task.
     * 
     * @param {ITask} task
     * @returns {void}
     */
    public async save(task: Tasks.IScheduledTask): Promise<Tasks.IScheduledTask> {
        await this.ready;
        if (this.tasks[task.id]) {
            throw new Error(`A task with id "${task.id}" is already in the queue`);
        }

        this.tasks[task.id] = task;
        this.updateTaskRunTimes();
        return task;
    }

    /**
     * Adds multiple tasks to the schedule.
     * 
     * @param {Tasks.IScheduledTask[]} tasks
     * @returns {Promise<Tasks.IScheduledTask[]>}
     */
    public async saveAll(tasks: Tasks.IScheduledTask[]): Promise<Tasks.IScheduledTask[]> {
        await this.ready;
        return Promise.all(tasks.map(task => this.save(task)));
    }

    /**
     * Schedules a task and saves.
     * 
     * @param {Tasks.ITask} task
     * @param {Tasks.ITaskSchedule} schedule
     * @returns {Promise<void>}
     */
    public async schedule(task: Tasks.ITask, schedule: Tasks.ITaskSchedule): Promise<Tasks.IScheduledTask> {
        await this.ready;
        const scheduledTask = (ScheduledTask.fromTask(task)).setSchedule(schedule);
        await this.save(scheduledTask);
        return scheduledTask;
    }

    /**
     * Starts an interval to run scheduled tasks every second.
     * 
     * @returns {Promise<void>}
     */
    public async start(): Promise<void> {
        // make sure the interval isn't already running
        await this.stop();
        
        // run tasks now
        this.tick();

        // run tasks every second
        (this.interval as any) = global.setInterval(this.tick, 1000);
    }
    
    /**
     * Stops the interval that runs scheduled tasks.
     * 
     * @returns {Promise<void>}
     */
    public async stop(): Promise<void> {
        clearInterval(this.interval);
        this.interval = undefined;
    }

    /**
     * @override
     */
    protected async boot(): Promise<void> {
        this.updateTaskRunTimes();
        await this.start();
    }

    /**
     * Gets the current date / time.
     * 
     * @returns {Date}
     */
    protected now(): Date {
        return new Date();
    }

    /**
     * Runs any tasks that are due.
     * TODO: "task.next" will always return a future date,
     * so tasks will always be executed a second early.
     * Fix the way schedules work to cache future dates and set timeouts?
     * 
     * @returns {Promise<void>}
     */
    protected async tick(): Promise<void> {
        const now = this.now();

        // Find any tasks whose run scheduled run time is in the past
        const taskIdsToRun = Object.keys(this.taskRunTimes).filter(taskId => {
            const date = this.taskRunTimes[taskId];
            return date && date < now;
        });

        // run those tasks!
        taskIdsToRun.map(taskId => {
            const task = this.tasks[taskId];
            task?.run();
        });

        this.updateTaskRunTimes();
    }
    
    /**
     * Replaces the contents of this.taskRunTimes
     * 
     * @returns {void}
     */
    protected updateTaskRunTimes(): void {
        this.taskRunTimes = {};
        Object.keys(this.tasks).forEach(taskId => {
            const task = this.tasks[taskId];
            this.taskRunTimes[taskId] = task.schedule?.next;
        });
    }
}

registerInjectable(TaskManager);
