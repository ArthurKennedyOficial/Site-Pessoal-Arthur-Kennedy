// Atualizar posição do mouse
function updateMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Atualizar luz do mouse
    const mouseLight = document.querySelector('.mouse-light');
    if (mouseLight) {
        mouseLight.style.opacity = '1';
        mouseLight.style.left = mouseX + 'px';
        mouseLight.style.top = mouseY + 'px';
        
        // Esconder luz após 1 segundo sem movimento
        clearTimeout(window.mouseTimer);
        window.mouseTimer = setTimeout(() => {
            mouseLight.style.opacity = '0';
        }, 1000);
    }
}

// ===== CARROSSEL DO PORTFÓLIO =====
function initPortfolioCarousel() {
    const carousel = document.querySelector('.portfolio-carousel');
    const items = document.querySelectorAll('.portfolio-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (!carousel || items.length === 0) return;
    
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    function getItemsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }
    
    function updateCarousel() {
        const itemsPerView = getItemsPerView();
        const itemWidth = 100 / itemsPerView;
        const translateX = -currentIndex * itemWidth;
        
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar dots
        const maxDots = Math.max(0, Math.ceil(items.length / itemsPerView) - 1);
        dots.forEach((dot, index) => {
            if (dot) {
                dot.classList.toggle('active', index === currentIndex && index <= maxDots);
                dot.style.display = index <= maxDots ? 'block' : 'none';
            }
        });
        
        // Controlar visibilidade dos botões
        if (prevBtn && nextBtn) {
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            prevBtn.disabled = currentIndex === 0;
            
            const maxIndex = Math.max(0, Math.ceil(items.length / itemsPerView) - 1);
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
            nextBtn.disabled = currentIndex >= maxIndex;
        }
    }
    
    function nextSlide() {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, Math.ceil(items.length / itemsPerView) - 1);
        
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }
    
    // Touch/swipe para mobile
    function touchStart(e) {
        if (window.innerWidth > 767) return; // Apenas para mobile
        
        isDragging = true;
        startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        animationID = requestAnimationFrame(animation);
        carousel.style.cursor = 'grabbing';
    }
    
    function touchMove(e) {
        if (!isDragging || window.innerWidth > 767) return;
        e.preventDefault();
        
        const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
    
    function touchEnd() {
        if (window.innerWidth > 767) return;
        
        isDragging = false;
        cancelAnimationFrame(animationID);
        carousel.style.cursor = 'grab';
        
        const itemsPerView = getItemsPerView();
        const itemWidth = carousel.offsetWidth / itemsPerView;
        const movedBy = currentTranslate - prevTranslate;
        
        // Se o movimento for significativo, mudar slide
        if (Math.abs(movedBy) > itemWidth * 0.2) {
            if (movedBy < 0 && currentIndex < Math.ceil(items.length / itemsPerView) - 1) {
                nextSlide();
            } else if (movedBy > 0 && currentIndex > 0) {
                prevSlide();
            }
        }
        
        prevTranslate = currentTranslate;
    }
    
    function animation() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) requestAnimationFrame(animation);
    }
    
    // Event listeners para desktop
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Event listeners para mobile (touch)
    carousel.addEventListener('touchstart', touchStart);
    carousel.addEventListener('touchmove', touchMove);
    carousel.addEventListener('touchend', touchEnd);
    
    // Event listeners para mouse (desktop)
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mousemove', touchMove);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', touchEnd);
    
    if (dots) {
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                currentIndex = parseInt(this.getAttribute('data-index'));
                updateCarousel();
            });
        });
    }
    
    // Inicializar
    updateCarousel();
    window.addEventListener('resize', updateCarousel);
}

