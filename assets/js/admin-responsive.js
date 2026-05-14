/**
 * Admin Responsive Logic
 * Handles sidebar toggling on mobile devices.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Create Mobile Header if not exists
    if (!document.querySelector('.mobile-admin-header')) {
        const header = document.createElement('div');
        header.className = 'mobile-admin-header';
        header.innerHTML = `
            <button id="sidebarToggle" class="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
                <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
            <div class="flex items-center space-x-2 ml-4">
                <img src="../../assets/logo.jpg" class="w-8 h-8 rounded-lg" alt="Logo">
                <span class="font-outfit font-black text-sm tracking-tighter text-gray-900">CVISUAL</span>
            </div>
        `;
        document.body.prepend(header);
    }

    // 2. Create Overlay if not exists
    if (!document.getElementById('sidebarOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'sidebarOverlay';
        document.body.appendChild(overlay);
    }

    const sidebar = document.querySelector('.sidebar');
    const toggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden');
    }

    if (toggle) toggle.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // Refresh icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
