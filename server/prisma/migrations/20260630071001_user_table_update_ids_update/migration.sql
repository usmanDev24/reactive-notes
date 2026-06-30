/*
  Warnings:

  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerified",
ADD COLUMN     "unverified_email" VARCHAR(256),
ADD COLUMN     "verification_code" JSONB,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
