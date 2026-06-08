-- ================================================================
-- CVISUAL — CRÉER L'UTILISATEUR ADMIN
-- Exécutez ce script UNE SEULE FOIS dans :
--   Supabase Dashboard → SQL Editor → New Query
--
-- AVANT D'EXÉCUTER : remplacez les 2 valeurs ci-dessous
-- ================================================================

DO $$
DECLARE
  v_email    text := 'admin@cvisual.com';       -- << Votre email admin
  v_password text := 'MotDePasseAdmin123!';     -- << Votre mot de passe (min 8 caractères)
  v_uid      uuid;
BEGIN

  -- Créer le compte (ou mettre à jour si déjà existant)
  INSERT INTO auth.users (
    id, instance_id,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change,
    email_change_token_new, recovery_token
  )
  VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    v_email,
    crypt(v_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
    '{"full_name":"Admin CVisual","role":"admin"}'::jsonb,
    now(), now(),
    '', '', '', ''
  )
  ON CONFLICT (email) DO UPDATE
    SET encrypted_password  = crypt(v_password, gen_salt('bf')),
        raw_app_meta_data   = auth.users.raw_app_meta_data || '{"role":"admin"}'::jsonb,
        raw_user_meta_data  = auth.users.raw_user_meta_data || '{"role":"admin"}'::jsonb,
        email_confirmed_at  = COALESCE(auth.users.email_confirmed_at, now()),
        updated_at          = now();

  -- Récupérer l'id généré
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;

  -- Lier l'identité email (nécessaire pour la connexion)
  INSERT INTO auth.identities (
    id, user_id, provider_id,
    identity_data, provider,
    last_sign_in_at, created_at, updated_at
  )
  VALUES (
    gen_random_uuid(),
    v_uid,
    v_email,
    jsonb_build_object('sub', v_uid::text, 'email', v_email),
    'email',
    now(), now(), now()
  )
  ON CONFLICT (provider, provider_id) DO NOTHING;

  RAISE NOTICE 'Admin créé / mis à jour : %  (id: %)', v_email, v_uid;

END $$;
