// controller.ts

import { DateTime, Duration, Interval } from "luxon";
import { writable, type Writable } from "svelte/store";
import { Calendar } from "./calendar";
import type * as Save from "./save-data";
import type { ViewData } from "./view-data";
import type * as Working from "./working-data";

let selectedDay: DateTime;
let workingData: Working.Data = {
    finishedExams: [],
    remainingExams: [],
    rooms: [],
    students: [],
    teachers: [],
    timetable: [],
};

let store: Writable<ViewData> = writable({
    day: DateTime.now(),
    rooms: [],
    remainingExams: [],
    teachers: [],
    timetable: [],
});
let currentProjectName: string;

function grabExamByUuid(uuid: string): Working.Exam {
    let idx = workingData.remainingExams.findIndex(v => v.uuid === uuid);
    return workingData.remainingExams.splice(idx, 1)[0];
}
function getRoomByUuid(uuid: string): Working.Room {
    return workingData.rooms.find(v => v.uuid === uuid);
}
// exams
function insertExam(examUuid: string, roomUuid: string, time: DateTime): void {
    let exam = grabExamByUuid(examUuid);
    let room = getRoomByUuid(roomUuid);

    room.calendar.book(time, exam.duration, exam);
    exam.examinees.forEach(v => v.calendar.book(time, exam.duration, exam));
    exam.examiners.forEach(v => v.calendar.book(time, exam.duration, exam));
    workingData.finishedExams.push(<Working.Booked<Working.Exam>> {
        room,
        time: time,
        value: exam,
    });
    // todo maybe add update store
}
function removeExam(examUuid: string): void {
    let idx = workingData.finishedExams.findIndex(v => v.value.uuid === examUuid);
    let exam = workingData.finishedExams.splice(idx, 1)[0];

    exam.room.calendar.unbook(v => v.uuid === examUuid);
    exam.value.examinees.forEach(v => v.calendar.unbook(v => v.uuid === examUuid));
    exam.value.examiners.forEach(v => v.calendar.unbook(v => v.uuid === examUuid));

    workingData.remainingExams.push(exam.value);
    // todo maybe update store
}

function computeExams(): void {

}

// writers
function insertWriter(examUuid: string, writerUuid: string): void {

}
function removeWriter(examUuid: string): void {

}

function computeWriters(): void {

}

// secondary examiners
function insertSecondaryExaminer(examUuid: string, examinerUuid: string): void {

}
function removeSecondaryExaminer(examUuid: string): void {

}

function computeSecondaryExaminers(): void {

}

// verification
function verify(): void {

}

function addRoom(): void {
    workingData.rooms.push(<Working.Room>{
        calendar: new Calendar(),
        number: "",
        tags: [],
        uuid: crypto.randomUUID(),
    });
    updateViewData();
}
function setRoomNumber(uuid: string, number: string): void {
    workingData.rooms.find(v => v.uuid === uuid).number = number;
    updateViewData();
}

function addExam(): void {
    workingData.remainingExams.push(<Working.Exam>{
        uuid: crypto.randomUUID(),
        examinees: [],
        examiners: [undefined, undefined, undefined],
        id: "",
        duration: Duration.fromMillis(0),
        mainSubject: "",
        pinned: false,
        tags: [],
    });
    updateViewData();
}

// ? select the current day 
function selectDay({ year, month, day }: { year: number, month: number, day: number }): void {
    selectedDay = DateTime.fromObject({ year, month, day });
    updateViewData();
}

