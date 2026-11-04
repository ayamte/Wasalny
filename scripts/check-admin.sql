-- Read-only diagnostic. Run against auth_db, where login accounts are stored.
-- A user_profiles row alone does not create a login account.
SELECT uuid, email, username, role, enabled
FROM users
WHERE role = 'ADMIN';
