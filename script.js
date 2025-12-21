// ===== CONFIGURAÇÕES GERAIS =====
let mouseX = 0;
let mouseY = 0;
let mouseTimer;

// ===== CARROSSEL DO PORTFÓLIO COM ARRASTE PARA MOBILE =====
function initPortfolioCarousel() {
    const carousel = document.querySelector('.portfolio-carousel');
    const items = document.querySelectorAll('.portfolio-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    const wrapper = document.querySelector('.portfolio-carousel-wrapper');
    
    if (!carousel || items.length === 0) return;
    
    let currentIndex = 0;
    let itemsPerView = 1;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationId = null;
    
    // Criar dots
    items.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    function updateItemsPerView() {
        if (window.innerWidth >= 992) {
            itemsPerView = 3;
        } else if (window.innerWidth >= 768) {
            itemsPerView = 2;
        } else {
            itemsPerView = 1;
        }
    }
    
    function updateCarousel() {
        updateItemsPerView();
        
        // Calcular o deslocamento
        const itemWidth = 100 / itemsPerView;
        const gap = 25;
        const translateX = -currentIndex * (itemWidth + (gap / itemsPerView));
        
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Controlar botões
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        }
        
        if (nextBtn) {
            const maxIndex = Math.max(0, items.length - itemsPerView);
            nextBtn.disabled = currentIndex >= maxIndex;
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        }
    }
    
    function nextSlide() {
        updateItemsPerView();
        const maxIndex = Math.max(0, items.length - itemsPerView);
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
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    // Funções para arraste (touch e mouse)
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    function startDrag(event) {
        if (window.innerWidth > 767) return; // Apenas para mobile
        isDragging = true;
        startPos = getPositionX(event);
        carousel.style.cursor = 'grabbing';
        carousel.style.transition = 'none';
        animationId = requestAnimationFrame(animation);
        
        // Prevenir comportamento padrão
        event.preventDefault();
    }
    
    function drag(event) {
        if (!isDragging || window.innerWidth > 767) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
    
    function endDrag() {
        if (!isDragging || window.innerWidth > 767) return;
        isDragging = false;
        cancelAnimationFrame(animationId);
        carousel.style.cursor = 'grab';
        carousel.style.transition = 'transform 0.5s ease';
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Se o movimento for significativo, mudar slide
        if (Math.abs(movedBy) > 50) {
            if (movedBy < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        // Resetar posição
        currentTranslate = 0;
        prevTranslate = 0;
        updateCarousel();
    }
    
    function animation() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }
    
    // Event listeners para botões
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Event listeners para touch (mobile)
    if (wrapper) {
        wrapper.addEventListener('touchstart', startDrag);
        wrapper.addEventListener('touchmove', drag);
        wrapper.addEventListener('touchend', endDrag);
        
        // Prevenir scroll vertical enquanto arrasta
        wrapper.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // Event listeners para mouse (desktop)
    if (wrapper && window.innerWidth <= 767) {
        wrapper.addEventListener('mousedown', startDrag);
        wrapper.addEventListener('mousemove', drag);
        wrapper.addEventListener('mouseup', endDrag);
        wrapper.addEventListener('mouseleave', endDrag);
    }
    
    // Redimensionamento da janela
    window.addEventListener('resize', updateCarousel);
    
    // Inicializar
    updateCarousel();
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

// ===== MODAL DE EXPERIÊNCIAS =====
function initExperienceModal() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const experienceModal = document.getElementById('experienceModal');
    const modalClose = document.querySelector('.experience-modal-close');
    const modalTitle = document.querySelector('.experience-modal-title');
    const modalDate = document.querySelector('.experience-modal-date');
    const modalDescription = document.querySelector('.experience-modal-description');
    const modalDetails = document.querySelector('.experience-modal-details');
    
    const experiencesData = [
        {
            title: "Fundador e CEO - XS Commerce",
            date: "2023 - Atual",
            description: "Assessoria de Marketing Estratégica especializada em e-commerce e performance digital.",
            details: [
                "Gestão de campanhas em Meta Ads e Google Ads com foco em ROI",
                "Desenvolvimento de estratégias de tráfego para e-commerce",
                "Gestão de marketplaces ads, shopee e mercado livre com foco em ROI",
                "Criação e otimização de funis de venda para e-commerce",
                "Análise profunda de KPIs para tomada de decisão baseada em dados",
                "Implementação de estratégias para aumentar o LTV (Lifetime Value)",
                "Geração de leads para whatsapp",
                "Treinamento para time comercial",
                "Edição e Criação de vídeos e imagens publicitárias",
                "Criação de sites e lojas virtuias otimizadas para conversão",
                "Copywriting e Roteirização de vídeos",
                "Prospecção Ativa e Closer de Vendas",
                "Gestão de uma assessoria de marketing com foco em performance"
            ]
        },
        {
            title: "Fundador e CEO - ATYLA E-commerce",
            date: "2021 - 2023",
            description: "E-commerce de moda masculina que alcançou 400 clientes ativos através de estratégias digitais.",
            details: [
                "Gestão completa de anúncios online (Meta Ads e Google Ads)",
                "Administração completa do e-commerce",
                "Pesquisa de mercado, precificação e desenvolvimento de produtos",
                "Criação de páginas de vendas otimizadas para conversão",
                "Edição e Criação de vídeos e imagens publicitárias",
                "Criação e otimização de funis de venda completos",
                "Copywriting e Roteirização de vídeos",
                "Controle de estoque e alinhamento com fornecedores",
                "Implementação de estratégias para aumentar o LTV (Lifetime Value)",
                "Análise profunda de KPIs para tomada de decisão baseada em dados"
            ]
        },
        {
            title: "Coordenador de TI - MMJ Contabilidade",
            date: "2020 - 2023",
            description: "Responsável pela manutenção e suporte de toda a infraestrutura tecnológica de uma das maiores empresas de contabilidade do interior de Minas Gerais.",
            details: [
                "Suporte técnico especializado a + de 60 colaboradores locais",
                "Implementação de políticas de segurança de dados",
                "Manutenção e monitoramento de servidores, computadores, redes e sistemas",
                "Gestão de backups e atualizações críticas",
                "Implantação de novas soluções tecnológicas",
                "Gestão e reposição do inventário de equipamentos",
                "Gestão de orçamento para novas tecnologias",
                "Coordenação de projetos"
            ]
        }
    ];
    
    // Abrir modal
    timelineItems.forEach((item, index) => {
        const btnMoreInfo = item.querySelector('.btn-more-info');
        
        const clickHandler = () => {
            const data = experiencesData[index];
            
            modalTitle.textContent = data.title;
            modalDate.textContent = data.date;
            modalDescription.textContent = data.description;
            
            modalDetails.innerHTML = '';
            const detailsTitle = document.createElement('h4');
            detailsTitle.textContent = 'Responsabilidades';
            modalDetails.appendChild(detailsTitle);
            
            const detailsList = document.createElement('ul');
            data.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                detailsList.appendChild(li);
            });
            modalDetails.appendChild(detailsList);
            
            experienceModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        
        item.addEventListener('click', clickHandler);
        if (btnMoreInfo) {
            btnMoreInfo.addEventListener('click', function(e) {
                e.stopPropagation();
                clickHandler();
            });
        }
    });
    
    // Fechar modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            experienceModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    if (experienceModal) {
        experienceModal.addEventListener('click', (e) => {
            if (e.target === experienceModal) {
                experienceModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && experienceModal.classList.contains('active')) {
            experienceModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== MODAL DE PORTFÓLIO SIMPLIFICADO (SEM IMAGEM) =====
function initPortfolioModal() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioModal = document.getElementById('portfolioModal');
    const modalClose = document.querySelector('.portfolio-modal-close');
    const modalTitle = document.querySelector('.portfolio-modal-title');
    const modalSubtitle = document.querySelector('.portfolio-modal-subtitle');
    const modalIcon = document.querySelector('.portfolio-modal-icon');
    const modalDescription = document.querySelector('.portfolio-modal-description');
    const linksContainer = document.querySelector('.links-container');
    
    const portfolioData = [
        {
            title: "ATYLA - E-commerce de Moda Masculina",
            subtitle: "E-commerce completo que alcançou 400 clientes ativos",
            icon: "fas fa-tshirt",
            description: "Gestão e Desenvolvimento completo de e-commerce de moda masculina. O projeto incluiu desde a concepção da marca, desenvolvimento do site, até a implementação de estratégias de marketing digital que resultaram em 400 clientes ativos no primeiro ano.",
            link: { text: "Site pausado", url: "#", icon: "fas fa-external-link-alt" }
        },
        {
            title: "Jhoy Pet - E-commerce de produtos Pet",
            subtitle: "Aumento em 500% no faturamento no primeiro mês",
            icon: "fas fa-bullseye",
            description: "Montamos uma estratégia completa de tráfego pago com foco inicial em geração de leads para whatsapp e instagram, objetivo era conversão rápida e barata. Resultado no primeiro mês: Saímos de 30 Conversas por mês para 400 sem aumentar o investimento, aumentando o faturamento em 500%. Lançamos o e-commerce 3 meses após o início da assessoria e no primeiro dia batemos o mês inteiro de faturamento no whatsapp.",
            link: { text: "Site da Empresa", url: "https://www.jhoypet.com.br", icon: "fas fa-chart-line" }
        },
        {
            title: "Infraestrutura de TI - MMJ Contabilidade",
            subtitle: "Gestão completa de infraestrutura tecnológica",
            icon: "fas fa-landmark",
            description: "Implementação e gestão da infraestrutura tecnológica para uma das maiores empresas de contabilidade do interior de Minas Gerais. Incluiu migração para nuvem, implementação de políticas de segurança e suporte técnico especializado.",
            link: { text: "Site da empresa", url: "https://www.mmj.com.br", icon: "fas fa-chart-line" }
        },
        {
            title: "Estratégia de Growth Marketing",
            subtitle: "Growth marketing para empresa de design de interiores",
            icon: "fas fa-chart-line",
            description: "Criamos uma estratégia completa de aquisição de leads via whastapp para uma empresa de design de interiores, nos primeiros meses já tivemos uma média de 1500 novos leads todos os meses. Iniciamos o processo de expansão digital com landing pages de alta conversão para vendas nacionais e internacionais.",
            link: { text: "Site Empresa Brasil", url: "https://www.sposatopremium.com.br", icon: "fas fa-presentation" }
        }
    ];
    
    // Abrir modal
    portfolioItems.forEach((item, index) => {
        const btnViewDetails = item.querySelector('.portfolio-view-details');
        
        const clickHandler = (e) => {
            // Prevenir comportamento padrão em mobile
            if (e.cancelable) {
                e.preventDefault();
            }
            
            const data = portfolioData[index];
            
            modalTitle.textContent = data.title;
            modalSubtitle.textContent = data.subtitle;
            modalIcon.innerHTML = `<i class="${data.icon}"></i>`;
            modalDescription.textContent = data.description;
            
            linksContainer.innerHTML = '';
            if (data.link && data.link.url && data.link.text) {
                const linkElement = document.createElement('a');
                linkElement.href = data.link.url;
                linkElement.className = 'link-item';
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
                linkElement.innerHTML = `<i class="${data.link.icon}"></i> ${data.link.text}`;
                linksContainer.appendChild(linkElement);
                linksContainer.style.display = 'block';
            } else {
                linksContainer.style.display = 'none';
            }
            
            portfolioModal.classList.add('active');
            document.body.style.overflow = 'auto';
        };
        
        // Adicionar evento de clique para desktop
        item.addEventListener('click', clickHandler);
        
        // Adicionar evento de toque para mobile
        item.addEventListener('touchend', function(e) {
            // Impedir que o toque também dispare o evento de clique
            e.preventDefault();
            clickHandler(e);
        });
        
        // Também adicionar evento no botão
        if (btnViewDetails) {
            btnViewDetails.addEventListener('click', function(e) {
                e.stopPropagation();
                clickHandler(e);
            });
            
            btnViewDetails.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                clickHandler(e);
            });
        }
    });
    
    // Fechar modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            portfolioModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
        });
    }
    
    if (portfolioModal) {
        portfolioModal.addEventListener('click', (e) => {
            if (e.target === portfolioModal) {
                portfolioModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                document.body.style.position = 'static';
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && portfolioModal.classList.contains('active')) {
            portfolioModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
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
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            const navLinks = document.getElementById('navLinks');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
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
    }, 1500);
}

// ===== INICIALIZAR TUDO =====
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initMobileMenu();
    initSmoothNavigation();
    initNavbarScroll();
    initTypewriter();
    initLogoModal();
    initExperienceModal();
    initPortfolioModal();
    initPortfolioCarousel();
    
    // Remover loading screen após 5 segundos (fallback)
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
