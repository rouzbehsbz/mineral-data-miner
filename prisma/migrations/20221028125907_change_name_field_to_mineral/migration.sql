/*
  Warnings:

  - You are about to drop the column `name` on the `production_rates` table. All the data in the column will be lost.
  - Added the required column `mineral` to the `production_rates` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_production_rates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mineral" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL
);
INSERT INTO "new_production_rates" ("amount", "country", "id", "year") SELECT "amount", "country", "id", "year" FROM "production_rates";
DROP TABLE "production_rates";
ALTER TABLE "new_production_rates" RENAME TO "production_rates";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
