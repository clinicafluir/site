// URL base da API
const API_BASE_URL = 'http://127.0.0.1:8000';

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
                // Ignore empty links or links that open modals
                if (this.getAttribute('href') === '#' || this.getAttribute('id') === 'btn-login-modal') return;
                
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
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
            const scrollPosition = window.pageYOffset + 150;

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

        // --- INICIALIZAÇÃO DA API (EQUIPE) ---
        carregarEquipeDestaque();
    }

    // --- LÓGICA DO MODAL DE LOGIN (Todas as páginas) ---
    const btnLogin = document.getElementById('btn-login-modal');
    const modalLogin = document.getElementById('modal-login');
    const btnCloseLogin = document.getElementById('close-login');
    const formLogin = document.getElementById('form-login');

    if (btnLogin && modalLogin) {
        // Abre o modal
        btnLogin.addEventListener('click', (e) => {
            e.preventDefault(); 
            modalLogin.classList.add('active');
        });

        // Fecha o modal no X
        btnCloseLogin.addEventListener('click', () => {
            modalLogin.classList.remove('active');
        });

        // Fecha o modal clicando fora da caixa branca
        modalLogin.addEventListener('click', (e) => {
            if (e.target === modalLogin) {
                modalLogin.classList.remove('active');
            }
        });

        // Simula o Login e Redireciona
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault();
                window.location.href = 'admin.html';
            });
        }
    }
});

// --- LÓGICA DE CONSUMO DA API PARA A HOMEPAGE ---
async function carregarEquipeDestaque() {
    const grid = document.getElementById('grid-profissionais-home');
    if (!grid) return; 

    try {
        const response = await fetch(`${API_BASE_URL}/api/profissionais`);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const profissionais = await response.json();
        
        // Pega apenas os 3 primeiros
        const profissionaisDestaque = profissionais.slice(0, 3);

        if (profissionaisDestaque.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Equipe em atualização.</p>';
            return;
        }

        grid.innerHTML = profissionaisDestaque.map(prof => `
            <div class="team-member">
                <img src="${API_BASE_URL}/${prof.foto_url}" alt="Foto de ${prof.nome}">
                <div class="member-info">
                    <h3>${prof.nome}</h3>
                    <p class="member-specialty">${prof.especialidade}</p>
                    <p class="member-registry">${prof.registro_conselho || '-'}</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Erro ao carregar a equipe destaque:", error);
        grid.innerHTML = '<p style="text-align: center; color: red; grid-column: 1 / -1;">Erro de conexão com o servidor.</p>';
    }
}