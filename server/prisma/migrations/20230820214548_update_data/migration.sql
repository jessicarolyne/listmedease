/*
  Warnings:

  - You are about to alter the column `dateofbirth` on the `Patient` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `dateofbirth` on the `Tutor` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dateofbirth" DATETIME NOT NULL,
    "age" INTEGER NOT NULL,
    "notes" TEXT NOT NULL
);
INSERT INTO "new_Patient" ("age", "dateofbirth", "id", "name", "notes") SELECT "age", "dateofbirth", "id", "name", "notes" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE TABLE "new_Tutor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dateofbirth" DATETIME NOT NULL,
    "age" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    CONSTRAINT "Tutor_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tutor" ("age", "dateofbirth", "id", "name", "notes", "userID") SELECT "age", "dateofbirth", "id", "name", "notes", "userID" FROM "Tutor";
DROP TABLE "Tutor";
ALTER TABLE "new_Tutor" RENAME TO "Tutor";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
