/*
  Warnings:

  - Made the column `password` on table `Tenant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "setupToken" TEXT,
ADD COLUMN     "setupTokenExpiry" TIMESTAMP(3),
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "password" SET NOT NULL;
