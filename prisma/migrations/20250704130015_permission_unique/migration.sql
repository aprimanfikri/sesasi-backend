/*
  Warnings:

  - A unique constraint covering the columns `[title,userId,startDate,endDate]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_title_userId_startDate_endDate_key" ON "Permission"("title", "userId", "startDate", "endDate");
