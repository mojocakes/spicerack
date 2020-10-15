import moment from 'moment';
import { Tasks } from '@spicerack/types';
import { TaskSchedule } from './TaskSchedule';

// -- factories

// a task schedule with adjustable date
interface ITimeAugmentedTaskSchedule extends Tasks.ITaskSchedule {
    setNow(date: Date): void;
}

// -- helpers
const scheduleFactory = (now: Date = new Date()): ITimeAugmentedTaskSchedule => {
    class AugmentedTaskSchedule extends TaskSchedule {
        protected _now = now;

        public setNow(date: Date): void {
            this._now = date;
        }

        protected now(): Date {
            return this._now;
        }
    }

    return new AugmentedTaskSchedule();
};

describe('tasks/TaskSchedule', () => {
    describe('config', () => {
        it('should store an "at" value when at() is called', () => {
            const schedule = scheduleFactory();
            const at = new Date('2021-01-01 00:00');
            schedule.at(at);

            expect(schedule.config.at).toEqual(at);
        });
        
        it('should store an "every" value when every() is called', () => {
            const schedule = scheduleFactory();
            const every = 'day';
            schedule.every(every);

            expect(schedule.config.every).toEqual(every);
        });

        it('should clear the "at" value when every() is called', () => {
            const schedule = scheduleFactory();
            const at = new Date('2021-01-01 00:00');
            const every = 'day';
            schedule.at(at);
            schedule.every(every);

            expect(schedule.config.at).toBeFalsy();
        });

        it('should store a "from" value when from() is called', () => {
            const schedule = scheduleFactory();
            const from = new Date('2021-04-12 12:37');
            schedule.from(from);

            expect(schedule.config.from).toEqual(from);
        });

        it('should clear the "at" value when from() is called', () => {
            const schedule = scheduleFactory();
            const at = new Date('2021-01-01 00:00');
            const from = new Date('2021-04-12 12:37');
            schedule.at(at);
            schedule.from(from);

            expect(schedule.config.at).toBeFalsy();
        });

        it('should store a "skip" value when skip() is called', () => {
            const schedule = scheduleFactory();
            const skip = 3;
            schedule.skip(skip);

            expect(schedule.config.skip).toEqual(skip);
        });

        it('should clear the "at" value when skip() is called', () => {
            const schedule = scheduleFactory();
            const at = new Date('2021-01-01 00:00');
            const skip = 3;
            schedule.at(at);
            schedule.skip(skip);

            expect(schedule.config.at).toBeFalsy();
        });

        it('should clear the "every", "from", "skip" values when at() is called', () => {
            const schedule = scheduleFactory();
            const every = 'day';
            const from = new Date('2021-04-12 12:37');
            const skip = 3;
            const at = new Date('2021-01-01 00:00');

            schedule.every(every);
            schedule.from(from);
            schedule.skip(skip);
            schedule.at(at);
            expect(schedule.config.every).toBeFalsy();
            expect(schedule.config.from).toBeFalsy();
            expect(schedule.config.skip).toBeFalsy();
        });
    });

    describe('at()', () => {
        it('should set a schedule for the specified date/time', () => {
            const schedule = scheduleFactory();
            const at = new Date('2020-01-01 00:00');
            schedule.at(at);

            expect(schedule.next).toEqual(at);
        });
    });

    describe('every()', () => {
        describe('should set a schedule that recurs every', () => {
            test('millisecond', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('millisecond');

                expect(schedule.next).toEqual(new Date(date.setMilliseconds(1)));

                schedule.setNow(new Date(date.setMilliseconds(1)));
                expect(schedule.next).toEqual(new Date(date.setMilliseconds(2)));
            });

            test('second', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('second');

                expect(schedule.next).toEqual(new Date(date.setSeconds(1)));

                schedule.setNow(new Date(date.setSeconds(1)));
                expect(schedule.next).toEqual(new Date(date.setSeconds(2)));
            });

            test('minute', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('minute');

                expect(schedule.next).toEqual(new Date(date.setMinutes(1)));

                schedule.setNow(new Date(date.setMinutes(1)));
                expect(schedule.next).toEqual(new Date(date.setMinutes(2)));
            });

            test('hour', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('hour');

                expect(schedule.next).toEqual(new Date(date.setHours(1)));

                schedule.setNow(new Date(date.setHours(1)));
                expect(schedule.next).toEqual(new Date(date.setHours(2)));
            });

            test('day', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('day');

                expect(schedule.next).toEqual(new Date(date.setDate(2)));

                schedule.setNow(new Date(date.setDate(2)));
                expect(schedule.next).toEqual(new Date(date.setDate(3)));
            });

            test('month', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('month');

                expect(schedule.next).toEqual(new Date(date.setMonth(1)));

                schedule.setNow(new Date(date.setMonth(1)));
                expect(schedule.next).toEqual(new Date(date.setMonth(2)));
            });

            test('year', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('year');

                expect(schedule.next).toEqual(new Date(date.setFullYear(2022)));

                schedule.setNow(new Date(date.setFullYear(2023)));
                expect(schedule.next).toEqual(new Date(date.setFullYear(2024)));
            });
        });
    });

    describe('from()', () => {});
    
    describe('skip()', () => {
        describe('should skip the next N cycles', () => {
            test('millisecond', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('millisecond').skip(3);

                expect(schedule.next).toEqual(new Date(date.setMilliseconds(4)));

                schedule.setNow(new Date(date.setMilliseconds(2)));
                expect(schedule.next).toEqual(new Date(date.setMilliseconds(6)));
            });

            test('second', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('second').skip(5);

                expect(schedule.next).toEqual(new Date(date.setSeconds(6)));

                schedule.setNow(new Date(date.setSeconds(2)));
                expect(schedule.next).toEqual(new Date(date.setSeconds(8)));
            });

            test('minute', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('minute').skip(20);

                expect(schedule.next).toEqual(new Date(date.setMinutes(21)));

                schedule.setNow(new Date(date.setMinutes(2)));
                expect(schedule.next).toEqual(new Date(date.setMinutes(23)));
            });

            test('hour', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('hour').skip(4);

                expect(schedule.next).toEqual(new Date(date.setHours(5)));

                schedule.setNow(new Date(date.setHours(2)));
                expect(schedule.next).toEqual(new Date(date.setHours(7)));
            });

            test('day', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('day').skip(5);

                expect(schedule.next).toEqual(new Date(date.setDate(7)));

                schedule.setNow(new Date(date.setDate(13)));
                expect(schedule.next).toEqual(new Date(date.setDate(19)));
            });

            test('month', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('month').skip(1);

                // date.setMonth() is changing the date to the 31st... wtf? so using moment here
                // TODO: ideally all tests should use moment for accuracy
                expect(schedule.next).toEqual(moment(date).add(2, 'months').toDate());

                schedule.setNow(new Date(date.setMonth(2)));
                expect(schedule.next).toEqual(new Date(date.setMonth(4)));
            });

            test('year', () => {
                const date = new Date('2021-01-01T00:00:00.000Z');
                const schedule = scheduleFactory(date);
                schedule.every('year').skip(2);

                expect(schedule.next).toEqual(new Date(date.setFullYear(2024)));

                schedule.setNow(new Date(date.setFullYear(2027)));
                expect(schedule.next).toEqual(new Date(date.setFullYear(2030)));
            });
        });
    });
});
