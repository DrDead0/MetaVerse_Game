/*
  Warnings:

  - Added the required column `thumbnail` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Map" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Map" ("height", "id", "name", "width") SELECT "height", "id", "name", "width" FROM "Map";
DROP TABLE "Map";
ALTER TABLE "new_Map" RENAME TO "Map";
CREATE UNIQUE INDEX "Map_id_key" ON "Map"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
