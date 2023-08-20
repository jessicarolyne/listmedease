-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tutor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dateofbirth" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    CONSTRAINT "Tutor_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dateofbirth" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "notes" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TutorPatient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tutorID" TEXT NOT NULL,
    "patientID" TEXT NOT NULL,
    CONSTRAINT "TutorPatient_tutorID_fkey" FOREIGN KEY ("tutorID") REFERENCES "Tutor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TutorPatient_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
