/*
  Warnings:

  - You are about to drop the column `isRead` on the `chatmessage` table. All the data in the column will be lost.
  - You are about to drop the column `isClosed` on the `topic` table. All the data in the column will be lost.
  - You are about to drop the column `isPinned` on the `topic` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `usernotification` table. All the data in the column will be lost.
  - Added the required column `is_read` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_closed` to the `Topic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_pinned` to the `Topic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_read` to the `UserNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `chatmessage` DROP COLUMN `isRead`,
    ADD COLUMN `is_read` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `topic` DROP COLUMN `isClosed`,
    DROP COLUMN `isPinned`,
    ADD COLUMN `is_closed` BOOLEAN NOT NULL,
    ADD COLUMN `is_pinned` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `usernotification` DROP COLUMN `isRead`,
    ADD COLUMN `is_read` BOOLEAN NOT NULL;
