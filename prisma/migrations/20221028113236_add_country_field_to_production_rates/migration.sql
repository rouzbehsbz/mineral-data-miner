/*
  Warnings:

  - Added the required column `country` to the `production_rates` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_production_rates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL
);
INSERT INTO "new_production_rates" ("amount", "id", "name", "year") SELECT "amount", "id", "name", "year" FROM "production_rates";
DROP TABLE "production_rates";
ALTER TABLE "new_production_rates" RENAME TO "production_rates";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