// save / load
function save(): void {

    const examToSave = (v: Working.Exam) => (<Save.Exam>{
        uuid: v.uuid,
        id: v.id,
        duration: v.duration.toISO(),
        examinees: v.examinees.map(v => v.name.uuid),
        examiners: v.examiners.map(v => v.name.uuid),
        mainSubject: v.mainSubject,
        tags: v.tags,
    });

    let saveData: Save.FileFormat = {
        finishedExams: workingData.finishedExams.map(v => (<Save.Booked<Save.Exam>>{
            room: v.room.uuid,
            time: v.time.toISO(),
            value: examToSave(v.value),
        })),

        remainingExams: workingData.remainingExams.map(examToSave),
        rooms: workingData.rooms.map(v => ({
            uuid: v.uuid,
            number: v.number,
            tags: v.tags,
            calendar: v.calendar.toJSON(v => v.uuid),
        })),
        participants: {
            teachers: workingData.teachers.map(v => ({
                name: v.name,
                subjects: v.subjects,
                calendar: v.calendar.toJSON(v => v.uuid),
            })),
            students: workingData.students.map(v => ({
                name: v.name,
                calendar: v.calendar.toJSON(v => v.uuid),
            })),
        },

        timetable: workingData.timetable.map(v => ({
            start: v.start.toISO(),
            duration: v.duration.toISO(),
        })),
    };
}
function load(project: string): void {
    let loadedData: Save.FileFormat;

    let rooms = loadedData.rooms.map(v => (<Working.Room>{
        uuid: v.uuid,
        number: v.number,
        tags: v.tags,
        // calendar imported later
        calendar: v.calendar as any,
    }));

    const getRoomByUuid = (uuid: string) => rooms.find(v => v.uuid === uuid);

    let finishedExams = loadedData.finishedExams.map(v => (<Working.Booked<Working.Exam>>{
        room: getRoomByUuid(v.room),
        time: DateTime.fromISO(v.time), 
        value: {
            uuid: v.value.uuid,
            id: v.value.id,
            duration: Duration.fromISO(v.value.duration),
            
            mainSubject: v.value.mainSubject,
            tags: v.value.tags,
            pinned: v.value.pinned,

            // participants imported later
            examiners: v.value.examiners,
            examinees: v.value.examinees,
        } as any,
    }));

    const getExamByUuid = (uuid: string) => finishedExams.find(v => v.value.uuid === uuid);

    rooms.forEach(v => v.calendar = Calendar.fromJSON<Working.Exam, string>(v.calendar as any, v => getExamByUuid(v).value) as any);

    let students = loadedData.participants.students.map(v => (<Working.Student>{
        name: v.name,
        calendar: Calendar.fromJSON<Working.Exam, string>(v.calendar, v => getExamByUuid(v).value),
    }));

    const getStudentByUuid = (uuid: string) => students.find(v => v.name.uuid === uuid);

    let teachers = loadedData.participants.teachers.map(v => (<Working.Teacher>{
        name: v.name,
        subjects: v.subjects,
        calendar: Calendar.fromJSON<Working.Exam, string>(v.calendar, v => getExamByUuid(v).value),
    }));

    const getTeacherByUuid = (uuid: string) => teachers.find(v => v.name.uuid === uuid);

    let remainingExams = loadedData.remainingExams.map(v => (<Working.Exam>{
        uuid: v.uuid,
        id: v.id,
        duration: Duration.fromISO(v.duration),

        examinees: v.examinees.map(v => getStudentByUuid(v)),
        examiners: v.examiners.map(v => getTeacherByUuid(v)),
        pinned: v.pinned,
    }));

    let timetable: Working.Timetable = loadedData.timetable.map(v => ({
        duration: Duration.fromISO(v.duration),
        start: DateTime.fromISO(v.start),
    }));

    finishedExams.forEach(v => {
        v.value.examinees = v.value.examinees.map(v => getStudentByUuid(v as any));
        v.value.examiners = v.value.examiners.map(v => getTeacherByUuid(v as any)) as any;
    });

    workingData = <Working.Data>{
        remainingExams,
        finishedExams,

        rooms,
        teachers,
        students,
        timetable,
    };
}

// view data
function updateViewData(): void {
    let viewData: ViewData = {
        day: selectedDay,
        rooms: workingData.rooms.map(v => ({
            uuid: v.uuid,
            number: v.number,
            tags: v.tags,
            slots: workingData.timetable.map(t => ({
                interval: Interval.after(t.start, t.duration),
                exam: v.calendar.getEvents(t.start)[0]?.event || undefined, 
                conflicts: [],
                booked: v.calendar.isBooked(t.start, t.duration),
            })),
        })),

        remainingExams: workingData.remainingExams,
        teachers: workingData.teachers,
        timetable: workingData.timetable,
    };

    store.set(viewData);
}

export {
    insertExam,
    removeExam,
    computeExams,

    insertWriter,
    removeWriter,
    computeWriters,

    insertSecondaryExaminer,
    removeSecondaryExaminer,
    computeSecondaryExaminers,

    addRoom,
    setRoomNumber,

    addExam,

    save,
    load,
    
    // vars
    store,
}