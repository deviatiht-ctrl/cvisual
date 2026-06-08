-- =============================================================
-- CVISUAL SUPABASE SCHEMA  |  04_seed.sql
-- Données par défaut : settings, email templates, admin
-- Exécuter APRÈS 01_tables.sql
-- Les templates utilisent $$ quoting pour éviter les conflits
-- avec les guillemets simples dans le HTML.
-- =============================================================

-- -----------------------------------------------
-- SETTINGS
-- -----------------------------------------------
INSERT INTO cvisual_settings (key, value) VALUES
    ('logo_url', 'https://cvisual-backend.onrender.com/api/uploads/logo.jpg')
ON CONFLICT (key) DO NOTHING;

-- -----------------------------------------------
-- EMAIL TEMPLATES
-- -----------------------------------------------

-- 1. Candidature reçue (candidat)
INSERT INTO cvisual_email_templates (key, name, subject, variables, body)
VALUES (
    'candidature_received',
    'Candidature Recue (Candidat)',
    'Candidature Recue - CVisual Agency',
    'full_name, whatsapp, tiktok, logo_url',
    $$<div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;border:1px solid #e2e8f0;border-radius:24px;background-color:#ffffff;color:#1e293b;">
<div style="text-align:center;margin-bottom:30px;">
<img src="{logo_url}" alt="CVisual Logo" style="width:70px;height:70px;border-radius:16px;margin-bottom:15px;">
<h2 style="color:#3b82f6;font-size:28px;font-weight:800;margin:0;">Candidature Recue !</h2>
<p style="color:#64748b;font-size:14px;margin-top:5px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">CVisual Agency</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Bonjour <b>{full_name}</b>,</p>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Nous avons bien recu votre candidature pour rejoindre l'equipe creative de <b>CVisual Agency</b>. Nous vous remercions pour l'interet et la confiance que vous nous accordez.</p>
<div style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:16px;margin-bottom:30px;">
<h4 style="margin:0 0 10px 0;font-size:14px;text-transform:uppercase;color:#64748b;">Recapitulatif de votre dossier</h4>
<table style="width:100%;font-size:14px;border-collapse:collapse;">
<tr><td style="padding:6px 0;color:#64748b;width:120px;">Nom complet :</td><td style="padding:6px 0;font-weight:600;">{full_name}</td></tr>
<tr><td style="padding:6px 0;color:#64748b;">WhatsApp :</td><td style="padding:6px 0;font-weight:600;">{whatsapp}</td></tr>
<tr><td style="padding:6px 0;color:#64748b;">TikTok :</td><td style="padding:6px 0;font-weight:600;">{tiktok}</td></tr>
</table>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Notre equipe va etudier votre profil avec la plus grande attention. Si vos competences correspondent a nos besoins, nous vous contacterons tres prochainement.</p>
<hr style="border:0;border-top:1px solid #e2e8f0;margin:30px 0;">
<p style="font-size:14px;color:#64748b;line-height:1.5;margin:0;text-align:center;">Cordialement,<br><span style="font-size:16px;font-weight:700;color:#0f172a;">L'equipe CVisual Agency</span><br><a href="mailto:cvisualht1@gmail.com" style="color:#3b82f6;">cvisualht1@gmail.com</a></p>
</div>$$
) ON CONFLICT (key) DO NOTHING;

