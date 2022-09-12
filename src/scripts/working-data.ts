import type { DateTime, Duration, Interval } from "luxon";
import type { Calendar } from "./calendar";

type Name = {
    uuid: string,
    first: string,
    last: string,
    title?: string,
};

type Student = {
    name: Name,
    calendar: Calendar<Exam>,
};

type Teacher = {
    name: Name,
    calendar: Calendar<Exam>,
    subjects: string[],
};

type Exam = {
    uuid: string,
    id: string,
    duration: Duration,
    examiners: [Teacher, Teacher | undefined, Teacher | undefined],
    examinees: Student[],
    mainSubject: string,
    pinned: boolean,
    tags: { name: string, required: boolean }[],
};

type Room = {
    uuid: string,
    number: string,
    tags: string[],
    calendar: Calendar<Exam>,
};

type Timetable = {
    start: DateTime,
    duration: Duration,
}[];

type Booked<T> = {
    room: Room,
    time: DateTime,
    value: T,
};

type Data = {
    remainingExams: Exam[],
    finishedExams: Booked<Exam>[],   

    rooms: Room[],
    teachers: Teacher[],
    students: Student[],
    timetable: Timetable,
};

export type {
    Name,
    Student,
    Teacher,
    Exam,
    Room,
    Data,
    Timetable,
    Booked,
}