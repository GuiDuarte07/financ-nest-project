/*
  Warnings:

  - You are about to drop the column `account_id` on the `Income` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `Income` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Income` table without a default value. This is not possible if the table is not empty.

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
    "categoryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Income_recorrenceId_fkey" FOREIGN KEY ("recorrenceId") REFERENCES "RecorrenceBillsProcess" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Income_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Income_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Income" ("createdAt", "description", "id", "justForRecord", "receivedAt", "recorrenceId", "userId", "value") SELECT "createdAt", "description", "id", "justForRecord", "receivedAt", "recorrenceId", "userId", "value" FROM "Income";
DROP TABLE "Income";
ALTER TABLE "new_Income" RENAME TO "Income";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