-- 2. Candidature acceptée
INSERT INTO cvisual_email_templates (key, name, subject, variables, body)
VALUES (
    'candidature_accepted',
    'Candidature Acceptee (Candidat)',
    'Felicitations ! Votre candidature est acceptee - CVisual Agency',
    'full_name, whatsapp, logo_url',
    $$<div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;border:1px solid #e2e8f0;border-radius:24px;background-color:#ffffff;color:#1e293b;">
<div style="text-align:center;margin-bottom:30px;">
<img src="{logo_url}" alt="CVisual Logo" style="width:70px;height:70px;border-radius:16px;margin-bottom:15px;">
<h2 style="color:#10b981;font-size:28px;font-weight:800;margin:0;">Felicitations ! 🎉</h2>
<p style="color:#64748b;font-size:14px;margin-top:5px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">CVisual Agency</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Bonjour <b>{full_name}</b>,</p>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Nous avons le plaisir de vous annoncer que votre candidature pour rejoindre <b>CVisual Agency</b> a ete retenue !</p>
<div style="background-color:#f0fdf4;border:1px solid #bbf7d0;padding:20px;border-radius:16px;margin-bottom:30px;">
<h4 style="margin:0 0 10px 0;font-size:14px;text-transform:uppercase;color:#166534;">Prochaines etapes</h4>
<p style="font-size:14px;line-height:1.6;color:#14532d;margin:0;">1. Un responsable va vous ajouter au groupe d'onboarding sur <b>WhatsApp</b>.<br>2. Vous recevrez les acces a vos outils de travail.<br>3. Une reunion d'accueil sera planifiee dans la semaine.</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Questions urgentes ? Ecrivez-nous directement sur WhatsApp ({whatsapp}).</p>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Bienvenue dans l'aventure CVisual !</p>
<hr style="border:0;border-top:1px solid #e2e8f0;margin:30px 0;">
<p style="font-size:14px;color:#64748b;line-height:1.5;margin:0;text-align:center;">Cordialement,<br><span style="font-size:16px;font-weight:700;color:#0f172a;">La Direction - CVisual Agency</span><br><a href="mailto:cvisualht1@gmail.com" style="color:#3b82f6;">cvisualht1@gmail.com</a></p>
</div>$$
) ON CONFLICT (key) DO NOTHING;

-- 3. Invitation entretien
INSERT INTO cvisual_email_templates (key, name, subject, variables, body)
VALUES (
    'candidature_interview',
    'Invitation a un Entretien (Candidat)',
    'Invitation a un entretien - CVisual Agency',
    'full_name, whatsapp, logo_url',
    $$<div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;border:1px solid #e2e8f0;border-radius:24px;background-color:#ffffff;color:#1e293b;">
<div style="text-align:center;margin-bottom:30px;">
<img src="{logo_url}" alt="CVisual Logo" style="width:70px;height:70px;border-radius:16px;margin-bottom:15px;">
<h2 style="color:#3b82f6;font-size:28px;font-weight:800;margin:0;">Invitation Entretien 📅</h2>
<p style="color:#64748b;font-size:14px;margin-top:5px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">CVisual Agency</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Bonjour <b>{full_name}</b>,</p>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Nous avons le plaisir de vous inviter a un entretien individuel pour votre candidature chez <b>CVisual Agency</b>.</p>
<div style="background-color:#eff6ff;border:1px solid #bfdbfe;padding:20px;border-radius:16px;margin-bottom:30px;">
<h4 style="margin:0 0 10px 0;font-size:14px;text-transform:uppercase;color:#1e3a8a;">Modalites</h4>
<p style="font-size:14px;line-height:1.6;color:#1e3a8a;margin:0;">• <b>Format :</b> Visioconference ou telephonique<br>• <b>Duree :</b> 20 a 30 minutes<br>• <b>Planification :</b> Un responsable vous contactera sur WhatsApp ({whatsapp}) pour fixer le rendez-vous.</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Preparez une rapide presentation de vos meilleures realisations. Nous sommes impatients d'echanger avec vous !</p>
<hr style="border:0;border-top:1px solid #e2e8f0;margin:30px 0;">
<p style="font-size:14px;color:#64748b;line-height:1.5;margin:0;text-align:center;">Cordialement,<br><span style="font-size:16px;font-weight:700;color:#0f172a;">L'equipe RH - CVisual Agency</span><br><a href="mailto:cvisualht1@gmail.com" style="color:#3b82f6;">cvisualht1@gmail.com</a></p>
</div>$$
) ON CONFLICT (key) DO NOTHING;

