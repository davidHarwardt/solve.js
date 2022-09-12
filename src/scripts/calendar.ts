import { DateTime, Duration, Interval } from "luxon";

type CalendarEvent<T> = {
    interval: Interval,
    event: T,
};

type SerializedCalendar<T> = {
    interval: string,
    event: T,
}[];

class Calendar<T> {
    private events: CalendarEvent<T>[];
    
    constructor() {
        this.events = [];
    }

    book(start: DateTime, duration: Duration, event: T) {
        this.events.push(<CalendarEvent<T>>{
            interval: Interval.after(start, duration), 
            event
        });
    }

    unbook(cb: (event: T) => boolean) {
        this.events = this.events.filter(v => !cb(v.event));
    }

    isBooked(time: DateTime, duration?: Duration): boolean {
        if(duration !== undefined) {
            const interval = Interval.after(time, duration);
            return this.events.find(v => v.interval.overlaps(interval)) ? true : false;
        }
        return this.events.find(v => v.interval.contains(time)) ? true : false;
    }

    getEvents(time: DateTime, duration?: Duration): CalendarEvent<T>[] {
        if(duration !== undefined) {
            const interval = Interval.after(time, duration);
            return this.events.filter(v => v.interval.overlaps(interval));
        }
        return this.events.filter(v => v.interval.contains(time));
    }

    toJSON<U>(eventMapper: (v: T) => U): SerializedCalendar<U> {
        return this.events.map(v => ({
            interval: v.interval.toISO(),
            event: eventMapper(v.event),
        }));
    }

    static fromJSON<T, U>(data: SerializedCalendar<U>, eventMapper: (v: U) => T): Calendar<T> {
        const events = data.map(v => (<CalendarEvent<T>>{
            interval: Interval.fromISO(v.interval),
            event: eventMapper(v.event),
        }));

        const timetable = new Calendar<T>();
        timetable.events = events;
        return timetable;
    }
}

export type {
    SerializedCalendar,
}

export {
    Calendar,
}
