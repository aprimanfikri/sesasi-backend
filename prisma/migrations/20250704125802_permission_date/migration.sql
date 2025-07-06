/*
  Warnings:

  - You are about to drop the column `content` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Permission` table. All the data in the column will be lost.
  - Added the required column `description` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "verificatorId" TEXT,
    "verificatorComment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Permission_verificatorId_fkey" FOREIGN KEY ("verificatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Permission" ("createdAt", "id", "status", "title", "updatedAt", "userId", "verificatorComment", "verificatorId") SELECT "createdAt", "id", "status", "title", "updatedAt", "userId", "verificatorComment", "verificatorId" FROM "Permission";
DROP TABLE "Permission";
ALTER TABLE "new_Permission" RENAME TO "Permission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
