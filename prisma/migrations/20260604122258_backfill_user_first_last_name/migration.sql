UPDATE "User"
SET
  "firstName" = split_part(username, ' ', 1),
  "lastName" = CASE
                 WHEN position(' ' in username) = 0 THEN NULL
                 ELSE NULLIF(substring(username from position(' ' in username) + 1), '')
    END
WHERE "firstName" IS NULL
  AND "lastName" IS NULL;
