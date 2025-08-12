-- CreateTable
CREATE TABLE `Registration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aadhaar` VARCHAR(191) NOT NULL,
    `aadhaarName` VARCHAR(191) NOT NULL,
    `pan` VARCHAR(191) NOT NULL,
    `panName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Registration_aadhaar_key`(`aadhaar`),
    UNIQUE INDEX `Registration_pan_key`(`pan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
