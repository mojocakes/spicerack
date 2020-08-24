import {
    IScheduledTask,
    ITask,
    ITaskManager,
} from "@spicerack/core/src/interfaces/tasks";

import { injectable } from "@spicerack/core/src/container";

import { ScheduledTask } from './ScheduledTask';

@injectable()
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
     * @param {ITask} task
     * @returns {void}
     */
    public schedule(task: ITask): IScheduledTask {
        if (this.tasks[task.uid]) {
            throw new Error(`A task with the UID "${task.uid}" is already in the queue`);
        }

        const scheduledTask = new ScheduledTask(task, this);
        this.tasks[task.uid] = scheduledTask;
        return scheduledTask;
    }
}

