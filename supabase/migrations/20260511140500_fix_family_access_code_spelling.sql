-- Correct access-code spelling in stored hash: ...-youre-done (not ...-your-done).
-- No-ops if the old typo hash was never inserted.

UPDATE public.family_access_codes
SET code_hash = '6aff8d8d97df0c49490feba8bbdb4ddb6bfd2d849bbcfef471c55ed4e0fbbfc4'
WHERE code_hash = 'fd4e118c20b4f7fbafaab236d2d22d188a6e33a6a74c958234e5e5c91c89487d';
