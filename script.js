// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'linear-gradient(135deg, rgba(30, 60, 114, 0.98) 0%, rgba(42, 82, 152, 0.98) 100%)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, rgba(30, 60, 114, 0.95) 0%, rgba(42, 82, 152, 0.95) 100%)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    }
});

// Product Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        productCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Image lazy loading and loading animation
const productImages = document.querySelectorAll('.product-img');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loading');
            
            // Simulate loading delay for better UX
            setTimeout(() => {
                img.classList.remove('loading');
            }, 300);
            
            observer.unobserve(img);
        }
    });
});

productImages.forEach(img => {
    imageObserver.observe(img);
});

// Product view and quote functions
function viewProduct(productId) {
    // Create modal for product view
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="img/${productId.split('-')[1]}.jpg" alt="Product Image" class="modal-img">
                </div>
                <div class="modal-info">
                    <h3>Product Details</h3>
                    <p>Contact us for detailed specifications and bulk pricing</p>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="requestQuote('${productId}')">Get Quote</button>
                        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
}

function requestQuote(productId) {
    // Scroll to contact form and pre-fill with product info
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
    
    // Pre-fill the contact form
    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');
    
    if (serviceSelect) {
        serviceSelect.value = productId.split('-')[0];
    }
    
    if (messageTextarea) {
        messageTextarea.value = `I'm interested in getting a quote for ${productId}. Please provide detailed pricing and specifications.`;
    }
    
    // Show notification
    showNotification('Contact form pre-filled! Please provide your details for a detailed quote.', 'success');
}

function closeModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !service || !message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS for modal and notifications
const style = document.createElement('style');
style.textContent = `
    .gallery-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        background: white;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    .close-modal {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 2rem;
        color: white;
        cursor: pointer;
        z-index: 10001;
        background: rgba(0, 0, 0, 0.5);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    }
    
    .close-modal:hover {
        background: rgba(0, 0, 0, 0.8);
    }
    
    .modal-img {
        width: 100%;
        height: auto;
        max-height: 70vh;
        object-fit: contain;
    }
    
    .modal-info {
        padding: 2rem;
        text-align: center;
    }
    
    .modal-info h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }
    
    .modal-info p {
        color: #666;
        font-size: 1.1rem;
    }
    
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #27ae60;
    }
    
    .notification-error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification-info {
        border-left: 4px solid #3498db;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        padding: 1rem 1.5rem;
        gap: 1rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification-success .notification-content i {
        color: #27ae60;
    }
    
    .notification-error .notification-content i {
        color: #e74c3c;
    }
    
    .notification-info .notification-content i {
        color: #3498db;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @media (max-width: 768px) {
        .modal-content {
            max-width: 95%;
            max-height: 95%;
        }
        
        .modal-info {
            padding: 1rem;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.feature, .category, .gallery-item, .contact-item').forEach(el => {
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.classList.contains('btn-primary') || this.classList.contains('btn-secondary')) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
});

// Add ripple effect CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth reveal animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Reveal sections on scroll
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Preload critical images
    const criticalImages = ['img/1.jpg', 'img/2.jpg', 'img/logo.png'];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.gallery-modal');
        if (modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    }
});

// Add focus management for better accessibility
document.querySelectorAll('.gallery-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    });
});

console.log('RK Marbles & Granites website loaded successfully!');
