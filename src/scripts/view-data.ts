import type { DateTime, Interval } from "luxon";
import type { Exam, Teacher, Timetable } from "./working-data";

type ViewConflict = {
    description: string,
};

type RoomSlot = {
    interval: Interval,
    exam?: Exam,
    conflicts: ViewConflict[],
    booked: boolean,
}

type Room = {
    uuid: string,
    number: string,
    tags: string[],
    slots: RoomSlot[],
}

type ViewData = {
    day: DateTime,
    rooms: Room[],

    remainingExams: Exam[],
    teachers: Teacher[],
    timetable: Timetable,
};

export type {
    ViewData,
    Room,
    Exam,
    RoomSlot,
    Timetable,
}