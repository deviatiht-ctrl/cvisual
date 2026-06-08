-- =============================================================
-- CVISUAL SUPABASE SCHEMA  |  02_rls.sql
-- Row Level Security (RLS) — sécurité par ligne
-- Exécuter APRÈS 01_tables.sql
--
-- Logique :
--   • anon  → peut lire le contenu public + soumettre des formulaires
--   • Les opérations admin utilisent la service_role key (dans les
--     Edge Functions), qui court-circuite le RLS automatiquement.
-- =============================================================

-- -----------------------------------------------
-- ACTIVER RLS SUR TOUTES LES TABLES
-- -----------------------------------------------
ALTER TABLE cvisual_admins             ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_news               ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_clients            ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_newsletter         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_recruitment_info   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_recruitment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_applications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_inquiries          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_chat_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_visitors           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_email_templates    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_settings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_blog               ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_testimonials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvisual_team               ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------
-- LECTURE PUBLIQUE (anon peut lire)
-- -----------------------------------------------
CREATE POLICY "cvisual_anon_read_services"
    ON cvisual_services FOR SELECT TO anon USING (true);

CREATE POLICY "cvisual_anon_read_projects"
    ON cvisual_projects FOR SELECT TO anon USING (true);

CREATE POLICY "cvisual_anon_read_news"
    ON cvisual_news FOR SELECT TO anon USING (true);

CREATE POLICY "cvisual_anon_read_clients"
    ON cvisual_clients FOR SELECT TO anon USING (true);

CREATE POLICY "cvisual_anon_read_blog"
    ON cvisual_blog FOR SELECT TO anon USING (published = true);

CREATE POLICY "cvisual_anon_read_testimonials"
    ON cvisual_testimonials FOR SELECT TO anon USING (true);

CREATE POLICY "cvisual_anon_read_team"
    ON cvisual_team FOR SELECT TO anon USING (true);

CREATE POLICY "cvisual_anon_read_recruitment_info"
    ON cvisual_recruitment_info FOR SELECT TO anon USING (true);

CREATE POLICY "cvisual_anon_read_questions"
    ON cvisual_recruitment_questions FOR SELECT TO anon USING (true);

-- -----------------------------------------------
-- SOUMISSION PUBLIQUE (anon peut insérer dans les formulaires)
-- -----------------------------------------------
CREATE POLICY "cvisual_anon_insert_newsletter"
    ON cvisual_newsletter FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "cvisual_anon_insert_inquiries"
    ON cvisual_inquiries FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "cvisual_anon_insert_applications"
    ON cvisual_applications FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "cvisual_anon_insert_visitors"
    ON cvisual_visitors FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "cvisual_anon_insert_chat"
    ON cvisual_chat_messages FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "cvisual_anon_read_chat"
    ON cvisual_chat_messages FOR SELECT TO anon
    USING (true);  -- visitor_id filtrage géré côté client

CREATE POLICY "cvisual_anon_insert_users"
    ON cvisual_users FOR INSERT TO anon WITH CHECK (true);

-- -----------------------------------------------
-- TABLES STRICTEMENT PRIVÉES (aucun accès anon)
-- → Seule la service_role key y accède (Edge Functions)
-- -----------------------------------------------
-- cvisual_admins          : aucune policy anon → accès refusé
-- cvisual_email_templates : aucune policy anon → accès refusé
-- cvisual_settings        : aucune policy anon → accès refusé
-- cvisual_applications    : lecture admin seulement
-- cvisual_inquiries       : lecture admin seulement (insertion ouverte ci-dessus)
-- cvisual_newsletter      : lecture admin seulement (insertion ouverte ci-dessus)
-- cvisual_visitors        : lecture admin seulement
-- cvisual_users           : lecture admin seulement

-- -----------------------------------------------
-- ACCÈS ADMIN COMPLET (utilisateur authentifié Supabase Auth)
-- L'admin se connecte via supabase.auth.signInWithPassword()
-- et peut ensuite lire/écrire dans toutes les tables.
-- -----------------------------------------------
CREATE POLICY "cvisual_auth_all_admins"
    ON cvisual_admins FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_users"
    ON cvisual_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_applications"
    ON cvisual_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_inquiries"
    ON cvisual_inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_newsletter"
    ON cvisual_newsletter FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_visitors"
    ON cvisual_visitors FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_chat"
    ON cvisual_chat_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_templates"
    ON cvisual_email_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_settings"
    ON cvisual_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_services"
    ON cvisual_services FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_projects"
    ON cvisual_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_news"
    ON cvisual_news FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_clients"
    ON cvisual_clients FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_blog"
    ON cvisual_blog FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_testimonials"
    ON cvisual_testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_team"
    ON cvisual_team FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_recruitment_info"
    ON cvisual_recruitment_info FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cvisual_auth_all_questions"
    ON cvisual_recruitment_questions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Note : service_role bypass RLS. Les Edge Functions admin
-- utilisent la clé service_role et contournent ces politiques.
