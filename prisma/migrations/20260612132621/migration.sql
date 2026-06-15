-- AlterTable
ALTER TABLE "User"
ADD COLUMN     "email" TEXT,
ADD COLUMN     "isTemporaryEmail" BOOLEAN NOT NULL DEFAULT false;

--Backfill users
  UPDATE "User"
  SET
    "email" = 'temp_' || id || '@tarot.local',
    "isTemporaryEmail"= true
  WHERE "email" IS NULL;
-- Email and firstName are now required
ALTER TABLE "User"
  ALTER COLUMN "email" SET NOT NULL,
  ALTER COLUMN "firstName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Drop obsolete username
BEGIN;
DROP INDEX "User_username_key";
ALTER TABLE "User" DROP COLUMN "username";
COMMIT;
