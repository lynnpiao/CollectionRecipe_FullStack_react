/*
  Warnings:

  - You are about to alter the column `name` on the `Ingredient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Ingredient` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `password` VARCHAR(191) NOT NULL;
