/**
 * CVisual Public API Client
 * Handles data fetching for the public pages.
 */

const API_BASE = 'https://cvisual-backend.onrender.com/api'; // Nouvo URL Render ou
// const API_BASE = 'http://127.0.0.1:5000/api'; // Pou tès lokal


const CVisual = {
    async fetchPortfolio() {
        try {
            this.showLoader();
            const res = await fetch(`${API_BASE}/portfolio`);
            this.hideLoader();
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return await res.json();
        } catch (e) {
            this.hideLoader();
            console.error('Failed to fetch portfolio, returning fallback values:', e);
            return [
                {
                    id: 1,
                    title: "E-Commerce Boutique Élégance",
                    category: "Web Development",
                    main_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
                    challenge: "Créer une plateforme e-commerce rapide et responsive pour une boutique haut de gamme.",
                    solution: "Développement d'un site sur-mesure avec une expérience de paiement ultra-fluide.",
                    live_link: "#"
                },
                {
                    id: 2,
                    title: "Branding Saveurs Créoles",
                    category: "Design Graphique",
                    main_image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2670&auto=format&fit=crop",
                    challenge: "Refondre l'identité visuelle pour un restaurant traditionnel haïtien.",
                    solution: "Création d'un logo moderne tout en conservant les racines culturelles.",
                    live_link: "#"
                },
                {
                    id: 3,
                    title: "Campagne Lumina Studio",
                    category: "Gestion Communautaire",
                    main_image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
                    challenge: "Propulser l'engagement d'un studio créatif sur Instagram et TikTok.",
                    solution: "Production de contenus vidéos à fort impact et planification stratégique.",
                    live_link: "#"
                }
            ];
        }
    },

    async submitContact(data) {
        try {
            this.showLoader();
            const res = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            this.hideLoader();
            return await res.json();
        } catch (e) {
            this.hideLoader();
            console.error('Failed to submit contact:', e);
            return { error: 'Network error' };
        }
    },

    async subscribeNewsletter(email) {
        try {
            this.showLoader();
            const res = await fetch(`${API_BASE}/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            this.hideLoader();
            return await res.json();
        } catch (e) {
            this.hideLoader();
            console.error('Newsletter sub failed:', e);
            return { error: 'Network error' };
        }
    },

    async fetchServices() {
        try {
            this.showLoader();
            const res = await fetch(`${API_BASE}/services`);
            this.hideLoader();
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return await res.json();
        } catch (e) {
            this.hideLoader();
            console.error('Failed to fetch services, returning fallback values:', e);
            return [
                {
                    id: 1,
                    title: "Développement Web",
                    description: "Création de sites internet vitrines et e-commerce sur-mesure, performants et optimisés pour le SEO.",
                    icon: "globe",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
                    price: "45,000 HTG",
                    delay: "15 jours"
                },
                {
                    id: 2,
                    title: "Photographie & Vidéo",
                    description: "Captation d'images de haute qualité pour valoriser vos produits, vos événements et votre marque.",
                    icon: "camera",
                    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2564&auto=format&fit=crop",
                    price: "25,000 HTG",
                    delay: "5 jours"
                },
                {
                    id: 3,
                    title: "Gestion Communautaire",
                    description: "Animation et croissance de vos réseaux sociaux pour bâtir une communauté active et engagée.",
                    icon: "message-square",
                    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
                    price: "30,000 HTG",
                    delay: "Mensuel"
                },
                {
                    id: 4,
                    title: "Design Graphique & Branding",
                    description: "Conception de logos, d'identités visuelles uniques et de supports de communication professionnels.",
                    icon: "palette",
                    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2671&auto=format&fit=crop",
                    price: "20,000 HTG",
                    delay: "7 jours"
                }
            ];
        }
    },

    async fetchBlog() {
        try {
            this.showLoader();
            const res = await fetch(`${API_BASE}/blog`);
            this.hideLoader();
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return await res.json();
        } catch (e) {
            this.hideLoader();
            console.error('Failed to fetch blog, returning fallback values:', e);
            return [
                {
                    id: 1,
                    title: "L'essor du digital en Haïti en 2026",
                    content: "Analyse des nouvelles tendances de communication et de vente en ligne sur le marché local.",
                    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop",
                    date: "12 Mai 2026"
                }
            ];
        }
    },

    async fetchStats() {
        try {
            const res = await fetch(`${API_BASE}/stats`);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('Failed to fetch stats, returning fallback values:', e);
            return {
                projects: "150+",
                satisfaction: "100%",
                years: "5+"
            };
        }
    },

    async fetchTestimonials() {
        try {
            const res = await fetch(`${API_BASE}/testimonials`);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('Failed to fetch testimonials, returning fallback values:', e);
            return [
                {
                    content: "CVisual a complètement transformé notre présence en ligne. Notre nouveau site e-commerce a augmenté nos ventes de 250% en seulement 6 mois. Leur compréhension du marché haïtien est exceptionnelle.",
                    name: "Jean-Baptiste Moreau",
                    company: "Boutique Élégance",
                    avatar: null
                },
                {
                    content: "Les photos de nos plats réalisées par CVisual ont révolutionné notre marketing. Notre engagement sur Instagram a triplé et nous recevons maintenant des réservations de clients internationaux.",
                    name: "Marie-Claire Joseph",
                    company: "Saveurs Créoles",
                    avatar: null
                },
                {
                    content: "La gestion de nos réseaux sociaux par CVisual a professionnalisé notre image de marque. Nous avons gagné 5 000 nouveaux abonnés en 3 mois et notre taux de conversion a doublé.",
                    name: "Pierre-Louis Desrosiers",
                    company: "TechHaiti Solutions",
                    avatar: null
                }
            ];
        }
    },

    async fetchTeam() {
        try {
            const res = await fetch(`${API_BASE}/team`);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('Failed to fetch team, returning fallback values:', e);
            return [
                { id: 1, name: "Marc-Arthur Jean", role: "Directeur Artistique & Fondateur", avatar: null },
                { id: 2, name: "Vanessa Pierre", role: "Lead Web Developer", avatar: null },
                { id: 3, name: "Jean-Paul Charles", role: "Social Media Manager", avatar: null }
            ];
        }
    },

    async fetchNews() {
        try {
            const res = await fetch(`${API_BASE}/news`);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('Failed to fetch news, returning fallback values:', e);
            return [
                {
                    id: 1,
                    title: "CVisual recrute de nouveaux talents créatifs !",
                    content: "Nous recherchons des designers graphiques et développeurs passionnés pour rejoindre notre équipe à Delmas.",
                    type: "recrutement",
                    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
                    date: "15 Mai 2026"
                },
                {
                    id: 2,
                    title: "L'importance du design responsive pour votre entreprise",
                    content: "Découvrez pourquoi adapter votre site internet aux formats mobiles est aujourd'hui indispensable en Haïti.",
                    type: "actualite",
                    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop",
                    date: "10 Mai 2026"
                }
            ];
        }
    },

    async fetchClients() {
        try {
            const res = await fetch(`${API_BASE}/clients`);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('Failed to fetch clients, returning fallback values:', e);
            return [
                { id: 1, name: "Jeeko", logo: "assets/jeeko.jpg" },
                { id: 2, name: "Madjicks", logo: "assets/madjicks (1).jpeg" },
                { id: 3, name: "Senteur Douceur", logo: "assets/senteur douceur (1).jpeg" },
                { id: 4, name: "Jim Smart", logo: "assets/jim smart 509 (1).jpeg" }
            ];
        }
    },

    async submitApplication(data) {
        try {
            this.showLoader();
            const res = await fetch(`${API_BASE}/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            this.hideLoader();
            return await res.json();
        } catch (e) {
            this.hideLoader();
            console.error('Failed to submit application:', e);
            return { error: 'Network error' };
        }
    },

    showLoader() {
        if (!document.getElementById('global-loader')) {
            const loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.innerHTML = `
                <div class="loader-overlay">
                    <div class="loader-spinner"></div>
                </div>
            `;
            document.body.appendChild(loader);

            if (!document.getElementById('loader-styles')) {
                const style = document.createElement('style');
                style.id = 'loader-styles';
                style.textContent = `
                    .loader-overlay {
                        position: fixed;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.5);
                        backdrop-filter: blur(4px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        pointer-events: all;
                    }
                    .loader-spinner {
                        width: 48px;
                        height: 48px;
                        border: 5px solid #3b82f6;
                        border-bottom-color: transparent;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        setTimeout(() => {
            const overlay = document.querySelector('.loader-overlay');
            if (overlay) overlay.style.opacity = '1';
        }, 10);
    },

    hideLoader() {
        const overlay = document.querySelector('.loader-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                const container = document.getElementById('global-loader');
                if (container) container.remove();
            }, 300);
        }
    },

    getImageUrl(path) {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('assets/')) return path;
        const base = API_BASE.replace('/api', '');
        return `${base}${path}`;
    }
};
