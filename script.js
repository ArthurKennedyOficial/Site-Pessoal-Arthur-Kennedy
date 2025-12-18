// Variáveis globais para o Three.js
let scene, camera, renderer, stars, glbModel;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Variáveis para o carrossel
let currentPortfolioIndex = 0;
let portfolioItemsPerView = 3;
let isScrolling = false;

// Inicialização do Three.js para o fundo (estrelas e modelo GLB)
function initSpaceBackground() {
    // Cena
    scene = new THREE.Scene();
    
    // Câmera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 100;
    
    // Renderizador
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('spaceCanvas'), 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Definir fundo preto (skybox removida)
    scene.background = new THREE.Color(0x000000);
    
    // Criar estrelas
    createStars();
    
    // Adicionar luz básica
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    
    // Adicionar luz direcional para o modelo GLB
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Carregar modelo GLB (opcional)
    loadGLBModel();
    
    // Event listeners
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Iniciar animação
    animateSpace();
}

// Criar estrelas
function createStars() {
    const starCount = 5000; // Reduzido para melhor performance
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        // Posições aleatórias em uma esfera grande
        const radius = 2000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const i3 = i * 3;
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Cores em tons de cinza
        const intensity = 0.5 + Math.random() * 0.5;
        colors[i3] = intensity;
        colors[i3 + 1] = intensity;
        colors[i3 + 2] = intensity;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.9
    });
    
    stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

// Carregar modelo GLB (opcional - fallback se não existir)
function loadGLBModel() {
    const loader = new THREE.GLTFLoader();
    
    // Tentar carregar o modelo GLB
    loader.load('model.glb', 
        // Sucesso
        function(gltf) {
            glbModel = gltf.scene;
            
            // Ajustar escala e posição
            glbModel.scale.set(50, 50, 50);
            glbModel.position.set(0, 0, 0);
            glbModel.rotation.set(0, 0, 0);
            
            // Adicionar à cena
            scene.add(glbModel);
            
            console.log('Modelo GLB carregado com sucesso');
        },
        // Progresso
        undefined,
        // Erro - não faz nada, apenas não carrega o modelo
        function(error) {
            console.log('Modelo GLB não encontrado. Continuando sem modelo.');
        }
    );
}

// Animação do fundo do espaço
function animateSpace() {
    requestAnimationFrame(animateSpace);
    
    // Rotação suave das estrelas
    if (stars) {
        stars.rotation.y += 0.0001; // Reduzido para melhor performance
        stars.rotation.x += 0.00005;
    }
    
    // Rotação do modelo GLB se existir
    if (glbModel) {
        glbModel.rotation.y += 0.0001;
        glbModel.rotation.x += 0.0000;
    }
    
    // Movimento da câmera baseado no mouse (sutil)
    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05; // Reduzido
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Evento de movimento do mouse
function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 150; // Reduzido
    mouseY = (event.clientY - windowHalfY) / 150;
}

// Evento de redimensionamento da janela
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    // Atualizar câmera e renderizador do fundo
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===== FUNÇÕES DO SITE =====

// Função para rolagem suave
function smoothScrollTo(targetId, duration = 1200) {
    if (isScrolling) return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    isScrolling = true;
    
    // Calcular posição de destino
    const targetPosition = targetElement.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        
        // Usar função de easing para suavidade
        const ease = easeInOutCubic(Math.min(timeElapsed / duration, 1));
        const run = startPosition + distance * ease;
        
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            isScrolling = false;
        }
    }
    
    // Função de easing cúbica
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    requestAnimationFrame(animation);
}

function initPortfolioCarousel() {
    const carousel = document.querySelector('.portfolio-carousel');
    const items = document.querySelectorAll('.portfolio-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (!carousel || items.length === 0) return;
    
    // Calcular o número máximo de slides baseado na largura da tela
    function getItemsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1200) return 2;
        return 3;
    }
    
    function updateCarousel() {
        portfolioItemsPerView = getItemsPerView();
        const itemWidth = 100 / portfolioItemsPerView;
        const translateX = -currentPortfolioIndex * itemWidth;
        
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar dots ativos
        const maxDots = Math.max(0, Math.ceil(items.length / portfolioItemsPerView) - 1);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPortfolioIndex && index <= maxDots);
            dot.style.display = index <= maxDots ? 'block' : 'none';
        });
        
        // Esconder/mostrar botões baseado na posição atual
        prevBtn.style.opacity = currentPortfolioIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentPortfolioIndex === 0 ? 'not-allowed' : 'pointer';
        
        const maxIndex = Math.max(0, Math.ceil(items.length / portfolioItemsPerView) - 1);
        nextBtn.style.opacity = currentPortfolioIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.cursor = currentPortfolioIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }
    
    function nextSlide() {
        const maxIndex = Math.max(0, Math.ceil(items.length / portfolioItemsPerView) - 1);
        
        if (currentPortfolioIndex < maxIndex) {
            currentPortfolioIndex++;
            updateCarousel();
        }
    }
    
    function prevSlide() {
        if (currentPortfolioIndex > 0) {
            currentPortfolioIndex--;
            updateCarousel();
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            currentPortfolioIndex = parseInt(this.getAttribute('data-index'));
            updateCarousel();
        });
    });
    
    // Atualizar carrossel no redimensionamento da janela
    window.addEventListener('resize', updateCarousel);
    
    // Inicializar carrossel
    updateCarousel();
}

