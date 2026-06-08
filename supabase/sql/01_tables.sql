-- =============================================================
-- CVISUAL SUPABASE SCHEMA  |  01_tables.sql
-- Toutes les tables sont préfixées par "cvisual_"
-- pour coexister avec d'autres projets sur le même Supabase.
-- Exécuter ce fichier EN PREMIER dans le SQL Editor de Supabase.
-- =============================================================

-- -----------------------------------------------
-- 1. ADMINS  (login dashboard admin)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_admins (
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(80)  UNIQUE NOT NULL,
    password   TEXT         NOT NULL,  -- bcrypt hash
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- -----------------------------------------------
-- 2. USERS  (utilisateurs publics inscrits)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_users (
    id           SERIAL PRIMARY KEY,
    full_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(100) UNIQUE NOT NULL,
    password     TEXT         NOT NULL,  -- bcrypt hash
    company_name VARCHAR(100),
    is_company   BOOLEAN      DEFAULT FALSE,
    created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- -----------------------------------------------
-- 3. SERVICES
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_services (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    description TEXT,
    icon        VARCHAR(50),
    image       TEXT,            -- base64 ou URL
    price       VARCHAR(100),
    delay       VARCHAR(100),
    features    TEXT,            -- ex: "Logo,Charte,Carte de visite"
    sort_order  INTEGER DEFAULT 0
);

-- -----------------------------------------------
-- 4. PROJECTS  (portfolio)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_projects (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    category    VARCHAR(50)  NOT NULL,
    main_image  TEXT,            -- base64 ou URL
    challenge   TEXT,
    solution    TEXT,
    live_link   VARCHAR(255),
    sort_order  INTEGER DEFAULT 0
);

-- -----------------------------------------------
-- 5. NEWS  (actualités & offres d'emploi)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_news (
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    content    TEXT         NOT NULL,
    type       VARCHAR(50)  DEFAULT 'actualite',  -- 'actualite' | 'recrutement'
    image      TEXT,
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- -----------------------------------------------
-- 6. CLIENTS  (logos partenaires)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_clients (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    logo       TEXT,            -- base64 ou URL
    sort_order INTEGER DEFAULT 0
);

-- -----------------------------------------------
-- 7. NEWSLETTER  (abonnés)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_newsletter (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(120) UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 8. RECRUITMENT_INFO  (config du poste actif)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_recruitment_info (
    id          SERIAL PRIMARY KEY,
    job_title   VARCHAR(200) NOT NULL DEFAULT 'Poste à pourvoir',
    job_details TEXT,
    is_active   BOOLEAN     DEFAULT TRUE,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 9. RECRUITMENT_QUESTIONS  (formulaire dynamique)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_recruitment_questions (
    id         SERIAL PRIMARY KEY,
    question   VARCHAR(255) NOT NULL,
    type       VARCHAR(50)  DEFAULT 'text',   -- 'text' | 'select' | 'textarea'
    options    TEXT,        -- JSON : '["Option A","Option B"]'
    required   BOOLEAN      DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- -----------------------------------------------
-- 10. APPLICATIONS  (candidatures recrutement)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_applications (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES cvisual_users(id) ON DELETE SET NULL,
    full_name   VARCHAR(100),
    email       VARCHAR(100),
    whatsapp    VARCHAR(50),
    tiktok      VARCHAR(100),
    cv_filename VARCHAR(255),
    cv_link     VARCHAR(255),
    motivation  TEXT,
    answers     TEXT,        -- JSON stringifié
    status      VARCHAR(20)  DEFAULT 'pending'
                             CHECK (status IN ('pending','accepted','interview','rejected')),
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- -----------------------------------------------
-- 11. INQUIRIES  (demandes de devis / contact)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_inquiries (
    id         SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name  VARCHAR(50),
    email      VARCHAR(100),
    service    VARCHAR(100),
    message    TEXT,
    status     VARCHAR(20)  DEFAULT 'pending'
                            CHECK (status IN ('pending','read','replied','closed')),
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- -----------------------------------------------
-- 12. CHAT_MESSAGES  (support live chat)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_chat_messages (
    id         SERIAL PRIMARY KEY,
    visitor_id VARCHAR(100),   -- session ID ou IP
    sender     VARCHAR(50),    -- 'visitor' | 'admin'
    message    TEXT         NOT NULL,
    is_read    BOOLEAN      DEFAULT FALSE,
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- -----------------------------------------------
-- 13. VISITORS  (tracking visites)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_visitors (
    id         SERIAL PRIMARY KEY,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 14. EMAIL_TEMPLATES  (modèles d'emails)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_email_templates (
    id         SERIAL PRIMARY KEY,
    key        VARCHAR(50)  UNIQUE NOT NULL,
    name       VARCHAR(100) NOT NULL,
    subject    VARCHAR(200) NOT NULL,
    body       TEXT         NOT NULL,
    variables  VARCHAR(255),   -- ex: "full_name, email, logo_url"
    updated_at TIMESTAMPTZ  DEFAULT NOW()
);

-- -----------------------------------------------
-- 15. SETTINGS  (paramètres globaux)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_settings (
    id         SERIAL PRIMARY KEY,
    key        VARCHAR(50) UNIQUE NOT NULL,
    value      TEXT        NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 16. BLOG  (articles de blog — absent du backend Python)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_blog (
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    content    TEXT         NOT NULL,
    image      TEXT,
    author     VARCHAR(100),
    tags       TEXT,        -- ex: "design,web,branding"
    published  BOOLEAN      DEFAULT TRUE,
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- -----------------------------------------------
-- 17. TESTIMONIALS  (témoignages — absent du backend Python)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_testimonials (
    id         SERIAL PRIMARY KEY,
    content    TEXT         NOT NULL,
    name       VARCHAR(100),
    company    VARCHAR(100),
    avatar     TEXT,
    sort_order INTEGER DEFAULT 0
);

-- -----------------------------------------------
-- 18. TEAM  (membres de l'équipe — absent du backend Python)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS cvisual_team (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    role       VARCHAR(100),
    avatar     TEXT,
    sort_order INTEGER DEFAULT 0
);
