import { Tasks } from '@/types';
import { Task } from './Task';

export abstract class ScheduledTask extends Task implements Tasks.IScheduledTask {
    /**
     * Transforms a Task into a ScheduledTask
     * 
     * @param {Tasks.ITask} task
     * @returns {ScheduledTask}
     */
    static fromTask(task: Tasks.ITask): ScheduledTask {
        const scheduledTask = new (ScheduledTask as any)();
        Object.assign(scheduledTask, task);
        return scheduledTask;
    }

    /**
     * The schedule for this task (protected)
     * 
     * @var {Tasks.ITaskSchedule}
     */
    protected _schedule: Tasks.ITaskSchedule;

    /**
     * The schedule for this task (public).
     * 
     * @var {Tasks.ITaskSchedule}
     */
    public get schedule(): Tasks.ITaskSchedule {
        return this._schedule;
    }

    constructor() {
        super();

        // bind methods
        this.setSchedule = this.setSchedule.bind(this);
    }

    /**
     * Sets the run schedule of this task.
     * 
     * @param {Tasks.ITaskSchedule} schedule How often this task should run.
     */
    public setSchedule(schedule: Tasks.ITaskSchedule): Tasks.IScheduledTask {
        this._schedule = schedule;
        return this;
    }
}
