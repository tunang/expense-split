/*
  Warnings:

  - You are about to drop the column `expiry_time` on the `InvalidatedToken` table. All the data in the column will be lost.
  - Added the required column `expiryTime` to the `InvalidatedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvalidatedToken" DROP COLUMN "expiry_time",
ADD COLUMN     "expiryTime" TIMESTAMP(3) NOT NULL;
