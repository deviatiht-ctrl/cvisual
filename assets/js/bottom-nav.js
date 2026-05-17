/* CVisual Bottom Navigation Bar - Mobile Fixed */
(function () {
    const path = window.location.pathname;
    const inPages = path.includes('/pages/');
    const root   = inPages ? '../' : '';
    const pref   = inPages ? ''    : 'pages/';

    function active(keys) {
        const p = path.toLowerCase();
        return keys.some(k => {
            if (k === '/') return p === '/' || p === '' || p.endsWith('/index.html') || p.endsWith('/index') || p.endsWith('cvisual-admin-deploy/') || p.endsWith('cvisual-admin-deploy');
            const term = k.replace('.html', '');
            return p.endsWith('/' + k) || p.endsWith(k) || p.endsWith('/' + term) || p.endsWith(term);
        }) ? 'cv-bnav-active' : '';
    }

    const links = [
        { 
            label: 'Accueil', 
            href: root + 'index.html', 
            keys: ['index.html', '/'],
            svg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`
        },
        { 
            label: 'Services', 
            href: pref + 'services.html', 
            keys: ['services.html'],
            svg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`
        },
        { 
            label: 'Portfolio', 
            href: pref + 'portfolio.html', 
            keys: ['portfolio.html'],
            svg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`
        },
        { 
            label: 'Contact', 
            href: pref + 'contact.html', 
            keys: ['contact.html'],
            svg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`
        }
    ];

    const navHTML = `
<style>
  #cv-bottom-nav {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    z-index: 500;
    pointer-events: none;
    display: flex;
    justify-content: center;
  }
  #cv-bottom-nav .cv-bnav-inner {
    pointer-events: all;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-radius: 9999px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 450px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02);
  }
  .cv-bnav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 8px 12px;
    border-radius: 9999px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    color: #4b5563;
    -webkit-tap-highlight-color: transparent;
    flex: 1;
    justify-content: center;
  }
  .cv-bnav-item:active {
    transform: scale(0.9);
  }
  .cv-bnav-active {
    color: #1E40AF !important;
    background: rgba(30, 64, 175, 0.08);
    font-weight: 700;
  }
  .cv-bnav-item svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.2;
    transition: transform 0.2s ease;
  }
  .cv-bnav-active svg {
    transform: translateY(-0.5px);
  }
  .cv-bnav-lbl {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: 'Outfit', 'Inter', sans-serif;
    line-height: 1;
  }
  @media(min-width: 768px) {
    #cv-bottom-nav { display: none !important; }
  }
</style>
<nav id="cv-bottom-nav" aria-label="Navigation mobile">
  <div class="cv-bnav-inner">
    ${links.map(l => `
    <a href="${l.href}" class="cv-bnav-item ${active(l.keys)}" aria-label="${l.label}">
      ${l.svg}
      <span class="cv-bnav-lbl">${l.label}</span>
    </a>`).join('')}
  </div>
</nav>`;

    document.body.insertAdjacentHTML('beforeend', navHTML);

    /* add bottom padding to body on mobile so content isn't hidden */
    const styleEl = document.createElement('style');
    styleEl.textContent = '@media(max-width:767px){body{padding-bottom:90px!important}}';
    document.head.appendChild(styleEl);
})();
