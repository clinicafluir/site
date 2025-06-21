document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navUl = document.getElementById('nav-links');
    const isHomePage = document.getElementById('home') !== null;

    // --- Mobile Menu Toggle ---
    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('nav-active');

            // Change icon to 'X' when menu is open
            const icon = menuToggle.querySelector('i');
            if (navUl.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                menuToggle.setAttribute('aria-label', 'Fechar menu');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });
    }

    // --- Close Mobile Menu on Link Click (for all pages) ---
    const allNavLinks = document.querySelectorAll('#nav-links a');
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navUl && navUl.classList.contains('nav-active')) {
                navUl.classList.remove('nav-active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });
    });

    // --- Homepage-only scripts: Smooth Scrolling & Active Link Highlighting ---
    if (isHomePage) {
        // --- Smooth Scrolling ---
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    // Wait a moment for menu to close before scrolling
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetSection.offsetTop - 90,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            });
        });

        // --- Highlight Active Nav Link on Scroll ---
        const sections = document.querySelectorAll('main section[id]');
        window.addEventListener('scroll', function() {
            let current = '';
            const scrollPosition = pageYOffset + 150;

            sections.forEach(section => {
                if (scrollPosition >= section.offsetTop) {
                    current = section.getAttribute('id');
                }
            });

            allNavLinks.forEach(link => {
                link.classList.remove('active');
                if (current && link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });

            // Also highlight home when at the top
            if (window.pageYOffset < 300) {
                allNavLinks.forEach(link => link.classList.remove('active'));
                const homeLink = document.querySelector('#nav-links a[href="#home"]');
                if (homeLink) homeLink.classList.add('active');
            }
        });
    }
}); 