-- 4. Candidature non retenue
INSERT INTO cvisual_email_templates (key, name, subject, variables, body)
VALUES (
    'candidature_rejected',
    'Candidature Non Retenue (Candidat)',
    'Mise a jour concernant votre candidature - CVisual Agency',
    'full_name, logo_url',
    $$<div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;border:1px solid #e2e8f0;border-radius:24px;background-color:#ffffff;color:#1e293b;">
<div style="text-align:center;margin-bottom:30px;">
<img src="{logo_url}" alt="CVisual Logo" style="width:70px;height:70px;border-radius:16px;margin-bottom:15px;">
<h2 style="color:#64748b;font-size:28px;font-weight:800;margin:0;">Candidature non retenue</h2>
<p style="color:#64748b;font-size:14px;margin-top:5px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">CVisual Agency</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Bonjour <b>{full_name}</b>,</p>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Nous vous remercions d'avoir soumis votre dossier de candidature pour rejoindre <b>CVisual Agency</b>. Apres etude attentive, nous n'avons pas pu retenir votre dossier pour les postes actuellement ouverts.</p>
<div style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:16px;margin-bottom:30px;">
<p style="font-size:14px;line-height:1.6;color:#475569;margin:0;">⚠️ <b>Note :</b> Sauf avis contraire, nous conservons votre dossier dans notre vivier de talents et n'hesiterons pas a vous recontacter si de nouveaux besoins correspondent a votre profil.</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Nous vous souhaitons beaucoup de reussite dans la suite de votre parcours.</p>
<hr style="border:0;border-top:1px solid #e2e8f0;margin:30px 0;">
<p style="font-size:14px;color:#64748b;line-height:1.5;margin:0;text-align:center;">Cordialement,<br><span style="font-size:16px;font-weight:700;color:#0f172a;">L'equipe RH - CVisual Agency</span><br><a href="mailto:cvisualht1@gmail.com" style="color:#3b82f6;">cvisualht1@gmail.com</a></p>
</div>$$
) ON CONFLICT (key) DO NOTHING;

-- 5. Accusé réception devis
INSERT INTO cvisual_email_templates (key, name, subject, variables, body)
VALUES (
    'devis_received',
    'Accuse de reception de Devis (Client)',
    'Demande de devis recue - CVisual Agency',
    'first_name, service, message, logo_url',
    $$<div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;border:1px solid #e2e8f0;border-radius:24px;background-color:#ffffff;color:#1e293b;">
<div style="text-align:center;margin-bottom:30px;">
<img src="{logo_url}" alt="CVisual Logo" style="width:70px;height:70px;border-radius:16px;margin-bottom:15px;">
<h2 style="color:#3b82f6;font-size:28px;font-weight:800;margin:0;">Demande Recue !</h2>
<p style="color:#64748b;font-size:14px;margin-top:5px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">CVisual Agency</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Bonjour <b>{first_name}</b>,</p>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Nous avons bien recu votre demande pour le service <b>{service}</b>. Un conseiller vous contactera sous 24h.</p>
<div style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:16px;margin-bottom:30px;">
<h4 style="margin:0 0 10px 0;font-size:14px;text-transform:uppercase;color:#64748b;">Votre message</h4>
<p style="font-size:14px;line-height:1.5;color:#334155;font-style:italic;margin:0;">"{message}"</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Nous sommes impatients de collaborer avec vous !</p>
<hr style="border:0;border-top:1px solid #e2e8f0;margin:30px 0;">
<p style="font-size:14px;color:#64748b;line-height:1.5;margin:0;text-align:center;">Cordialement,<br><span style="font-size:16px;font-weight:700;color:#0f172a;">L'equipe CVisual Agency</span><br><a href="mailto:cvisualht1@gmail.com" style="color:#3b82f6;">cvisualht1@gmail.com</a></p>
</div>$$
) ON CONFLICT (key) DO NOTHING;

-- 6. Bienvenue utilisateur
INSERT INTO cvisual_email_templates (key, name, subject, variables, body)
VALUES (
    'user_registered',
    'Bienvenue sur CVisual (Utilisateur)',
    'Bienvenue chez CVisual Agency !',
    'full_name, email, logo_url',
    $$<div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;border:1px solid #e2e8f0;border-radius:24px;background-color:#ffffff;color:#1e293b;">
<div style="text-align:center;margin-bottom:30px;">
<img src="{logo_url}" alt="CVisual Logo" style="width:70px;height:70px;border-radius:16px;margin-bottom:15px;">
<h2 style="color:#3b82f6;font-size:28px;font-weight:800;margin:0;">Bienvenue !</h2>
<p style="color:#64748b;font-size:14px;margin-top:5px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">CVisual Agency</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Bonjour <b>{full_name}</b>,</p>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Votre compte CVisual Agency a ete cree avec succes. Vous pouvez desormais vous connecter a votre espace client.</p>
<div style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:16px;margin-bottom:30px;">
<table style="width:100%;font-size:14px;">
<tr><td style="color:#64748b;width:120px;">Email :</td><td style="font-weight:600;">{email}</td></tr>
</table>
</div>
<hr style="border:0;border-top:1px solid #e2e8f0;margin:30px 0;">
<p style="font-size:14px;color:#64748b;line-height:1.5;margin:0;text-align:center;">Cordialement,<br><span style="font-size:16px;font-weight:700;color:#0f172a;">L'equipe CVisual Agency</span></p>
</div>$$
) ON CONFLICT (key) DO NOTHING;