// ===== CERTIFICAÇÕES =====
function initCertifications() {
    const certificationCards = document.querySelectorAll('.certification-card');
    const certificationModal = document.querySelector('.certification-modal');
    const modalClose = document.querySelector('.certification-modal-close');
    const modalTitle = document.querySelector('.certification-modal-title');
    const modalDate = document.querySelector('.certification-modal-date');
    const modalDescription = document.querySelector('.certification-modal-description');
    const modalDetails = document.querySelector('.certification-modal-details');
    const modalSkills = document.querySelector('.certification-modal-skills');
    
    // Dados das certificações
    const certificationsData = [
        {
            title: "Google Ads Certification",
            date: "2022",
            description: "Certificação oficial do Google em gestão de campanhas de publicidade digital, abrangendo Search, Display, Video e Shopping Ads.",
            details: [
                "Gestão completa de campanhas no Google Ads",
                "Otimização de ROI e conversões",
                "Segmentação avançada de público",
                "Análise de métricas e relatórios"
            ],
            skills: ["Google Ads", "Publicidade", "ROI", "Análise"]
        },
        {
            title: "Meta Blueprint Certification",
            date: "2023",
            description: "Certificação avançada em marketing no Facebook e Instagram, incluindo estratégias de conteúdo, anúncios e análise de performance.",
            details: [
                "Estratégias de conteúdo para Facebook e Instagram",
                "Criação e gestão de campanhas patrocinadas",
                "Otimização de anúncios para diferentes objetivos",
                "Análise de métricas e ajustes de campanha"
            ],
            skills: ["Meta Ads", "Facebook", "Instagram", "Marketing"]
        },
        {
            title: "E-commerce Specialist",
            date: "2021",
            description: "Especialização em gestão e otimização de lojas virtuais, incluindo plataformas, logística e conversão de vendas.",
            details: [
                "Gestão de plataformas e-commerce (Shopify, WooCommerce)",
                "Otimização de conversão e experiência do usuário",
                "Gestão de estoque e logística",
                "Estratégias de retenção de clientes"
            ],
            skills: ["E-commerce", "Shopify", "Conversão", "Logística"]
        },
        {
            title: "Desenvolvimento Web Full Stack",
            date: "2020",
            description: "Formação completa em desenvolvimento web front-end e back-end, com foco em tecnologias modernas e práticas ágeis.",
            details: [
                "HTML5, CSS3, JavaScript (ES6+)",
                "React.js e Node.js",
                "Banco de dados SQL e NoSQL",
                "APIs REST e GraphQL"
            ],
            skills: ["Front-end", "Back-end", "React", "Node.js"]
        },
        {
            title: "Gestão de Projetos Ágeis",
            date: "2022",
            description: "Metodologias ágeis e gestão eficiente de projetos digitais, com foco em Scrum, Kanban e entrega contínua de valor.",
            details: [
                "Metodologias Scrum e Kanban",
                "Planejamento e estimativa de projetos",
                "Gestão de equipes remotas",
                "Entrega contínua e melhoria constante"
            ],
            skills: ["Scrum", "Kanban", "Gestão", "Ágil"]
        },
        {
            title: "Segurança da Informação",
            date: "2021",
            description: "Proteção de dados e sistemas em ambientes corporativos, incluindo políticas de segurança, criptografia e prevenção de ataques.",
            details: [
                "Políticas e procedimentos de segurança",
                "Criptografia e proteção de dados",
                "Prevenção e detecção de ameaças",
                "Conformidade com LGPD e GDPR"
            ],
            skills: ["Segurança", "Criptografia", "LGPD", "Proteção"]
        }
    ];
    
    // Abrir modal
    certificationCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const data = certificationsData[index];
            
            // Preencher modal com dados
            modalTitle.textContent = data.title;
            modalDate.textContent = data.date;
            modalDescription.textContent = data.description;
            
            // Limpar e preencher detalhes
            modalDetails.innerHTML = '';
            const detailsTitle = document.createElement('h4');
            detailsTitle.textContent = 'Detalhes';
            modalDetails.appendChild(detailsTitle);
            
            const detailsList = document.createElement('ul');
            data.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                detailsList.appendChild(li);
            });
            modalDetails.appendChild(detailsList);
            
            // Limpar e preencher habilidades
            modalSkills.innerHTML = '';
            data.skills.forEach(skill => {
                const skillSpan = document.createElement('span');
                skillSpan.textContent = skill;
                modalSkills.appendChild(skillSpan);
            });
            
            // Mostrar modal
            certificationModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Fechar modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            certificationModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Fechar modal ao clicar fora
    if (certificationModal) {
        certificationModal.addEventListener('click', (e) => {
            if (e.target === certificationModal) {
                certificationModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certificationModal.classList.contains('active')) {
            certificationModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== MODAL DA LOGO =====
function initLogoModal() {
    const logoLink = document.querySelector('.logo-img') || document.querySelector('.logo');
    const modal = document.getElementById('logoModal');
    const closeBtn = document.querySelector('.logo-modal-close');
    
    if (!logoLink || !modal) return;
    
    logoLink.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== ANIMAÇÃO DE DIGITAÇÃO =====
function initTypewriter() {
    const nameElement = document.getElementById('typed-name');
    const subtitleElement = document.getElementById('typed-subtitle');
    
    if (!nameElement) return;
    
    const nameText = "Arthur Kennedy De Faria";
    const subtitleText = "Gestor de Tráfego, Gestor de E-commerce, Desenvolvedor Web e TI";
    
    nameElement.textContent = "";
    subtitleElement.textContent = "";
    
    function typeText(element, text, speed = 50, callback = null) {
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                setTimeout(callback, 500);
            }
        }
        
        type();
    }
    
    // Começar animação
    setTimeout(() => {
        typeText(nameElement, nameText, 50, () => {
            setTimeout(() => {
                typeText(subtitleElement, subtitleText, 30);
            }, 300);
        });
    }, 1000);
}

// ===== NAVEGAÇÃO SUAVE =====
function initSmoothNavigation() {
    // Links do menu
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Fechar menu mobile se aberto
            const navLinks = document.getElementById('navLinks');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
            
            // Rolagem suave
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Setas de scroll
    document.querySelectorAll('.scroll-down').forEach(arrow => {
        arrow.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href') || this.getAttribute('data-target');
            if (targetId) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
        
        document.body.style.overflow = navLinks.classList.contains('active') 
            ? 'hidden' 
            : 'auto';
    });
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        });
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.visibility = 'hidden';
            }, 1000);
        }
    }, 2000);
}

