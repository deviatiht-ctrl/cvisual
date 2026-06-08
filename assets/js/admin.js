/**
 * CVisual Admin — Supabase Edition
 * Remplace entièrement le backend Python.
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

// ── Date helpers ──────────────────────────────────────────────────────────────

function _fmtD(iso)  { if (!iso) return ''; return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }); }
function _fmtDT(iso) { if (!iso) return ''; return new Date(iso).toLocaleString('fr-FR',  { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }

// ── Edge Function helper (email) ──────────────────────────────────────────────

async function _edgeCall(path, payload) {
    try {
        const sb = await _sbReady;
        const { data: { session } } = await sb.auth.getSession();
        const token = session?.access_token || SUPABASE_ANON_KEY;
        const res = await fetch(`${SUPABASE_EDGE_BASE}/${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        return res.json().catch(() => ({}));
    } catch (e) {
        return { error: String(e) };
    }
}

// ── AdminApp ──────────────────────────────────────────────────────────────────

const AdminApp = {

    // ── Auth ─────────────────────────────────────────────────────────────────

    isAuthenticated() {
        try {
            const raw = localStorage.getItem('cv_sb_session');
            if (!raw) return false;
            const s = JSON.parse(raw);
            if (!s?.access_token) return false;
            if (s.expires_at && s.expires_at < Math.floor(Date.now() / 1000)) return false;
            const role = s.user?.app_metadata?.role || s.user?.user_metadata?.role;
            return role === 'admin';
        } catch { return false; }
    },

    getToken() {
        try {
            const raw = localStorage.getItem('cv_sb_session');
            return raw ? (JSON.parse(raw)?.access_token || null) : null;
        } catch { return null; }
    },

    setToken(t) { /* géré automatiquement par Supabase Auth */ },

    async logout() {
        try { const sb = await _sbReady; await sb.auth.signOut(); } catch {}
        localStorage.removeItem('cv_sb_session');
        window.location.href = 'login.html';
    },

    getImageUrl(path) {
        if (!path) return '';
        return path;
    },

    // ── Main request router ───────────────────────────────────────────────────

    async request(endpoint, options = {}) {
        const method = (options.method || 'GET').toUpperCase();
        let body = null;
        if (options.body) {
            try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body; }
            catch { body = {}; }
        }

        this.showLoader();
        try {
            const sb = await _sbReady;
            if (endpoint.startsWith('/admin/')) {
                const { data: { session } } = await sb.auth.getSession();
                if (!session) { this.hideLoader(); this.logout(); return { error: 'Session expirée' }; }
            }
            const result = await this._route(sb, endpoint, method, body);
            this.hideLoader();
            return result;
        } catch (e) {
            this.hideLoader();
            console.error('[AdminApp]', endpoint, e);
            return { error: e?.message || 'Erreur inattendue' };
        }
    },

    async _route(sb, ep, method, body) {
        let m;

        // ── Services ──────────────────────────────────────────────────────────
        if ((m = ep.match(/^\/admin\/services(?:\/(\d+))?$/))) {
            const id = m[1];
            if (method === 'POST')   { const { error } = await sb.from('cvisual_services').insert(body); return error ? { error: error.message } : { success: true }; }
            if (method === 'PUT')    { const { error } = await sb.from('cvisual_services').update(body).eq('id', id); return error ? { error: error.message } : { success: true }; }
            if (method === 'DELETE') { const { error } = await sb.from('cvisual_services').delete().eq('id', id); return error ? { error: error.message } : { success: true }; }
        }

        // ── Portfolio ─────────────────────────────────────────────────────────
        if ((m = ep.match(/^\/admin\/portfolio(?:\/(\d+))?$/))) {
            const id = m[1];
            if (method === 'POST')   { const { error } = await sb.from('cvisual_projects').insert(body); return error ? { error: error.message } : { success: true }; }
            if (method === 'PUT')    { const { error } = await sb.from('cvisual_projects').update(body).eq('id', id); return error ? { error: error.message } : { success: true }; }
            if (method === 'DELETE') { const { error } = await sb.from('cvisual_projects').delete().eq('id', id); return error ? { error: error.message } : { success: true }; }
        }

        // ── News ──────────────────────────────────────────────────────────────
        if ((m = ep.match(/^\/admin\/news(?:\/(\d+))?$/))) {
            const id = m[1];
            if (method === 'POST')   { const { error } = await sb.from('cvisual_news').insert(body); return error ? { error: error.message } : { success: true }; }
            if (method === 'PUT')    { const { error } = await sb.from('cvisual_news').update(body).eq('id', id); return error ? { error: error.message } : { success: true }; }
            if (method === 'DELETE') { const { error } = await sb.from('cvisual_news').delete().eq('id', id); return error ? { error: error.message } : { success: true }; }
        }

        // ── Clients ───────────────────────────────────────────────────────────
        if ((m = ep.match(/^\/admin\/clients(?:\/(\d+))?$/))) {
            const id = m[1];
            if (method === 'GET')    { const { data, error } = await sb.from('cvisual_clients').select('*').order('id'); if (error) return { error: error.message }; return data || []; }
            if (method === 'POST')   { const { error } = await sb.from('cvisual_clients').insert(body); return error ? { error: error.message } : { success: true }; }
            if (method === 'DELETE') { const { error } = await sb.from('cvisual_clients').delete().eq('id', id); return error ? { error: error.message } : { success: true }; }
        }

        // ── Applications ──────────────────────────────────────────────────────
        if (ep === '/admin/applications' && method === 'GET') {
            const { data, error } = await sb.from('cvisual_applications').select('id, full_name, email, status, created_at').order('created_at', { ascending: false });
            if (error) return { error: error.message };
            return (data || []).map(a => ({ ...a, date: _fmtD(a.created_at) }));
        }
        if ((m = ep.match(/^\/admin\/applications\/(\d+)$/)) && method === 'GET') {
            const { data, error } = await sb.from('cvisual_applications').select('*').eq('id', m[1]).single();
            if (error) return { error: error.message };
            return { ...data, date: _fmtDT(data.created_at) };
        }
        if ((m = ep.match(/^\/admin\/applications\/(\d+)\/status$/)) && method === 'PUT') {
            const id = m[1];
            const { data: app } = await sb.from('cvisual_applications').select('email, full_name, whatsapp').eq('id', id).single();
            const { error } = await sb.from('cvisual_applications').update({ status: body?.status }).eq('id', id);
            if (error) return { error: error.message };
            const tpl = { accepted: 'candidature_accepted', interview: 'candidature_interview', rejected: 'candidature_rejected' }[body?.status];
            if (tpl && app?.email) {
                _edgeCall('send-email', { template_key: tpl, to_email: app.email, context: { full_name: app.full_name || 'Candidat', whatsapp: app.whatsapp || 'Non renseigné' } });
            }
            return { success: true };
        }

        // ── Inquiries ─────────────────────────────────────────────────────────
        if (ep === '/admin/inquiries' && method === 'GET') {
            const { data, error } = await sb.from('cvisual_inquiries').select('*').order('created_at', { ascending: false });
            if (error) return { error: error.message };
            return (data || []).map(i => ({ ...i, date: _fmtD(i.created_at) }));
        }
        if ((m = ep.match(/^\/admin\/inquiries\/(\d+)$/))) {
            const id = m[1];
            if (method === 'GET')    { const { data, e } = await sb.from('cvisual_inquiries').select('*').eq('id', id).single(); return e ? { error: e.message } : { ...data, date: _fmtDT(data?.created_at) }; }
            if (method === 'PUT')    { const { error } = await sb.from('cvisual_inquiries').update({ status: body?.status }).eq('id', id); return error ? { error: error.message } : { success: true }; }
            if (method === 'DELETE') { const { error } = await sb.from('cvisual_inquiries').delete().eq('id', id); return error ? { error: error.message } : { success: true }; }
        }

        // ── Newsletter ────────────────────────────────────────────────────────
        if (ep === '/admin/newsletter' && method === 'GET') {
            const { data, error } = await sb.from('cvisual_newsletter').select('*').order('subscribed_at', { ascending: false });
            if (error) return { error: error.message };
            return (data || []).map(n => ({ ...n, date: _fmtD(n.subscribed_at) }));
        }

        // ── Stats ─────────────────────────────────────────────────────────────
        if (ep === '/admin/stats' && method === 'GET') {
            const [{ count: visitors }, { count: applications }, { count: news }, { count: newsletter }] = await Promise.all([
                sb.from('cvisual_visitors').select('*', { count: 'exact', head: true }),
                sb.from('cvisual_applications').select('*', { count: 'exact', head: true }),
                sb.from('cvisual_news').select('*', { count: 'exact', head: true }),
                sb.from('cvisual_newsletter').select('*', { count: 'exact', head: true })
            ]);
            return { visitors: visitors || 0, applications: applications || 0, news: news || 0, newsletter: newsletter || 0 };
        }

        // ── Recruitment info ──────────────────────────────────────────────────
        if (ep === '/admin/recruitment/info') {
            if (method === 'GET') {
                const { data } = await sb.from('cvisual_recruitment_info').select('*').limit(1).single();
                return data || { job_title: '', job_details: '', is_active: true };
            }
            if (method === 'POST') {
                const { data: ex } = await sb.from('cvisual_recruitment_info').select('id').limit(1).single();
                if (ex) { const { error } = await sb.from('cvisual_recruitment_info').update({ job_title: body.job_title, job_details: body.job_details }).eq('id', ex.id); return error ? { error: error.message } : { success: true }; }
                const { error } = await sb.from('cvisual_recruitment_info').insert({ job_title: body.job_title, job_details: body.job_details });
                return error ? { error: error.message } : { success: true };
            }
        }

        // ── Recruitment toggle ────────────────────────────────────────────────
        if (ep === '/admin/recruitment/toggle' && method === 'POST') {
            const { data: ex } = await sb.from('cvisual_recruitment_info').select('id, is_active').limit(1).single();
            if (ex) { const { error } = await sb.from('cvisual_recruitment_info').update({ is_active: !ex.is_active }).eq('id', ex.id); return error ? { error: error.message } : { success: true }; }
            return { success: true };
        }

        // ── Recruitment questions ─────────────────────────────────────────────
        if ((m = ep.match(/^\/admin\/recruitment\/questions(?:\/(\d+))?$/))) {
            const id = m[1];
            if (method === 'POST')   { const { error } = await sb.from('cvisual_recruitment_questions').insert(body); return error ? { error: error.message } : { success: true }; }
            if (method === 'PUT')    { const { error } = await sb.from('cvisual_recruitment_questions').update(body).eq('id', id); return error ? { error: error.message } : { success: true }; }
            if (method === 'DELETE') { const { error } = await sb.from('cvisual_recruitment_questions').delete().eq('id', id); return error ? { error: error.message } : { success: true }; }
        }

        // ── Email templates ───────────────────────────────────────────────────
        if (ep === '/admin/emails/templates' && method === 'GET') {
            const { data, error } = await sb.from('cvisual_email_templates').select('*');
            return error ? { error: error.message } : (data || []);
        }
        if ((m = ep.match(/^\/admin\/emails\/templates\/(\d+)$/))) {
            const id = m[1];
            if (method === 'GET') { const { data, error } = await sb.from('cvisual_email_templates').select('*').eq('id', id).single(); return error ? { error: error.message } : data; }
            if (method === 'PUT') { const { error } = await sb.from('cvisual_email_templates').update({ subject: body.subject, body: body.body }).eq('id', id); return error ? { error: error.message } : { success: true }; }
        }

        // ── Email settings ────────────────────────────────────────────────────
        if (ep === '/admin/emails/settings') {
            if (method === 'GET') {
                const { data, error } = await sb.from('cvisual_settings').select('*');
                if (error) return { error: error.message };
                const obj = {}; (data || []).forEach(s => { obj[s.key] = s.value; }); return obj;
            }
            if (method === 'POST') {
                for (const [k, v] of Object.entries(body || {})) {
                    await sb.from('cvisual_settings').upsert({ key: k, value: v }, { onConflict: 'key' });
                }
                return { success: true };
            }
        }

        // ── Email test ────────────────────────────────────────────────────────
        if (ep === '/admin/emails/test' && method === 'POST') {
            const { data: { session } } = await sb.auth.getSession();
            const email = session?.user?.email;
            if (!email) return { error: 'Email admin introuvable.' };
            const r = await _edgeCall('send-email', { to_email: email, subject: 'Test Email — CVisual Admin', html: "<div style='font-family:sans-serif;padding:30px'><h2>✅ Email opérationnel</h2><p>La configuration Supabase + Brevo fonctionne correctement.</p><p><b>CVisual Agency</b></p></div>" });
            return r.success ? { success: true, message: `Email envoyé à ${email}` } : { success: false, error: r.error };
        }

        // ── Email broadcast ───────────────────────────────────────────────────
        if (ep === '/admin/emails/broadcast' && method === 'POST') {
            const { target, subject, message } = body || {};
            let emails = [];
            if (target === 'newsletter') {
                const { data } = await sb.from('cvisual_newsletter').select('email');
                emails = (data || []).map(r => [r.email, 'Abonné']);
            } else if (target === 'applications') {
                const { data } = await sb.from('cvisual_applications').select('email, full_name');
                const seen = new Set();
                (data || []).forEach(r => { if (r.email && !seen.has(r.email)) { seen.add(r.email); emails.push([r.email, r.full_name || 'Candidat']); } });
            } else if (target === 'users') {
                const { data } = await sb.from('cvisual_users').select('email, full_name');
                emails = (data || []).map(r => [r.email, r.full_name || 'Utilisateur']);
            }
            let sent_count = 0;
            const errors = [];
            for (const [to_email, full_name] of emails) {
                const r = await _edgeCall('send-email', { template_key: 'broadcast', to_email, subject_override: subject, context: { full_name, message: message || '' } });
                if (r.success) sent_count++;
                else errors.push({ email: to_email.slice(0, 4) + '***', reason: r.error || 'Erreur inconnue' });
            }
            return { success: true, sent_count, total: emails.length, errors };
        }

        // ── Chat ──────────────────────────────────────────────────────────────
        if (ep === '/admin/chat/conversations' && method === 'GET') {
            const { data } = await sb.from('cvisual_chat_messages').select('visitor_id');
            return [...new Set((data || []).map(r => r.visitor_id))];
        }
        if ((m = ep.match(/^\/(?:admin\/)?chat\/messages$/))) {
            const visitorId = new URLSearchParams(ep.includes('?') ? ep.split('?')[1] : '').get('visitor_id');
            if (method === 'GET') {
                let q = sb.from('cvisual_chat_messages').select('sender, message, created_at').order('created_at', { ascending: true });
                if (visitorId) q = q.eq('visitor_id', visitorId);
                const { data } = await q;
                return (data || []).map(r => ({ ...r, time: new Date(r.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }));
            }
            if (method === 'POST') {
                const { error } = await sb.from('cvisual_chat_messages').insert({ visitor_id: body?.visitor_id, sender: body?.sender, message: body?.message });
                return error ? { error: error.message } : { success: true };
            }
        }

        return { error: `Endpoint non trouvé: ${ep}` };
    },

    // ── Upload (client-side base64 — aucun appel réseau) ─────────────────────

    async uploadFile(file) {
        return new Promise((resolve, reject) => {
            if (!file?.type?.startsWith('image/')) { resolve({ url: '' }); return; }
            const reader = new FileReader();
            reader.onload = e => {
                const img = new Image();
                img.onload = () => {
                    const MAX = 1200;
                    let w = img.width, h = img.height;
                    if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
                    const canvas = document.createElement('canvas');
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    resolve({ url: canvas.toDataURL('image/jpeg', 0.82) });
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // ── UI Helpers ────────────────────────────────────────────────────────────

    showLoader() {
        if (document.getElementById('global-loader')) return;
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = '<div class="loader-overlay"><div class="loader-spinner"></div></div>';
        document.body.appendChild(loader);
        if (!document.getElementById('loader-styles')) {
            const style = document.createElement('style');
            style.id = 'loader-styles';
            style.textContent = '.loader-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity .3s ease}.loader-spinner{width:48px;height:48px;border:5px solid #3b82f6;border-bottom-color:transparent;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}';
            document.head.appendChild(style);
        }
        setTimeout(() => { const o = document.querySelector('.loader-overlay'); if (o) o.style.opacity = '1'; }, 10);
    },

    hideLoader() {
        const o = document.querySelector('.loader-overlay');
        if (o) { o.style.opacity = '0'; setTimeout(() => { o.remove(); const c = document.getElementById('global-loader'); if (c) c.remove(); }, 300); }
    },

    showToast(message, type = 'success') {
        const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
        const toast = document.createElement('div');
        toast.style.cssText = `position:fixed;bottom:24px;right:24px;background:${colors[type]||colors.info};color:#fff;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600;z-index:10000;box-shadow:0 4px 20px rgba(0,0,0,.3);max-width:360px;animation:toastIn .3s ease`;
        toast.textContent = message;
        if (!document.getElementById('toast-css')) {
            const s = document.createElement('style'); s.id = 'toast-css';
            s.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
            document.head.appendChild(s);
        }
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }
};
