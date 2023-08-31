/*
  Warnings:

  - You are about to drop the column `employers` on the `limits` table. All the data in the column will be lost.
  - You are about to drop the column `employeId` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `employees` to the `limits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_employeId_fkey";

-- AlterTable
ALTER TABLE "limits" DROP COLUMN "employers",
ADD COLUMN     "employees" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "employeId",
ADD COLUMN     "employeeId" INTEGER;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
