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
    RAISE EXCEPTION 'Expected column "username" to exist in table "User"';
END IF;

  IF actual_nullable <> 'NO' THEN
    RAISE EXCEPTION 'Expected column "username" to be NOT NULL, got nullable=%', actual_nullable;
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


SELECT "firstName" || '|' || COALESCE("lastName", '<NULL>')
INTO actual_nullable
FROM "User"
WHERE username = 'Maksym Koiev';

IF actual_nullable IS NULL THEN
    RAISE EXCEPTION 'Expected seeded user "Maksym Koiev" to exist';
END IF;

IF actual_nullable <> 'Maksym|Koiev' THEN
    RAISE EXCEPTION 'Expected "Maksym Koiev" to be split into firstName="Maksym", lastName="Koiev", got %', actual_nullable;
END IF;


SELECT "firstName" || '|' || COALESCE("lastName", '<NULL>')
INTO actual_nullable
FROM "User"
WHERE username = 'Madonna';

IF actual_nullable IS NULL THEN
    RAISE EXCEPTION 'Expected seeded user "Madonna" to exist';
END IF;

IF actual_nullable <> 'Madonna|<NULL>' THEN
    RAISE EXCEPTION 'Expected "Madonna" to be split into firstName="Madonna", lastName=NULL, got %', actual_nullable;
END IF;


SELECT "firstName" || '|' || COALESCE("lastName", '<NULL>')
INTO actual_nullable
FROM "User"
WHERE username = 'Jean Claude Van Damme';

IF actual_nullable IS NULL THEN
    RAISE EXCEPTION 'Expected seeded user "Jean Claude Van Damme" to exist';
END IF;

IF actual_nullable <> 'Jean|Claude Van Damme' THEN
    RAISE EXCEPTION 'Expected "Jean Claude Van Damme" to be split into firstName="Jean", lastName="Claude Van Damme", got %', actual_nullable;
END IF;
END $$;
