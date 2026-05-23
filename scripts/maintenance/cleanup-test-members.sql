-- Cleanup script: remove non-professional test entries from the members table
-- Context: Test submissions with non-professional content were accidentally approved
--          via the admin interface during development. The seed.ts is clean (54 entries),
--          so this only targets post-seed entries with non-professional content.
-- Run: psql $DATABASE_URL -f scripts/maintenance/cleanup-test-members.sql
-- Always run in a transaction so you can ROLLBACK before COMMIT if the preview looks wrong.

BEGIN;

-- Preview: show which rows will be affected before committing
SELECT id, slug, name, description, status, created_at
FROM members
WHERE
  name ILIKE '%test%'
  OR name ILIKE '%vive%'
  OR description ILIKE '%vive le mariage%'
  OR description ILIKE '%super!%'
  OR description ILIKE '%^test^%'
  OR (status = 'active' AND created_at > NOW() - INTERVAL '90 days'
      AND description IS NOT NULL AND char_length(description) < 10)
ORDER BY created_at DESC;

-- Uncomment the DELETE and COMMIT below only after verifying the SELECT output above.
-- DELETE FROM member_activities
-- WHERE member_id IN (
--   SELECT id FROM members
--   WHERE
--     name ILIKE '%test%'
--     OR name ILIKE '%vive%'
--     OR description ILIKE '%vive le mariage%'
--     OR description ILIKE '%super!%'
--     OR description ILIKE '%^test^%'
--     OR (status = 'active' AND created_at > NOW() - INTERVAL '90 days'
--         AND description IS NOT NULL AND char_length(description) < 10)
-- );

-- DELETE FROM members
-- WHERE
--   name ILIKE '%test%'
--   OR name ILIKE '%vive%'
--   OR description ILIKE '%vive le mariage%'
--   OR description ILIKE '%super!%'
--   OR description ILIKE '%^test^%'
--   OR (status = 'active' AND created_at > NOW() - INTERVAL '90 days'
--       AND description IS NOT NULL AND char_length(description) < 10);

-- COMMIT;
ROLLBACK;
