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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creditCardExpenseGeneratorId" TEXT NOT NULL,
    "creditCardId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CreditCardExpense_creditCardExpenseGeneratorId_fkey" FOREIGN KEY ("creditCardExpenseGeneratorId") REFERENCES "CreditCardExpenseGenerator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreditCardExpense_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CreditCardExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CreditCardExpense" ("createdAt", "creditCardExpenseGeneratorId", "creditCardId", "id", "invoiceDate", "justForRecord", "name", "paidOut", "updatedAt", "userId", "value") SELECT "createdAt", "creditCardExpenseGeneratorId", "creditCardId", "id", "invoiceDate", "justForRecord", "name", "paidOut", "updatedAt", "userId", "value" FROM "CreditCardExpense";
DROP TABLE "CreditCardExpense";
ALTER TABLE "new_CreditCardExpense" RENAME TO "CreditCardExpense";
CREATE TABLE "new_CreditCardExpenseGenerator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "justForRecord" BOOLEAN NOT NULL DEFAULT false,
    "totalValue" REAL NOT NULL,
    "earlyPaymentDiscount" REAL NOT NULL DEFAULT 0,
    "installment" INTEGER NOT NULL,
    "purchaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoiceDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentEndDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creditCardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CreditCardExpenseGenerator_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreditCardExpenseGenerator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CreditCardExpenseGenerator" ("createdAt", "creditCardId", "id", "installment", "invoiceDate", "justForRecord", "name", "paymentEndDate", "purchaseDate", "totalValue", "updatedAt", "userId") SELECT "createdAt", "creditCardId", "id", "installment", "invoiceDate", "justForRecord", "name", "paymentEndDate", "purchaseDate", "totalValue", "updatedAt", "userId" FROM "CreditCardExpenseGenerator";
DROP TABLE "CreditCardExpenseGenerator";
ALTER TABLE "new_CreditCardExpenseGenerator" RENAME TO "CreditCardExpenseGenerator";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
