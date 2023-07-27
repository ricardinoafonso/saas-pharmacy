/*
  Warnings:

  - You are about to drop the column `adress` on the `employees` table. All the data in the column will be lost.
  - Added the required column `address` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT NOT NULL;
