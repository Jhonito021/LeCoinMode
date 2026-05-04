let currentProduct = {
    name: '',
    price: 0
};

// Ouvrir le modal de commande
function openOrderModal(productName, productPrice) {
    currentProduct = {
        name: productName,
        price: parseInt(productPrice)
    };
    
    const modal = document.getElementById('orderModal');
    const productNameInput = document.getElementById('productName');
    const unitPriceInput = document.getElementById('unitPrice');
    const quantityInput = document.getElementById('quantity');
    
    productNameInput.value = productName;
    unitPriceInput.value = formatPrice(productPrice) + ' Ar';
    
    // Calculer le prix total initial
    updateTotalPrice();
    
    // Ajouter l'écouteur d'événement pour la quantité
    quantityInput.removeEventListener('input', updateTotalPrice);
    quantityInput.addEventListener('input', updateTotalPrice);
    
    modal.style.display = 'block';
    
    // Empêcher le défilement du body
    document.body.style.overflow = 'hidden';
}

// Fermer le modal
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.style.display = 'none';
    
    // Réactiver le défilement du body
    document.body.style.overflow = 'auto';
    
    // Réinitialiser le formulaire
    document.getElementById('orderForm').reset();
}

// Mettre à jour le prix total
function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const total = quantity * currentProduct.price;
    const totalPriceInput = document.getElementById('totalPrice');
    totalPriceInput.value = formatPrice(total) + ' Ar';
}

// Formater le prix
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(price);
}

// Envoyer la commande via WhatsApp
function sendOrderToWhatsApp() {
    // Récupérer les valeurs du formulaire
    const productName = document.getElementById('productName').value;
    const quantity = document.getElementById('quantity').value;
    const unitPrice = currentProduct.price;
    const totalPrice = quantity * unitPrice;
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const address = document.getElementById('address').value;
    const notes = document.getElementById('notes').value;
    
    // Validation
    if (!customerName) {
        showNotification('Veuillez entrer votre nom', 'error');
        return;
    }
    
    if (!customerPhone) {
        showNotification('Veuillez entrer votre numéro de téléphone', 'error');
        return;
    }
    
    if (!address) {
        showNotification('Veuillez entrer votre adresse de livraison', 'error');
        return;
    }
    
    // Créer le message WhatsApp
    let message = `🛍️ *NOUVELLE COMMANDE* 🛍️%0A%0A`;
    message += `📦 *Produit:* ${productName}%0A`;
    message += `🔢 *Quantité:* ${quantity}%0A`;
    message += `💰 *Prix unitaire:* ${formatPrice(unitPrice)} Ar%0A`;
    message += `💵 *Prix total:* ${formatPrice(totalPrice)} Ar%0A%0A`;
    message += `👤 *Client:* ${customerName}%0A`;
    message += `📞 *Téléphone:* ${customerPhone}%0A`;
    message += `📍 *Adresse:* ${address}%0A`;
    
    if (notes) {
        message += `📝 *Notes:* ${notes}%0A`;
    }
    
    message += `%0A✨ Merci pour votre commande ! ✨`;
    
    // Numéro WhatsApp (sans le +)
    const phoneNumber = '261347786170';
    
    // Ouvrir WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Afficher la notification de succès
    showNotification('Commande envoyée avec succès ! Redirection vers WhatsApp...', 'success');
    
    // Fermer le modal après 1 seconde
    setTimeout(() => {
        closeOrderModal();
    }, 1000);
}

// Afficher une notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    if (type === 'error') {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Fermer le modal en cliquant à l'extérieur
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeOrderModal();
    }
}

// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', function() {
    // Année pour le footer
    document.getElementById('date').textContent = new Date().getFullYear();
    
    // Menu mobile
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Fermer le menu mobile lors du clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // Animation au scroll
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
    
    // Observer les sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Observer les produits
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Empêcher l'envoi du formulaire par Enter
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && document.getElementById('orderModal').style.display === 'block') {
        event.preventDefault();
        sendOrderToWhatsApp();
    }
});

// ===== CAROUSEL FUNCTIONS =====
let currentSlideIndex = 0;
let slideInterval;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

// Démarrer le carousel automatique
function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change toutes les 5 secondes
}

// Arrêter le carousel automatique
function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Changer de slide
function changeSlide(direction) {
    stopAutoSlide();
    
    // Désactiver le slide actuel
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Calculer le nouvel index
    currentSlideIndex += direction;
    
    // Boucler
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    // Activer le nouveau slide
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Redémarrer l'automatique
    startAutoSlide();
}

// Aller à un slide spécifique
function currentSlide(index) {
    stopAutoSlide();
    
    // Désactiver le slide actuel
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Activer le nouveau slide
    currentSlideIndex = index;
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Redémarrer l'automatique
    startAutoSlide();
}

// Pause au survol
function pauseOnHover() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

// Initialisation du carousel
function initCarousel() {
    // S'assurer que le premier slide est actif
    if (slides.length > 0) {
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Démarrer le carousel automatique
        startAutoSlide();
        
        // Activer la pause au survol
        pauseOnHover();
    }
}

// Appeler l'initialisation après le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    // ... (votre code existant)
});

// ===== FILTRAGE DES PRODUITS =====
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Mettre à jour le bouton actif
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // Filtrer les produits
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
            product.style.display = 'none';
        }
    });
}

// ===== RECHERCHE DE PRODUITS =====
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        const description = product.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || searchTerm === '') {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// ===== PANIER DANS LA NAVIGATION =====
let cart = [];

function addToCart(productName, productPrice) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: productName,
            price: parseInt(productPrice),
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification(`${productName} ajouté au panier !`, 'success');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// Initialisation des filtres
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les filtres
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            filterProducts(category);
        });
    });
    
    // Vos autres initialisations existantes...
});

// ===== OPTION DE TRI =====
function sortProducts(criteria) {
    const productsGrid = document.getElementById('productsGrid');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    switch(criteria) {
        case 'price-asc':
            products.sort((a, b) => {
                const priceA = parseInt(a.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
                const priceB = parseInt(b.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            products.sort((a, b) => {
                const priceA = parseInt(a.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
                const priceB = parseInt(b.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
                return priceB - priceA;
            });
            break;
        case 'rating':
            products.sort((a, b) => {
                const ratingA = parseInt(a.querySelector('.product-rating span').textContent);
                const ratingB = parseInt(b.querySelector('.product-rating span').textContent);
                return ratingB - ratingA;
            });
            break;
    }
    
    // Réafficher les produits triés
    products.forEach(product => {
        productsGrid.appendChild(product);
    });
}