-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ingredient` (
    `ingredientId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,

    UNIQUE INDEX `Ingredient_name_key`(`name`),
    PRIMARY KEY (`ingredientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recipe` (
    `recipeId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `duration` INTEGER NULL,
    `userId` INTEGER NULL,
    `photoUrl` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Recipe_title_key`(`title`),
    PRIMARY KEY (`recipeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `reviewId` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `comment` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`reviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IngredientRecipe` (
    `ingredientId` INTEGER NOT NULL,
    `recipeId` INTEGER NOT NULL,
    `amount` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ingredientId`, `recipeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProcedureRecipe` (
    `procedureId` INTEGER NOT NULL,
    `recipeId` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`procedureId`, `recipeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`recipeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IngredientRecipe` ADD CONSTRAINT `IngredientRecipe_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredient`(`ingredientId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IngredientRecipe` ADD CONSTRAINT `IngredientRecipe_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`recipeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcedureRecipe` ADD CONSTRAINT `ProcedureRecipe_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`recipeId`) ON DELETE CASCADE ON UPDATE CASCADE;
