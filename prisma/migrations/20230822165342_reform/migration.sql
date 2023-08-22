/*
  Warnings:

  - You are about to drop the column `dayOfPayment` on the `RecorrenceBillsProcess` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "balance" REAL NOT NULL,
    "initialBalance" REAL NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "color" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("balance", "bank", "color", "createdAt", "description", "id", "type", "updatedAt", "userId") SELECT "balance", "bank", "color", "createdAt", "description", "id", "type", "updatedAt", "userId" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "purchaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "justForRecord" BOOLEAN NOT NULL DEFAULT false,
    "recorrenceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    CONSTRAINT "Expense_recorrenceId_fkey" FOREIGN KEY ("recorrenceId") REFERENCES "RecorrenceBillsProcess" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("accountId", "categoryId", "createdAt", "description", "id", "justForRecord", "purchaseDate", "updatedAt", "userId", "value") SELECT "accountId", "categoryId", "createdAt", "description", "id", "justForRecord", "purchaseDate", "updatedAt", "userId", "value" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
CREATE TABLE "new_Income" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "justForRecord" BOOLEAN NOT NULL DEFAULT false,
    "recorrenceId" TEXT,
    "category_id" TEXT,
    "account_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Income_recorrenceId_fkey" FOREIGN KEY ("recorrenceId") REFERENCES "RecorrenceBillsProcess" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Income_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Income_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Income" ("account_id", "category_id", "createdAt", "description", "id", "justForRecord", "receivedAt", "value") SELECT "account_id", "category_id", "createdAt", "description", "id", "justForRecord", "receivedAt", "value" FROM "Income";
DROP TABLE "Income";
ALTER TABLE "new_Income" RENAME TO "Income";
CREATE TABLE "new_RecorrenceBillsProcess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "stopCount" BOOLEAN NOT NULL DEFAULT false,
    "paymentRecurrence" TEXT NOT NULL,
    "monthlyDayOfPayment" INTEGER,
    "weeklyDay" TEXT,
    "countNumber" INTEGER NOT NULL DEFAULT 0,
    "rememberDayOfPayment" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_RecorrenceBillsProcess" ("id", "paymentRecurrence", "rememberDayOfPayment", "startDate", "stopCount", "type", "value") SELECT "id", "paymentRecurrence", "rememberDayOfPayment", "startDate", "stopCount", "type", "value" FROM "RecorrenceBillsProcess";
DROP TABLE "RecorrenceBillsProcess";
ALTER TABLE "new_RecorrenceBillsProcess" RENAME TO "RecorrenceBillsProcess";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
