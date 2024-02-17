-- AlterTable
ALTER TABLE `user` MODIFY `is_admin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `is_banned` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `is_active` BOOLEAN NOT NULL DEFAULT true;
