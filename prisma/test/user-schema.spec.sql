DO $$
DECLARE
actual_nullable text;
BEGIN
SELECT is_nullable
INTO actual_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'User'
  AND column_name = 'username';

IF actual_nullable IS NULL THEN
    RAISE EXCEPTION 'Expected column "name" to exist in table "User"';
END IF;

  IF actual_nullable <> 'NO' THEN
    RAISE EXCEPTION 'Expected column "name" to be NOT NULL, got nullable=%', actual_nullable;
END IF;


SELECT is_nullable
INTO actual_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'User'
  AND column_name = 'firstName';

IF actual_nullable IS NULL THEN
    RAISE EXCEPTION 'Expected column "firstName" to exist in table "User"';
END IF;

  IF actual_nullable <> 'YES' THEN
    RAISE EXCEPTION 'Expected column "firstName" to be nullable, got nullable=%', actual_nullable;
END IF;


SELECT is_nullable
INTO actual_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'User'
  AND column_name = 'lastName';

IF actual_nullable IS NULL THEN
    RAISE EXCEPTION 'Expected column "lastName" to exist in table "User"';
END IF;

  IF actual_nullable <> 'YES' THEN
    RAISE EXCEPTION 'Expected column "lastName" to be nullable, got nullable=%', actual_nullable;
END IF;
END $$;
