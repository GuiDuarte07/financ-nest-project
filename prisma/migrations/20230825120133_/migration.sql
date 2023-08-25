-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creditCardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CreditCardExpenseGenerator_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreditCardExpenseGenerator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CreditCardExpenseGenerator" ("createdAt", "creditCardId", "earlyPaymentDiscount", "id", "installment", "invoiceDate", "justForRecord", "name", "paymentEndDate", "purchaseDate", "totalValue", "updatedAt", "userId") SELECT "createdAt", "creditCardId", "earlyPaymentDiscount", "id", "installment", "invoiceDate", "justForRecord", "name", "paymentEndDate", "purchaseDate", "totalValue", "updatedAt", "userId" FROM "CreditCardExpenseGenerator";
DROP TABLE "CreditCardExpenseGenerator";
ALTER TABLE "new_CreditCardExpenseGenerator" RENAME TO "CreditCardExpenseGenerator";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
