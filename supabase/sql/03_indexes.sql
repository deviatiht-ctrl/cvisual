-- =============================================================
-- CVISUAL SUPABASE SCHEMA  |  03_indexes.sql
-- Index de performance
-- Exécuter APRÈS 01_tables.sql
-- =============================================================

-- News : tri chronologique inversé (le plus récent en premier)
CREATE INDEX IF NOT EXISTS idx_cvisual_news_created
    ON cvisual_news (created_at DESC);

-- Applications : filtre par statut + tri date
CREATE INDEX IF NOT EXISTS idx_cvisual_applications_status
    ON cvisual_applications (status);
CREATE INDEX IF NOT EXISTS idx_cvisual_applications_created
    ON cvisual_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cvisual_applications_email
    ON cvisual_applications (email);

-- Inquiries : filtre par statut + tri date
CREATE INDEX IF NOT EXISTS idx_cvisual_inquiries_status
    ON cvisual_inquiries (status);
CREATE INDEX IF NOT EXISTS idx_cvisual_inquiries_created
    ON cvisual_inquiries (created_at DESC);

-- Chat : regroupement par visitor_id
CREATE INDEX IF NOT EXISTS idx_cvisual_chat_visitor
    ON cvisual_chat_messages (visitor_id);
CREATE INDEX IF NOT EXISTS idx_cvisual_chat_created
    ON cvisual_chat_messages (created_at ASC);
CREATE INDEX IF NOT EXISTS idx_cvisual_chat_unread
    ON cvisual_chat_messages (is_read) WHERE is_read = FALSE;

-- Visitors : tri par date
CREATE INDEX IF NOT EXISTS idx_cvisual_visitors_time
    ON cvisual_visitors (visited_at DESC);

-- Newsletter : unicité email déjà gérée par UNIQUE, index supplémentaire inutile

-- Settings et Templates : clé de lookup
CREATE INDEX IF NOT EXISTS idx_cvisual_settings_key
    ON cvisual_settings (key);
CREATE INDEX IF NOT EXISTS idx_cvisual_email_templates_key
    ON cvisual_email_templates (key);

-- Blog : tri date + filtre published
CREATE INDEX IF NOT EXISTS idx_cvisual_blog_published
    ON cvisual_blog (published, created_at DESC);

-- Projets et services : tri par sort_order
CREATE INDEX IF NOT EXISTS idx_cvisual_services_order
    ON cvisual_services (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_cvisual_projects_order
    ON cvisual_projects (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_cvisual_testimonials_order
    ON cvisual_testimonials (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_cvisual_team_order
    ON cvisual_team (sort_order ASC);
