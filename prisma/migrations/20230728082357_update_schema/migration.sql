/*
  Warnings:

  - You are about to drop the column `type` on the `tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "type",
ADD COLUMN     "token_type" TEXT;
