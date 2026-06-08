-- ================================================================
-- CVISUAL — PROMOUVOIR UN COMPTE EXISTANT EN ADMIN
-- Le compte doit déjà exister dans Supabase Auth.
--
-- 1. Remplacez l'email ci-dessous par le vôtre
-- 2. Exécutez dans : Supabase Dashboard → SQL Editor → New Query
-- ================================================================

UPDATE auth.users
SET
    raw_app_meta_data  = raw_app_meta_data  || '{"role":"admin"}'::jsonb,
    raw_user_meta_data = raw_user_meta_data || '{"role":"admin"}'::jsonb,
    updated_at         = now()
WHERE email = 'admin@cvisual.com';   -- << Remplacez par votre email

-- Vérification : doit retourner 1 ligne mise à jour
-- Si 0 lignes → vérifiez que l'email est exact dans Authentication → Users
