-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CreditCardExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "justForRecord" BOOLEAN NOT NULL DEFAULT false,
    "value" REAL NOT NULL,
    "paidOut" BOOLEAN NOT NULL DEFAULT false,
    "anticipated" BOOLEAN NOT NULL DEFAULT false,
    "invoiceDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "installmentNumber" INTEGER NOT NULL DEFAULT 0,
    "totalInstallmentNumber" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creditCardExpenseGeneratorId" TEXT NOT NULL,
    "creditCardId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CreditCardExpense_creditCardExpenseGeneratorId_fkey" FOREIGN KEY ("creditCardExpenseGeneratorId") REFERENCES "CreditCardExpenseGenerator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreditCardExpense_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CreditCardExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CreditCardExpense" ("anticipated", "createdAt", "creditCardExpenseGeneratorId", "creditCardId", "id", "invoiceDate", "justForRecord", "name", "paidOut", "updatedAt", "userId", "value") SELECT "anticipated", "createdAt", "creditCardExpenseGeneratorId", "creditCardId", "id", "invoiceDate", "justForRecord", "name", "paidOut", "updatedAt", "userId", "value" FROM "CreditCardExpense";
DROP TABLE "CreditCardExpense";
ALTER TABLE "new_CreditCardExpense" RENAME TO "CreditCardExpense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
