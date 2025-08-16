/*
  Warnings:

  - Added the required column `static` to the `Element` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Element" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "static" BOOLEAN NOT NULL
);
INSERT INTO "new_Element" ("height", "id", "imageUrl", "width") SELECT "height", "id", "imageUrl", "width" FROM "Element";
DROP TABLE "Element";
ALTER TABLE "new_Element" RENAME TO "Element";
CREATE UNIQUE INDEX "Element_id_key" ON "Element"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
