-- AlterTable
ALTER TABLE `reply` MODIFY `is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `usernotification` MODIFY `is_read` BOOLEAN NOT NULL DEFAULT false;