// ===== INTERSECTION OBSERVER =====
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar elementos
    document.querySelectorAll('.timeline-content, .skill-category, .portfolio-item, .certification-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== OTIMIZAÇÃO PARA MOBILE =====
function optimizeForMobile() {
    if (window.innerWidth < 768) {
        // Ajustes específicos para mobile
        document.body.style.overflowX = 'hidden';
        
        // Ajustar tamanhos de fonte
        const elementsToAdjust = document.querySelectorAll('h1, h2, h3, p, .btn, .stat-value');
        elementsToAdjust.forEach(el => {
            const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
            if (currentSize > 16) {
                el.style.fontSize = `${currentSize * 0.9}px`;
            }
        });
    }
}

// ===== INICIALIZAR TUDO =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funções
    initLoadingScreen();
    initMobileMenu();
    initSmoothNavigation();
    initNavbarScroll();
    initTypewriter();
    initLogoModal();
    initPortfolioCarousel();
    initCertifications();
    initIntersectionObserver();
    
    // Inicializar efeitos de mouse
    document.addEventListener('mousemove', updateMousePosition);
    applyParallax();
    
    // Inicializar linha animada
    if (animatedLine) {
        updateAnimatedLine();
    }
    
    // Otimizar para dispositivos móveis
    optimizeForMobile();
    window.addEventListener('resize', optimizeForMobile);
    
    // Remover loading screen se ainda estiver visível após 5 segundos
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen && loadingScreen.style.visibility !== 'hidden') {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.visibility = 'hidden';
            }, 1000);
        }
    }, 5000);
});

// ===== GESTÃO DE PERFORMANCE =====
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recarregar carrossel após redimensionamento
        initPortfolioCarousel();
    }, 250);
});

// Desabilitar animações quando a página não está visível
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pausar animações se possível
    } else {
        // Retomar animações
    }
});
