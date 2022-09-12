# solver

## functions
```ts
// controller.ts

let selectedDay: DateTime;
let workingData: Working.Data;

// exams
function insertExam(examUuid: string, roomUuid: string, time: DateTime): void;
function removeExam(examUuid: string): void;

function computeExams(): void;

// writers
function insertWriter(examUuid: string, writerUuid: string): void;
function removeWriter(examUuid: string): void;

function computeWriters(): void;

// secondary examiners
function insertSecondaryExaminer(examUuid: string, examinerUuid: string): void;
function removeSecondaryExaminer(examUuid: string): void;

function computeSecondaryExaminers(): void;

// verification
function verify(): void;

// ? select the current day 
function selectDay(value: { year: number, month: number, day: number }): void;

// save / load
function save(): void;
function load(): void;
```

## constraints
### hard
- no person has more than one exam at a time
- the required tags must be used
- the exam cant be put in a slot already containing an exam
- the exam shouldnt overlap other exams in slots below

### soft
- matching tags let the exam rank higher
    - exams that fit a room better should be prefferd
- longer exams rank heigher
    - harder to find a slot for longer exams

### working data
```ts
type Name = {
    uuid: string,
    first: string,
    last: string,
    title?: string,
};

type Student = {
    name: Name,
    timetable: Timetable,
};

type Teacher = {
    name: Name,
    timetable: Timetable,
    subjects: String[],
};

type Exam = {
    uuid: string,
    id: string,
    durations: Duration,
    examiners: [Teacher, Teacher | undefined, Teacher | undefined],
    examinees: Student[],
    pinned: boolean,
};

type Room = {
    uuid: string,
    number: string,
    tags: string[],
    timetable: Timetable,
};

type Data = {
    remainingExams: Exam[],
    finishedExams: Exam[],   

    rooms: Room[],
    teachers: Teacher[],
    timetable: Timetable,
};

function makeViewData(day: DateTime): View.Data;
```

### view data
```ts
type ViewConflict = {
    description: string,
};

type ViewData = {
    day: DateTime,
    rooms: {
        uuid: string,
        number: string,
        tags: string[],
        slots: {
            startTime: DateTime,
            exam?: Exam,
            conflicts: ViewConflict[],
            booked: boolean,
        }[],
    }[],

    remainingExams: Exam[],
    teachers: Teacher[],
    timetable: Timetable,
};
```

### file format
```ts
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

type Timetable = {
    interval: string,
    // uuid of the booked exam
    event: string,
};

type FileFormat = {
    remainingExams: Exam[],
    finishedExams: Exam[],
        
    rooms: {
        uuid: string,
        number: string,
        tags: string[],
        timetable: Timetable,
    }[],
        
    participants: {
        teachers: {
            name: Name,
            timetable: Timetable,
            subjects: string[],
        }[],
        students: {
            name: Name,
            timetable: Timetable,
        }[],
    },
        
    timetable: {
        // moment.js as string
        start: string,
        duration: string,
    }[],
};
```
