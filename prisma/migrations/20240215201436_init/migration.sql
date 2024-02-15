-- AlterTable
ALTER TABLE `topic` MODIFY `is_closed` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `is_pinned` BOOLEAN NOT NULL DEFAULT false;
