import moment from 'moment';
import { Tasks } from '@spicerack/types';

export class TaskSchedule implements Tasks.ITaskSchedule {
    /**
     * Cached next date to save computing it every time.
     * 
     * @var {null | Date}
     */
    protected _next: null | Date;

    public readonly config: {
        at?: null | Date;
        every?: null | Tasks.TTaskInterval;
        skip?: null | number;
        from?: null | Date;
    } = {};

    /**
     * Gets the next date/time this schedule should run.
     * 
     * @var {null | Date}
     */
    public get next(): null | Date {
        // if (this._next && this._next > this.now()) {
        //     return this._next;
        // }

        const next = moment(this.config.at || this.now());

        if (this.config.every) {
            switch (this.config.every) {
                case 'millisecond':
                    next.add(1 + (this.config.skip || 0), 'millisecond');
                    break;
                case 'second':
                    next.add(1 + (this.config.skip || 0), 'second');
                    break;
                case 'minute':
                    next.add(1 + (this.config.skip || 0), 'minute');
                    break;
                case 'hour':
                    next.add(1 + (this.config.skip || 0), 'hour');
                    break;
                case 'day':
                    next.add(1 + (this.config.skip || 0), 'day');
                    break;
                case 'month':
                    next.add(1 + (this.config.skip || 0), 'month');
                    break;
                case 'year':
                    next.add(1 + (this.config.skip || 0), 'year');
                    break;
                default:
            }
        }

        this._next = next.toDate();
        return this._next;
    }

    /**
     * Sets the date / time that this schedule will run at, and specifies it will run ONCE.
     * 
     * @param date 
     */
    public at(date: Date): Tasks.ITaskSchedule {
        this.config.at = date;
        this.setScheduleType('once');
        return this;
    }

    /**
     * Sets the interval for this schedule, and specifies it will run MULTIPLE TIMES.
     * ie. "day" = once every 24 hours
     * 
     * @param interval 
     */
    public every(interval: Tasks.TTaskInterval): Tasks.ITaskSchedule {
        this.config.every = interval;
        this.setScheduleType('recurring');
        return this;
    }

    /**
     * Sets the start date/time of the schedule
     * ie. "new Date('2021-01-01 00:00')" = start running from midnight on new year's eve 2021
     * 
     * @param date 
     */
    public from(date: Date): Tasks.ITaskSchedule {
        this.config.from = date;
        this.setScheduleType('recurring');
        return this;
    }

    /**
     * Sets how many intervals should be skipped each time
     * ie. "4" = every 4 days
     * 
     * @param times 
     */
    public skip(times: number): Tasks.ITaskSchedule {
        this.config.skip = times;
        this.setScheduleType('recurring');
        return this;
    }

    /**
     * Gets the current date
     * 
     * @returns {Date}
     */
    protected now(): Date {
        return new Date();
    }

    /**
     * Clears config values that aren't required.
     * 
     * @param {'once' | 'recurring'} type
     * @returns {void}
     */ 
    protected setScheduleType(type: 'once' | 'recurring'): void {
        if (type === 'once') {
            this.config.every = null;
            this.config.from = null;
            this.config.skip = null;
            return;
        }

        this.config.at = null;
    }
}
