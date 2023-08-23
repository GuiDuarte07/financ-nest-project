/*
  Warnings:

  - Added the required column `userId` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Made the column `category_id` on table `Income` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Income" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "justForRecord" BOOLEAN NOT NULL DEFAULT false,
    "recorrenceId" TEXT,
    "category_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Income_recorrenceId_fkey" FOREIGN KEY ("recorrenceId") REFERENCES "RecorrenceBillsProcess" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Income_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Income_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Income" ("account_id", "category_id", "createdAt", "description", "id", "justForRecord", "receivedAt", "recorrenceId", "value") SELECT "account_id", "category_id", "createdAt", "description", "id", "justForRecord", "receivedAt", "recorrenceId", "value" FROM "Income";
DROP TABLE "Income";
ALTER TABLE "new_Income" RENAME TO "Income";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
