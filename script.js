// Variables globales
let currentSlide = 0;
let cart = [];
let cartTotal = 0;

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Inicializar carrusel
    initializeCarousel();
    
    // Inicializar menú móvil
    initializeMobileMenu();
    
    // Inicializar FAQ
    initializeFAQ();
    
    // Inicializar formulario de contacto
    initializeContactForm();
    
    // Inicializar scroll suave
    initializeSmoothScroll();
    
    // Inicializar animaciones
    initializeAnimations();
}

// Carrusel de productos
function initializeCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.product-card');
    const totalSlides = cards.length;
    
    // Auto-rotación del carrusel cada 5 segundos
    setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

function moveCarousel(direction) {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.product-card');
    const totalSlides = cards.length;
    
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    const translateX = -currentSlide * 100;
    track.style.transform = `translateX(${translateX}%)`;
    
    // Actualizar indicadores activos
    updateCarouselIndicators();
}

function updateCarouselIndicators() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.classList.toggle('active', index === currentSlide);
    });
}

// Menú móvil
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// FAQ
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            toggleFAQ(question);
        });
    });
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Cerrar todos los FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Abrir el FAQ clickeado si no estaba activo
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Simulador de ahorro
function calcularAhorro() {
    const consumo = parseFloat(document.getElementById('consumo').value) || 0;
    const tarifa = parseFloat(document.getElementById('tarifa').value) || 0;
    const tipo = document.getElementById('tipo').value;
    
    if (consumo === 0 || tarifa === 0) {
        alert('Por favor, ingresa valores válidos para el consumo y la tarifa.');
        return;
    }
    
    // Cálculos basados en datos reales de energía solar
    const factorEficiencia = tipo === 'residencial' ? 0.8 : tipo === 'comercial' ? 0.85 : 0.9;
    const ahorroMensual = consumo * tarifa * factorEficiencia;
    const ahorroAnual = ahorroMensual * 12;
    
    // Costo estimado del sistema (por kWh de consumo)
    const costoPorKwh = tipo === 'residencial' ? 8000000 : tipo === 'comercial' ? 7000000 : 6000000;
    const costoTotal = consumo * costoPorKwh;
    const retorno = Math.ceil(costoTotal / ahorroAnual);
    
    // CO2 evitado (kg por kWh)
    const co2PorKwh = 0.4;
    const co2Evitado = Math.round(consumo * 12 * co2PorKwh);
    
    // Paneles necesarios (asumiendo 400W por panel)
    const panelesNecesarios = Math.ceil(consumo / 30); // 30 kWh por panel por mes
    
    // Mostrar resultados
    document.getElementById('ahorro-mensual').textContent = `$${ahorroMensual.toLocaleString()}`;
    document.getElementById('ahorro-anual').textContent = `$${ahorroAnual.toLocaleString()}`;
    document.getElementById('retorno').textContent = `${retorno} años`;
    document.getElementById('co2').textContent = `${co2Evitado} kg`;
    document.getElementById('paneles').textContent = `${panelesNecesarios} paneles`;
    
    // Mostrar sección de resultados con animación
    const resultsSection = document.getElementById('simulator-results');
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Carrito de compras
function addToCart(productId, price) {
    const product = getProductInfo(productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showCartSection();
}

function getProductInfo(productId) {
    const products = {
        'kit-basico': { name: 'Kit Básico Residencial' },
        'kit-intermedio': { name: 'Kit Intermedio Residencial' },
        'kit-premium': { name: 'Kit Premium Residencial' }
    };
    return products[productId] || { name: 'Producto' };
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    cartTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Cantidad: ${item.quantity}</p>
                <p>Precio: $${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)">+</button>
                <button onclick="removeFromCart('${item.id}')" class="remove-btn">Eliminar</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotalElement.textContent = cartTotal.toLocaleString();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    
    if (cart.length === 0) {
        hideCartSection();
    }
}

function showCartSection() {
    document.getElementById('cart-section').style.display = 'block';
    document.getElementById('cart-section').scrollIntoView({ behavior: 'smooth' });
}

function hideCartSection() {
    document.getElementById('cart-section').style.display = 'none';
}

// Métodos de pago
function showPaymentForm(method) {
    const modal = document.getElementById('payment-modal');
    const content = document.getElementById('payment-content');
    
    let formHTML = '';
    
    switch(method) {
        case 'tarjeta':
            formHTML = `
                <h3>Pago con Tarjeta</h3>
                <form class="payment-form">
                    <div class="form-group">
                        <label>Número de tarjeta:</label>
                        <input type="text" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="form-group">
                        <label>Fecha de vencimiento:</label>
                        <input type="text" placeholder="MM/AA" required>
                    </div>
                    <div class="form-group">
                        <label>CVV:</label>
                        <input type="text" placeholder="123" required>
                    </div>
                    <div class="form-group">
                        <label>Nombre del titular:</label>
                        <input type="text" placeholder="Nombre completo" required>
                    </div>
                    <button type="submit" class="btn-primary">Procesar Pago</button>
                </form>
            `;
            break;
        case 'nequi':
            formHTML = `
                <h3>Pago con Nequi</h3>
                <div class="nequi-info">
                    <p>Escanea el código QR con tu app Nequi:</p>
                    <div class="qr-code">
                        <img src="https://via.placeholder.com/200x200/25d366/ffffff?text=QR+NEQUI" alt="QR Nequi">
                    </div>
                    <p>O transfiere a:</p>
                    <p><strong>Número: 323 806 2816</strong></p>
                    <p><strong>Valor: $${cartTotal.toLocaleString()}</strong></p>
                </div>
            `;
            break;
        case 'paypal':
            formHTML = `
                <h3>Pago con PayPal</h3>
                <div class="paypal-info">
                    <p>Serás redirigido a PayPal para completar tu pago</p>
                    <p><strong>Total: $${cartTotal.toLocaleString()}</strong></p>
                    <button class="btn-primary" onclick="processPayPalPayment()">Pagar con PayPal</button>
                </div>
            `;
            break;
        case 'transferencia':
            formHTML = `
                <h3>Transferencia Bancaria</h3>
                <div class="transfer-info">
                    <p>Realiza una transferencia a:</p>
                    <p><strong>Banco: Bancolombia</strong></p>
                    <p><strong>Cuenta: 1234567890</strong></p>
                    <p><strong>Titular: Solarix S.A.S.</strong></p>
                    <p><strong>Valor: $${cartTotal.toLocaleString()}</strong></p>
                    <p><em>Envía el comprobante a info@solarix.com</em></p>
                </div>
            `;
            break;
    }
    
    content.innerHTML = formHTML;
    modal.style.display = 'block';
}

function processPayPalPayment() {
    alert('Redirigiendo a PayPal... (Simulación)');
    closeModal();
    // Aquí se integraría con la API de PayPal
}

// Modales
function showProductDetails(productType) {
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');
    
    const productDetails = {
        'monocristalino': {
            title: 'Paneles Monocristalinos',
            description: 'Los paneles monocristalinos ofrecen la mayor eficiencia energética disponible en el mercado. Fabricados con silicio de grado solar de alta pureza, estos paneles son ideales para instalaciones donde el espacio es limitado.',
            features: [
                'Eficiencia del 20-22%',
                'Garantía de 25 años',
                'Vida útil de 30+ años',
                'Excelente rendimiento en condiciones de poca luz',
                'Resistente a condiciones climáticas extremas'
            ],
            price: 'Desde $2,500,000 por panel'
        },
        'policristalino': {
            title: 'Paneles Policristalinos',
            description: 'Los paneles policristalinos ofrecen una excelente relación calidad-precio. Son perfectos para instalaciones residenciales y comerciales donde se busca un balance entre eficiencia y costo.',
            features: [
                'Eficiencia del 15-17%',
                'Garantía de 25 años',
                'Vida útil de 25+ años',
                'Costo más accesible',
                'Buen rendimiento en climas cálidos'
            ],
            price: 'Desde $1,800,000 por panel'
        },
        'almacenamiento': {
            title: 'Sistemas de Almacenamiento',
            description: 'Nuestras baterías de litio te permiten almacenar la energía solar generada durante el día para usarla durante la noche o en días nublados.',
            features: [
                'Capacidad de 5-20 kWh',
                'Garantía de 10 años',
                'Eficiencia del 95%',
                'Control inteligente',
                'Instalación profesional incluida'
            ],
            price: 'Desde $8,000,000'
        },
        'inversor': {
            title: 'Inversores Inteligentes',
            description: 'Los inversores convierten la energía solar de corriente continua a corriente alterna para uso en tu hogar o negocio. Incluyen monitoreo en tiempo real.',
            features: [
                'Eficiencia del 97%',
                'Monitoreo por app móvil',
                'Garantía de 10 años',
                'Protección contra sobrecargas',
                'Fácil instalación y mantenimiento'
            ],
            price: 'Desde $3,500,000'
        }
    };
    
    const product = productDetails[productType];
    
    content.innerHTML = `
        <h2>${product.title}</h2>
        <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="${product.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin: 1rem 0;">
        <p style="margin: 1rem 0; color: #666;">${product.description}</p>
        <h3>Características:</h3>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            ${product.features.map(feature => `<li style="margin: 0.5rem 0;">${feature}</li>`).join('')}
        </ul>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
            <strong style="color: #28a745; font-size: 1.2rem;">${product.price}</strong>
        </div>
        <button class="btn-primary" onclick="closeModal(); scrollToSection('contacto')">Solicitar Cotización</button>
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
    document.getElementById('payment-modal').style.display = 'none';
}

// Scroll suave
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Formulario de contacto
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simular envío del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Mostrar mensaje de confirmación
        alert('¡Gracias por tu consulta! Nos pondremos en contacto contigo pronto.');
        
        // Limpiar formulario
        form.reset();
        
        // Aquí se enviaría la información al servidor
        console.log('Datos del formulario:', data);
    });
}

// Animaciones
function initializeAnimations() {
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.product-card, .step, .purchase-card, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Funciones de utilidad
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const productModal = document.getElementById('product-modal');
    const paymentModal = document.getElementById('payment-modal');
    
    if (event.target === productModal) {
        productModal.style.display = 'none';
    }
    if (event.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
}

// Efectos de scroll para el header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(30, 60, 114, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Validación de formularios
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9+\-\s()]+$/;
    return re.test(phone) && phone.length >= 10;
}

// Mensajes de notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// CSS para animaciones de notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
