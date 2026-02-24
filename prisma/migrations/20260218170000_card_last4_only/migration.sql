-- Update Card storage to keep only last4
ALTER TABLE "Card" ADD COLUMN "last4" TEXT;

UPDATE "Card"
SET "last4" = RIGHT(regexp_replace("number", '\\D', '', 'g'), 4);

ALTER TABLE "Card" ALTER COLUMN "last4" SET NOT NULL;

ALTER TABLE "Card" DROP COLUMN "number";