// Modal da logo
function initLogoModal() {
    const logoLink = document.getElementById('logoLink');
    const logoModal = document.getElementById('logoModal');
    const closeModal = document.querySelector('.logo-modal-close');
    
    if (!logoLink || !logoModal) return;
    
    // Abrir modal
    logoLink.addEventListener('click', function(e) {
        e.preventDefault();
        logoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impedir scroll
    });
    
    // Fechar modal com X
    closeModal.addEventListener('click', function() {
        logoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Fechar modal ao clicar fora
    logoModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && logoModal.classList.contains('active')) {
            logoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Esconder tela de loading após 2 segundos
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(function() {
            loadingScreen.style.visibility = 'hidden';
        }, 1000);
    }, 2000);
    
    // Menu mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
                
            // Alternar scroll do body
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
    
    // Fechar menu ao clicar em um link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            document.body.style.overflow = 'auto';
        });
    });
    
    // Navegação suave para setas
    const scrollDownButtons = document.querySelectorAll('.scroll-down');
    scrollDownButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Usar rolagem suave personalizada para setas
            smoothScrollTo(targetId, 1000);
        });
    });
    
    // Navegação suave para links do menu (mantém comportamento padrão)
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Fechar menu mobile se estiver aberto
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
            }
            
            // Usar rolagem nativa para links do menu
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Animação de digitação do nome
    const nameElement = document.getElementById('typed-name');
    const subtitleElement = document.getElementById('typed-subtitle');
    const nameText = "Arthur Kennedy De Faria";
    const subtitleText = "Gestor de Tráfego, Gestor de E-commerce, Desenvolvedor Web e TI";
    
    if (nameElement) {
        nameElement.textContent = "";
        subtitleElement.textContent = "";
        
        // Digitar nome
        typeText(nameElement, nameText, 0, function() {
            // Após digitar o nome, começar a digitar o subtítulo
            setTimeout(() => {
                typeText(subtitleElement, subtitleText, 0);
            }, 300);
        });
    }
    
    function typeText(element, text, index, callback) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(function() {
                typeText(element, text, index + 1, callback);
            }, 50);
        } else if (callback) {
            callback();
        }
    }
    
    // Observar elementos para animação de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    document.querySelectorAll('.timeline-content, .skill-category, .portfolio-item').forEach(el => {
        observer.observe(el);
    });
    
    // Inicializar Three.js
    initSpaceBackground();
    
    // Inicializar carrossel do portfólio
    initPortfolioCarousel();
    
    // Inicializar modal da logo
    initLogoModal();
    
    // Corrigir altura das seções para evitar sobreposição do footer
    function adjustSectionHeights() {
        const sections = document.querySelectorAll('section');
        const viewportHeight = window.innerHeight;
        
        sections.forEach(section => {
            if (section.offsetHeight < viewportHeight) {
                section.style.minHeight = `${viewportHeight}px`;
            }
        });
    }
    
    // Ajustar alturas inicialmente e no redimensionamento
    adjustSectionHeights();
    window.addEventListener('resize', adjustSectionHeights);
    
    // Garantir que o footer seja visível
    function ensureFooterVisibility() {
        const footer = document.querySelector('footer');
        const bodyHeight = document.body.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        if (bodyHeight < viewportHeight) {
            footer.style.position = 'absolute';
            footer.style.bottom = '0';
            footer.style.width = '100%';
        } else {
            footer.style.position = 'relative';
        }
    }
    
    ensureFooterVisibility();
    window.addEventListener('resize', ensureFooterVisibility);
});

// Melhorar performance no scroll
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            scrollTimeout = null;
            // Atualizar elementos visíveis
            const scrollPos = window.scrollY;
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop - 100 && scrollPos < sectionTop + sectionHeight - 100) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        }, 100);
    }
});