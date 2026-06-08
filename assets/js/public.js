/**
 * CVisual Public API Client — Supabase Edition
 * Toutes les données viennent directement de Supabase.
 */

/* Config — chargée depuis supabase-config.js si disponible, sinon fallback */
const SUPABASE_URL       = window.SUPABASE_URL      || 'https://VOTRE_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY  = window.SUPABASE_ANON_KEY || 'VOTRE_ANON_KEY_ICI';
const SUPABASE_EDGE_BASE = `${SUPABASE_URL}/functions/v1`;

/* Chargement automatique du SDK Supabase depuis CDN */
const _sbReady = new Promise(resolve => {
    const init = () => {
        const c = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: { persistSession: true, autoRefreshToken: true, storageKey: 'cv_sb_session' }
        });
        window._sb = c;
        resolve(c);
    };
    if (window.supabase?.createClient) {
        init();
    } else {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        s.onload = init;
        document.head.appendChild(s);
    }
});

// ── Helpers ────────────────────────────────────────────────

function _fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function _callEdge(path, body) {
    const res = await fetch(`${SUPABASE_EDGE_BASE}/${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(body)
    });
    return res.json().catch(() => ({}));
}

// ── CVisual public object ───────────────────────────────────

const CVisual = {

    async fetchServices() {
        try {
            this.showLoader();
            const sb = await _sbReady;
            const { data, error } = await sb.from('cvisual_services').select('*').order('sort_order');
            this.hideLoader();
            if (error) throw error;
            return data.length ? data : this._fallbackServices();
        } catch (e) {
            this.hideLoader();
            console.error('fetchServices:', e);
            return this._fallbackServices();
        }
    },

    async fetchPortfolio() {
        try {
            this.showLoader();
            const sb = await _sbReady;
            const { data, error } = await sb.from('cvisual_projects').select('*').order('sort_order');
            this.hideLoader();
            if (error) throw error;
            return data.length ? data : this._fallbackPortfolio();
        } catch (e) {
            this.hideLoader();
            console.error('fetchPortfolio:', e);
            return this._fallbackPortfolio();
        }
    },

    async fetchNews() {
        try {
            const sb = await _sbReady;
            const { data, error } = await sb.from('cvisual_news').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return (data || []).map(n => ({ ...n, date: _fmtDate(n.created_at) }));
        } catch (e) {
            console.error('fetchNews:', e);
            return this._fallbackNews();
        }
    },

    async fetchClients() {
        try {
            const sb = await _sbReady;
            const { data, error } = await sb.from('cvisual_clients').select('*').order('sort_order');
            if (error) throw error;
            return data.length ? data : this._fallbackClients();
        } catch (e) {
            console.error('fetchClients:', e);
            return this._fallbackClients();
        }
    },

    async fetchBlog() {
        try {
            this.showLoader();
            const sb = await _sbReady;
            const { data, error } = await sb.from('cvisual_blog').select('*').eq('published', true).order('created_at', { ascending: false });
            this.hideLoader();
            if (error) throw error;
            return (data || []).map(b => ({ ...b, date: _fmtDate(b.created_at) }));
        } catch (e) {
            this.hideLoader();
            console.error('fetchBlog:', e);
            return [{ id: 1, title: "L'essor du digital en Haïti en 2026", content: "Analyse des nouvelles tendances.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800", date: "12 Mai 2026" }];
        }
    },

    async fetchStats() {
        try {
            const sb = await _sbReady;
            const [{ count: projects }, { count: clients }] = await Promise.all([
                sb.from('cvisual_projects').select('*', { count: 'exact', head: true }),
                sb.from('cvisual_clients').select('*', { count: 'exact', head: true })
            ]);
            return { projects: projects || 0, clients: clients || 0, experience: 5, satisfaction: 99 };
        } catch (e) {
            console.error('fetchStats:', e);
            return { projects: '150+', clients: '50+', experience: 5, satisfaction: 99 };
        }
    },

    async fetchTestimonials() {
        try {
            const sb = await _sbReady;
            const { data, error } = await sb.from('cvisual_testimonials').select('*').order('sort_order');
            if (error) throw error;
            return data.length ? data : this._fallbackTestimonials();
        } catch (e) {
            console.error('fetchTestimonials:', e);
            return this._fallbackTestimonials();
        }
    },

    async fetchTeam() {
        try {
            const sb = await _sbReady;
            const { data, error } = await sb.from('cvisual_team').select('*').order('sort_order');
            if (error) throw error;
            return data.length ? data : this._fallbackTeam();
        } catch (e) {
            console.error('fetchTeam:', e);
            return this._fallbackTeam();
        }
    },

    async fetchRecruitmentInfo() {
        try {
            const sb = await _sbReady;
            const { data } = await sb.from('cvisual_recruitment_info').select('*').limit(1).single();
            return data || { job_title: '', job_details: '', is_active: true };
        } catch (e) {
            console.error('fetchRecruitmentInfo:', e);
            return { job_title: '', job_details: '', is_active: true };
        }
    },

    async fetchQuestions() {
        try {
            const sb = await _sbReady;
            const { data } = await sb.from('cvisual_recruitment_questions').select('*').order('sort_order');
            return data || [];
        } catch (e) {
            console.error('fetchQuestions:', e);
            return [];
        }
    },

    async checkAuth() {
        const sb = await _sbReady;
        const { data: { session } } = await sb.auth.getSession();
        return session;
    },

    isAdmin(session) {
        return !!(session && session.user?.app_metadata?.role === 'admin');
    },

    async logout() {
        const sb = await _sbReady;
        await sb.auth.signOut();
    },

    async submitContact(data) {
        try {
            const sb = await _sbReady;
            const { data: { session } } = await sb.auth.getSession();
            if (!session) return { requireAuth: true };
            this.showLoader();
            const { error } = await sb.from('cvisual_inquiries').insert({
                first_name: data.firstName,
                last_name:  data.lastName,
                email:      data.email,
                service:    data.service,
                message:    data.message
            });
            this.hideLoader();
            if (error) return { error: error.message };
            _callEdge('send-email', { template_key: 'devis_received', to_email: data.email, context: { first_name: data.firstName, service: data.service, message: data.message } });
            return { success: true };
        } catch (e) {
            this.hideLoader();
            console.error('submitContact:', e);
            return { error: 'Network error' };
        }
    },

    async subscribeNewsletter(email) {
        try {
            this.showLoader();
            const sb = await _sbReady;
            const { error } = await sb.from('cvisual_newsletter').insert({ email });
            this.hideLoader();
            if (error) {
                if (error.code === '23505') return { error: 'Cet email est déjà inscrit.' };
                return { error: error.message };
            }
            return { success: true };
        } catch (e) {
            this.hideLoader();
            console.error('subscribeNewsletter:', e);
            return { error: 'Network error' };
        }
    },

    async submitApplication(data) {
        try {
            this.showLoader();
            const sb = await _sbReady;
            const { error } = await sb.from('cvisual_applications').insert({
                full_name:   data.fullName,
                email:       data.email,
                whatsapp:    data.whatsapp,
                tiktok:      data.tiktok,
                cv_link:     data.cvLink,
                cv_filename: data.cvFilename,
                motivation:  data.motivation,
                answers:     data.answers
            });
            this.hideLoader();
            if (error) return { error: error.message };
            _callEdge('send-email', { template_key: 'candidature_received', to_email: data.email, context: { full_name: data.fullName, whatsapp: data.whatsapp || 'Non renseigné', tiktok: data.tiktok || 'Non renseigné' } });
            return { success: true };
        } catch (e) {
            this.hideLoader();
            console.error('submitApplication:', e);
            return { error: 'Network error' };
        }
    },

    async trackVisit() {
        try {
            const sb = await _sbReady;
            await sb.from('cvisual_visitors').insert({ user_agent: navigator.userAgent, page: window.location.pathname });
        } catch (_) {}
    },

    getImageUrl(path) {
        if (!path) return '';
        return path;
    },

    // ── Loader ───────────────────────────────────────────────

    showLoader() {
        if (!document.getElementById('global-loader')) {
            const loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.innerHTML = `<div class="loader-overlay"><div class="loader-spinner"></div></div>`;
            document.body.appendChild(loader);
            if (!document.getElementById('loader-styles')) {
                const style = document.createElement('style');
                style.id = 'loader-styles';
                style.textContent = `.loader-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity .3s ease}.loader-spinner{width:48px;height:48px;border:5px solid #3b82f6;border-bottom-color:transparent;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`;
                document.head.appendChild(style);
            }
        }
        setTimeout(() => { const o = document.querySelector('.loader-overlay'); if (o) o.style.opacity = '1'; }, 10);
    },

    hideLoader() {
        const o = document.querySelector('.loader-overlay');
        if (o) { o.style.opacity = '0'; setTimeout(() => { o.remove(); const c = document.getElementById('global-loader'); if (c) c.remove(); }, 300); }
    },

    // ── Fallbacks ────────────────────────────────────────────

    _fallbackServices() {
        return [
            { id:1, title:"Développement Web", description:"Création de sites internet vitrines et e-commerce sur-mesure.", icon:"globe", image:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800", price:"45,000 HTG", delay:"15 jours" },
            { id:2, title:"Photographie & Vidéo", description:"Captation d'images de haute qualité pour valoriser votre marque.", icon:"camera", image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800", price:"25,000 HTG", delay:"5 jours" },
            { id:3, title:"Gestion Communautaire", description:"Animation et croissance de vos réseaux sociaux.", icon:"message-square", image:"https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800", price:"30,000 HTG", delay:"Mensuel" },
            { id:4, title:"Design Graphique & Branding", description:"Conception de logos et d'identités visuelles uniques.", icon:"palette", image:"https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800", price:"20,000 HTG", delay:"7 jours" }
        ];
    },

    _fallbackPortfolio() {
        return [
            { id:1, title:"E-Commerce Boutique Élégance", category:"Web Development", main_image:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800", challenge:"Créer une plateforme e-commerce rapide.", solution:"Développement sur-mesure.", live_link:"#" },
            { id:2, title:"Branding Saveurs Créoles", category:"Design Graphique", main_image:"https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800", challenge:"Refondre l'identité visuelle.", solution:"Création d'un logo moderne.", live_link:"#" },
            { id:3, title:"Campagne Lumina Studio", category:"Gestion Communautaire", main_image:"https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800", challenge:"Propulser l'engagement sur les réseaux.", solution:"Contenus vidéos à fort impact.", live_link:"#" }
        ];
    },

    _fallbackNews() {
        return [
            { id:1, title:"CVisual recrute de nouveaux talents créatifs !", content:"Nous recherchons des designers et développeurs passionnés.", type:"recrutement", image:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800", date:"15 Mai 2026" },
            { id:2, title:"L'importance du design responsive", content:"Pourquoi adapter votre site aux formats mobiles est indispensable.", type:"actualite", image:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800", date:"10 Mai 2026" }
        ];
    },

    _fallbackClients() {
        return [
            { id:1, name:"Jeeko", logo:"assets/jeeko.jpg" },
            { id:2, name:"Madjicks", logo:"assets/madjicks (1).jpeg" },
            { id:3, name:"Senteur Douceur", logo:"assets/senteur douceur (1).jpeg" },
            { id:4, name:"Jim Smart", logo:"assets/jim smart 509 (1).jpeg" }
        ];
    },

    _fallbackTestimonials() {
        return [
            { content:"CVisual a transformé notre présence en ligne. Ventes +250% en 6 mois.", name:"Jean-Baptiste Moreau", company:"Boutique Élégance", avatar:null },
            { content:"Photos réalisées par CVisual → engagement Instagram x3.", name:"Marie-Claire Joseph", company:"Saveurs Créoles", avatar:null },
            { content:"5 000 nouveaux abonnés en 3 mois grâce à CVisual.", name:"Pierre-Louis Desrosiers", company:"TechHaiti Solutions", avatar:null }
        ];
    },

    _fallbackTeam() {
        return [
            { id:1, name:"Marc-Arthur Jean", role:"Directeur Artistique & Fondateur", avatar:null },
            { id:2, name:"Vanessa Pierre", role:"Lead Web Developer", avatar:null },
            { id:3, name:"Jean-Paul Charles", role:"Social Media Manager", avatar:null }
        ];
    }
};
