DO $$
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO core.User (id, name, updated_at)
    VALUES (100 + i, 'testUser' || i, CURRENT_TIMESTAMP);
  END LOOP;
END $$;

INSERT INTO core.Post (title, body, updated_at, created_at, author_id)
SELECT 'Title ' || u.id, 'Body ' || u.id, CURRENT_TIMESTAMP, date(TIMESTAMP '2022-06-01 00:00:00' + trunc(random()  * 10) * '1 month'::interval), u.id
FROM core.User u
LIMIT 100;