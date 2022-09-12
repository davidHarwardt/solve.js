import type { SerializedCalendar } from "./calendar";

type Name = {
    uuid: string,
    first: string,
    last: string,
    title?: string,    
};

type Exam = {
    uuid: string,
    id: string,
    // duration of the exam as a string from moment.js (maybe choose other lib)
    duration: string,
        
    // list of the participants uuids
    examinees: string[],
    examiners: string[],

    mainSubject: string,
    tags: {
        name: string,
        required: boolean,        
    }[],
    pinned: boolean, 
};

type Booked<T> = {
    value: T,
    room: string,
    time: string,
}

type FileFormat = {
    remainingExams: Exam[],
    finishedExams: Booked<Exam>[],
        
    rooms: {
        uuid: string,
        number: string,
        tags: string[],
        calendar: SerializedCalendar<string>,
    }[],
        
    participants: {
        teachers: {
            name: Name,
            calendar: SerializedCalendar<string>,
            subjects: string[],
        }[],
        students: {
            name: Name,
            calendar: SerializedCalendar<string>,
        }[],
    },
        
    timetable: {
        // moment.js as string
        start: string,
        duration: string,
    }[],
};

export type {
    Name,
    Exam,
    FileFormat,
    Booked,
}