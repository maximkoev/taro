UPDATE "User"
SET
  "firstName" = split_part(username, ' ', 1),
  "lastName" = NULLIF(substring(username from position(' ' in username) + 1), '')
WHERE "firstName" IS NULL
  AND "lastName" IS NULL;
