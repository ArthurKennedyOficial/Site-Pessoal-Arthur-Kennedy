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

// ===== MODAL DE EXPERIÊNCIAS =====
function initExperienceModal() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const experienceModal = document.getElementById('experienceModal');
    const modalClose = document.querySelector('.experience-modal-close');
    const modalTitle = document.querySelector('.experience-modal-title');
    const modalDate = document.querySelector('.experience-modal-date');
    const modalDescription = document.querySelector('.experience-modal-description');
    const modalDetails = document.querySelector('.experience-modal-details');
    
    // Dados das experiências completas
    const experiencesData = [
        {
            title: "Fundador e CEO - XS Commerce",
            date: "2023 - Atual",
            description: "Assessoria de Marketing Estratégica especializada em e-commerce e performance digital.",
            details: [
                "Gestão de campanhas em Meta Ads e Google Ads com foco em ROI",
                "Desenvolvimento de estratégias de tráfego para e-commerce",
                "Criação e otimização de funis de venda completos",
                "Análise profunda de KPIs para tomada de decisão baseada em dados",
                "Implementação de estratégias para aumentar o LTV (Lifetime Value)"
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
                "Criação e otimização de funis de venda completos"
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
                "Implantação de novas soluções tecnológicas"
            ]
        }
    ];
    
    // Abrir modal
    timelineItems.forEach((item, index) => {
        const btnMoreInfo = item.querySelector('.btn-more-info');
        
        const clickHandler = () => {
            const data = experiencesData[index];
            
            // Preencher modal com dados
            modalTitle.textContent = data.title;
            modalDate.textContent = data.date;
            modalDescription.textContent = data.description;
            
            // Limpar e preencher detalhes
            modalDetails.innerHTML = '';
            const detailsTitle = document.createElement('h4');
            detailsTitle.textContent = 'Responsabilidades e Conquistas';
            modalDetails.appendChild(detailsTitle);
            
            const detailsList = document.createElement('ul');
            data.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                detailsList.appendChild(li);
            });
            modalDetails.appendChild(detailsList);
            
            // Mostrar modal
            experienceModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        
        // Adicionar evento ao item e ao botão
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
    
    // Fechar modal ao clicar fora
    if (experienceModal) {
        experienceModal.addEventListener('click', (e) => {
            if (e.target === experienceModal) {
                experienceModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && experienceModal.classList.contains('active')) {
            experienceModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== MODAL DE PORTFÓLIO =====
function initPortfolioModal() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioModal = document.getElementById('portfolioModal');
    const modalClose = document.querySelector('.portfolio-modal-close');
    const modalTitle = document.querySelector('.portfolio-modal-title');
    const modalSubtitle = document.querySelector('.portfolio-modal-subtitle');
    const modalIcon = document.querySelector('.portfolio-modal-icon');
    const galleryMain = document.querySelector('.gallery-main-img');
    const galleryThumbs = document.querySelector('.gallery-thumbs');
    const modalDescription = document.querySelector('.portfolio-modal-description');
    const linksContainer = document.querySelector('.links-container');
    const techTags = document.querySelector('.tech-tags');
    const downloadsContainer = document.querySelector('.downloads-container');
    
    // Dados dos projetos do portfólio
    const portfolioData = [
        {
            title: "ATYLA - E-commerce de Moda Masculina",
            subtitle: "E-commerce completo que alcançou 400 clientes ativos",
            icon: "fas fa-tshirt",
            description: "Desenvolvimento completo de e-commerce de moda masculina com estratégias digitais integradas. O projeto incluiu desde a concepção da marca, desenvolvimento do site, até a implementação de estratégias de marketing digital que resultaram em 400 clientes ativos.",
            images: [
                "projeto1-1.jpg",
                "projeto1-2.jpg",
                "projeto1-3.jpg"
            ],
            links: [
                { text: "Visitar Site", url: "#", icon: "fas fa-external-link-alt" },
                { text: "Case Completo", url: "#", icon: "fas fa-file-alt" }
            ],
            technologies: ["E-commerce", "Meta Ads", "Google Ads", "Gestão de Tráfego", "Nuvem Shop", "Google Analytics"],
            downloads: [
                { text: "PDF do Case", url: "#", icon: "fas fa-file-pdf" },
                { text: "Apresentação", url: "#", icon: "fas fa-file-powerpoint" }
            ]
        },
        {
            title: "Campanha de Tráfego para E-commerce",
            subtitle: "Aumento de 40% nas conversões com ROI 4.2x",
            icon: "fas fa-bullseye",
            description: "Estratégia completa de tráfego pago para e-commerce de moda feminina. Utilizando Meta Ads e Google Ads, otimizei campanhas que resultaram em aumento de 40% nas conversões e ROI de 4.2x em 3 meses.",
            images: [
                "projeto2-1.jpg",
                "projeto2-2.jpg",
                "projeto2-3.jpg"
            ],
            links: [
                { text: "Relatório de Performance", url: "#", icon: "fas fa-chart-line" },
                { text: "Dashboard Analytics", url: "#", icon: "fas fa-tachometer-alt" }
            ],
            technologies: ["Meta Ads", "Google Ads", "Otimização", "Google Analytics", "ROI", "Conversão"],
            downloads: [
                { text: "Relatório PDF", url: "#", icon: "fas fa-file-pdf" },
                { text: "Planilha de Métricas", url: "#", icon: "fas fa-file-excel" }
            ]
        },
        {
            title: "Infraestrutura de TI - MMJ Contabilidade",
            subtitle: "Gestão completa de infraestrutura tecnológica",
            icon: "fas fa-landmark",
            description: "Implementação e gestão da infraestrutura tecnológica para uma das maiores empresas de contabilidade do interior de Minas Gerais. Incluiu migração para nuvem, implementação de políticas de segurança e suporte técnico especializado.",
            images: [
                "projeto3-1.jpg",
                "projeto3-2.jpg",
                "projeto3-3.jpg"
            ],
            links: [
                { text: "Diagrama da Infraestrutura", url: "#", icon: "fas fa-network-wired" },
                { text: "Relatório Técnico", url: "#", icon: "fas fa-file-contract" }
            ],
            technologies: ["TI", "Infraestrutura", "Segurança", "Servidores", "Redes", "Cloud"],
            downloads: [
                { text: "Manual de Procedimentos", url: "#", icon: "fas fa-book" },
                { text: "Checklist de Segurança", url: "#", icon: "fas fa-clipboard-check" }
            ]
        },
        {
            title: "Estratégia de Growth Marketing",
            subtitle: "Growth marketing para startup de tecnologia",
            icon: "fas fa-chart-line",
            description: "Desenvolvimento de estratégia completa de growth marketing para startup de tecnologia no setor de saúde. Implementação de funis de aquisição, ativação e retenção que resultaram em crescimento de 200% na base de usuários em 6 meses.",
            images: [
                "projeto4-1.jpg",
                "projeto4-2.jpg",
                "projeto4-3.jpg"
            ],
            links: [
                { text: "Apresentação da Estratégia", url: "#", icon: "fas fa-presentation" },
                { text: "Dashboard Growth", url: "#", icon: "fas fa-chart-bar" }
            ],
            technologies: ["Growth", "Marketing", "Estratégia", "Startup", "Funis", "Retenção"],
            downloads: [
                { text: "Plano de Growth", url: "#", icon: "fas fa-roadmap" },
                { text: "Template de Métricas", url: "#", icon: "fas fa-table" }
            ]
        },
        {
            title: "App de Gestão de E-commerce",
            subtitle: "Aplicativo mobile para gestão integrada",
            icon: "fas fa-mobile-alt",
            description: "Desenvolvimento de aplicativo mobile para gestão integrada de múltiplos e-commerces. Permite controle de estoque, pedidos, métricas e campanhas de marketing em uma única plataforma.",
            images: [
                "projeto5-1.jpg",
                "projeto5-2.jpg",
                "projeto5-3.jpg"
            ],
            links: [
                { text: "Demo do App", url: "#", icon: "fas fa-play-circle" },
                { text: "Documentação API", url: "#", icon: "fas fa-code" }
            ],
            technologies: ["Mobile", "App", "Gestão", "Integração", "React Native", "API"],
            downloads: [
                { text: "APK do App", url: "#", icon: "fas fa-mobile-alt" },
                { text: "Documentação Técnica", url: "#", icon: "fas fa-file-code" }
            ]
        }
    ];
    
    // Abrir modal
    portfolioItems.forEach((item, index) => {
        const btnViewDetails = item.querySelector('.portfolio-view-details');
        
        const clickHandler = () => {
            const data = portfolioData[index];
            
            // Preencher modal com dados
            modalTitle.textContent = data.title;
            modalSubtitle.textContent = data.subtitle;
            modalIcon.innerHTML = `<i class="${data.icon}"></i>`;
            modalDescription.textContent = data.description;
            
            // Limpar e preencher galeria
            galleryThumbs.innerHTML = '';
            if (data.images && data.images.length > 0) {
                galleryMain.src = data.images[0];
                galleryMain.alt = data.title;
                
                data.images.forEach((imgSrc, imgIndex) => {
                    const thumb = document.createElement('div');
                    thumb.className = `gallery-thumb ${imgIndex === 0 ? 'active' : ''}`;
                    thumb.innerHTML = `<img src="${imgSrc}" alt="${data.title} - Imagem ${imgIndex + 1}">`;
                    
                    thumb.addEventListener('click', () => {
                        galleryMain.src = imgSrc;
                        document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    });
                    
                    galleryThumbs.appendChild(thumb);
                });
            } else {
                galleryMain.src = '';
                galleryMain.alt = '';
            }
            
            // Limpar e preencher links
            linksContainer.innerHTML = '';
            data.links.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.className = 'link-item';
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
                linkElement.innerHTML = `<i class="${link.icon}"></i> ${link.text}`;
                linksContainer.appendChild(linkElement);
            });
            
            // Limpar e preencher tecnologias
            techTags.innerHTML = '';
            data.technologies.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                techTags.appendChild(tag);
            });
            
            // Limpar e preencher downloads
            downloadsContainer.innerHTML = '';
            data.downloads.forEach(download => {
                const downloadElement = document.createElement('a');
                downloadElement.href = download.url;
                downloadElement.className = 'download-item';
                downloadElement.download = true;
                downloadElement.innerHTML = `<i class="${download.icon}"></i> ${download.text}`;
                downloadsContainer.appendChild(downloadElement);
            });
            
            // Mostrar modal
            portfolioModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        
        // Adicionar evento ao item e ao botão
        item.addEventListener('click', clickHandler);
        if (btnViewDetails) {
            btnViewDetails.addEventListener('click', function(e) {
                e.stopPropagation();
                clickHandler();
            });
        }
    });
    
    // Fechar modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            portfolioModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Fechar modal ao clicar fora
    if (portfolioModal) {
        portfolioModal.addEventListener('click', (e) => {
            if (e.target === portfolioModal) {
                portfolioModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && portfolioModal.classList.contains('active')) {
            portfolioModal.classList.remove('active');
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
        
        // Otimizar carregamento de imagens
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
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
    initExperienceModal();
    initPortfolioModal();
    initIntersectionObserver();
    
    // Inicializar efeitos de mouse
    document.addEventListener('mousemove', updateMousePosition);
    
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