-- 7. Alerte connexion
INSERT INTO cvisual_email_templates (key, name, subject, variables, body)
VALUES (
    'user_login',
    'Alerte de Connexion (Utilisateur)',
    'Nouvelle connexion detectee - CVisual Agency',
    'full_name, email, date, ip_address, logo_url',
    $$<div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;border:1px solid #e2e8f0;border-radius:24px;background-color:#ffffff;color:#1e293b;">
<div style="text-align:center;margin-bottom:30px;">
<img src="{logo_url}" alt="CVisual Logo" style="width:70px;height:70px;border-radius:16px;margin-bottom:15px;">
<h2 style="color:#f59e0b;font-size:28px;font-weight:800;margin:0;">Securite du compte</h2>
<p style="color:#64748b;font-size:14px;margin-top:5px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Nouvelle connexion</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Bonjour <b>{full_name}</b>,</p>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Une nouvelle connexion a ete detectee sur votre compte CVisual Agency.</p>
<div style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:16px;margin-bottom:30px;">
<table style="width:100%;font-size:14px;">
<tr><td style="color:#64748b;width:120px;">Email :</td><td style="font-weight:600;">{email}</td></tr>
<tr><td style="color:#64748b;">Date & Heure :</td><td style="font-weight:600;">{date}</td></tr>
<tr><td style="color:#64748b;">Adresse IP :</td><td style="font-weight:600;">{ip_address}</td></tr>
</table>
</div>
<p style="font-size:14px;color:#64748b;line-height:1.5;">Si vous etes a l'origine de cette connexion, ignorez cet email. Sinon, securisez votre compte immediatement.</p>
<hr style="border:0;border-top:1px solid #e2e8f0;margin:30px 0;">
<p style="font-size:14px;color:#64748b;line-height:1.5;margin:0;text-align:center;">Cordialement,<br><span style="font-size:16px;font-weight:700;color:#0f172a;">L'equipe Securite CVisual</span></p>
</div>$$
) ON CONFLICT (key) DO NOTHING;

-- 8. Diffusion générale (broadcast)
INSERT INTO cvisual_email_templates (key, name, subject, variables, body)
VALUES (
    'broadcast',
    'Imel General (Diffusion)',
    'Message Important - CVisual Agency',
    'full_name, message, logo_url',
    $$<div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;border:1px solid #e2e8f0;border-radius:24px;background-color:#ffffff;color:#1e293b;">
<div style="text-align:center;margin-bottom:30px;">
<img src="{logo_url}" alt="CVisual Logo" style="width:70px;height:70px;border-radius:16px;margin-bottom:15px;">
<h2 style="color:#3b82f6;font-size:28px;font-weight:800;margin:0;">Annonce Importante</h2>
<p style="color:#64748b;font-size:14px;margin-top:5px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">CVisual Agency</p>
</div>
<p style="font-size:16px;line-height:1.6;margin-bottom:20px;">Bonjour <b>{full_name}</b>,</p>
<div style="font-size:16px;line-height:1.7;color:#334155;margin-bottom:30px;white-space:pre-wrap;">{message}</div>
<hr style="border:0;border-top:1px solid #e2e8f0;margin:30px 0;">
<p style="font-size:14px;color:#64748b;line-height:1.5;margin:0;text-align:center;">Cordialement,<br><span style="font-size:16px;font-weight:700;color:#0f172a;">L'equipe CVisual Agency</span></p>
</div>$$
) ON CONFLICT (key) DO NOTHING;

-- -----------------------------------------------
-- ADMIN PAR DÉFAUT
-- ⚠️  CHANGER LE MOT DE PASSE IMMÉDIATEMENT !
-- Le hash ci-dessous correspond à "admin123"
-- (généré avec bcrypt rounds=12)
-- -----------------------------------------------
INSERT INTO cvisual_admins (username, password)
VALUES (
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGpwdnxIQmR5gJkXa8Z1K9pV6Zy'
)
ON CONFLICT (username) DO NOTHING;

-- -----------------------------------------------
-- RECRUITMENT INFO PAR DÉFAUT
-- -----------------------------------------------
INSERT INTO cvisual_recruitment_info (job_title, job_details, is_active)
VALUES ('Poste a pourvoir', 'Rejoignez notre equipe créative.', TRUE)
ON CONFLICT DO NOTHING;
