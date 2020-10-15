import moment from 'moment';
import { Tasks } from '@spicerack/types';
import { TaskManager } from './TaskManager';
import { Task } from './Task';
import { ScheduledTask } from './ScheduledTask';
import { TaskSchedule } from './TaskSchedule';

// -- mocks
class MockTask extends Task {
    handle = jest.fn(() => Promise.resolve());
    run = (jest.fn(() => Promise.resolve()) as any);
}
class MockScheduledTask extends ScheduledTask {
    constructor(id?: string) {
        super();
        (this.id as any) = id || this.id;
    }

    handle = jest.fn(() => Promise.resolve());
    run = (jest.fn(() => Promise.resolve()) as any);
}
const schedules: Record<string, Tasks.ITaskSchedule> = {
    EVERY_SECOND: new TaskSchedule().every('second'),
};

// -- testables
interface ITaskManagerWithTestableMethods extends Tasks.ITaskManager {
    tick(): Promise<void>;
    setNow(date: Date): void;
    stop(): void;
}
const taskManagerFactory = (): ITaskManagerWithTestableMethods => {
    class TestableTaskManager extends TaskManager {
        /**
         * Override this method and avoid calling "this.start"
         * We don't want the interval to run while we're testing.
         */
        protected async boot(): Promise<void> {
            this.updateTaskRunTimes();
        }
    }

    const taskManager = new TestableTaskManager();

    (taskManager as any).setNow = (date: Date) => {
        (taskManager as any).now = () => date;
    };

    return taskManager as any as ITaskManagerWithTestableMethods;
}

describe('tasks/TaskManager', () => {
    describe('all()', () => {
        it('retrieves all tasks', async () => {
            const taskManager = taskManagerFactory();
            const tasks = [
                new MockScheduledTask(),
                new MockScheduledTask(),
                new MockScheduledTask(),
            ];

            await taskManager.saveAll(tasks);

            expect(await taskManager.all()).toEqual(tasks);
        });
    });

    describe('clear()', () => {
        it('removes all tasks', async () => {
            const taskManager = taskManagerFactory();
            const tasks = [
                new MockScheduledTask(),
                new MockScheduledTask(),
                new MockScheduledTask(),
            ];
    
            await taskManager.saveAll(tasks);
            await taskManager.clear();
    
            expect(await taskManager.all()).toHaveLength(0);
        });

        it('unschedules all tasks', async () => {
            expect.assertions(3);

            const taskManager = taskManagerFactory();
            const tasks = [
                new MockScheduledTask('1').setSchedule(schedules.EVERY_SECOND),
                new MockScheduledTask('2').setSchedule(schedules.EVERY_SECOND),
                new MockScheduledTask('3').setSchedule(schedules.EVERY_SECOND),
            ];

            await taskManager.saveAll(tasks);
            await taskManager.clear();

            await new Promise(r => setTimeout(r, 1100));
            expect(tasks[0].run).not.toHaveBeenCalled();
            expect(tasks[1].run).not.toHaveBeenCalled();
            expect(tasks[2].run).not.toHaveBeenCalled();
        });
    });

    describe('delete()', () => {
        it('removes the task', async () => {
            const taskManager = taskManagerFactory();
            const task = new MockScheduledTask('4');
            await taskManager.save(task);
            await taskManager.delete(task.id);
            expect(await taskManager.get(task.id)).toBe(null);
        });

        it('unschedules the task', async () => {
            expect.assertions(1);
    
            const taskManager = taskManagerFactory();
            const task = new MockScheduledTask('5').setSchedule(schedules.EVERY_SECOND);
            await taskManager.save(task);
            await taskManager.delete(task.id);
    
            await new Promise(r => setTimeout(r, 1100));
            expect(task.run).not.toHaveBeenCalled();
        });
    });

    describe('get()', () => {
        it('retrieves the task', async () => {
            const taskManager = taskManagerFactory();
            const task = new MockScheduledTask('6');
            await taskManager.save(task);
            expect(await taskManager.get(task.id)).toEqual(task);
        });

        it('returns null if the task can\'t be retrieved', async () => {
            const taskManager = taskManagerFactory();
            const task = new MockScheduledTask('7');
            await taskManager.save(task);

            await taskManager.delete(task.id);
            expect(await taskManager.get(task.id)).toBe(null);
        });
    });

    describe('save()', () => {
        it('saves the task', async () => {
            const taskManager = taskManagerFactory();
            const task = new MockScheduledTask('8').setSchedule(schedules.EVERY_SECOND);
            await taskManager.save(task);

            expect(await taskManager.get(task.id)).toEqual(task);
        });
        
        it('schedules the task', async () => {
            expect.assertions(1);
    
            const taskManager = taskManagerFactory();

            const task = new MockScheduledTask('9').setSchedule(schedules.EVERY_SECOND);
            await taskManager.save(task);

            // move forward 2 seconds into the future
            taskManager.setNow(moment().add(2, 'seconds').toDate());
            await taskManager.tick();
    
            expect(task.run).toHaveBeenCalled();
        });
    });
    
    describe('saveAll()', () => {
        it('saves the tasks', async () => {
            const taskManager = taskManagerFactory();
            const tasks = [
                new MockScheduledTask('10'),
                new MockScheduledTask('11'),
                new MockScheduledTask('12'),
            ];

            await taskManager.saveAll(tasks);

            expect(await taskManager.all()).toEqual(tasks);
        });

        it('schedules the tasks', async () => {
            expect.assertions(3);

            const taskManager = taskManagerFactory();
            const tasks = [
                new MockScheduledTask('13').setSchedule(schedules.EVERY_SECOND),
                new MockScheduledTask('14').setSchedule(schedules.EVERY_SECOND),
                new MockScheduledTask('15').setSchedule(schedules.EVERY_SECOND),
            ];

            await taskManager.saveAll(tasks);

            // move 2s into the future
            taskManager.setNow(moment().add(2, 'seconds').toDate());
            await taskManager.tick();

            expect(tasks[0].run).toHaveBeenCalled();
            expect(tasks[1].run).toHaveBeenCalled();
            expect(tasks[2].run).toHaveBeenCalled();
        });
    });

    describe('schedule()', () => {
        it('saves the task', async () => {
            const taskManager = taskManagerFactory();
            const task = new MockTask();
            await taskManager.schedule(task, schedules.EVERY_SECOND);
            expect((await taskManager.get(task.id))?.id).toEqual(task.id);
        });

        it('schedules the task', async () => {
            expect.assertions(1);

            const taskManager = taskManagerFactory();
            const task = new MockTask();
            await taskManager.schedule(task, schedules.EVERY_SECOND);

            taskManager.setNow(moment().add(2, 'seconds').toDate());
            await taskManager.tick();

            expect(task.run).toHaveBeenCalled();
        });

        it('returns a scheduled task', async () => {
            const taskManager = taskManagerFactory();
            const task = new MockTask();
            expect (await taskManager.schedule(task, schedules.EVERY_SECOND)).toBeInstanceOf(ScheduledTask);
        });
    });
});
