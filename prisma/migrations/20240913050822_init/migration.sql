-- CreateTable
CREATE TABLE `UserCredentials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'regular') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `userid` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `mobilenumber` VARCHAR(191) NULL,
    `gender` ENUM('Male', 'Female', 'Other') NULL,
    `role` ENUM('admin', 'regular') NOT NULL,

    PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Train` (
    `trainid` INTEGER NOT NULL AUTO_INCREMENT,
    `trainName` VARCHAR(191) NOT NULL,
    `maxSeatsAvailable` INTEGER NOT NULL,
    `startLocation` VARCHAR(191) NOT NULL,
    `endLocation` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`trainid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `ticketid` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `trainid` INTEGER NOT NULL,
    `seatNo` INTEGER NOT NULL,

    PRIMARY KEY (`ticketid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seats` (
    `trainid` INTEGER NOT NULL,
    `seats` JSON NOT NULL,

    PRIMARY KEY (`trainid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_trainid_fkey` FOREIGN KEY (`trainid`) REFERENCES `Train`(`trainid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seats` ADD CONSTRAINT `Seats_trainid_fkey` FOREIGN KEY (`trainid`) REFERENCES `Train`(`trainid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Full Text Index
ALTER TABLE `Train` ADD FULLTEXT(`trainName`);