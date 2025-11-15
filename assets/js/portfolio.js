// ===================================
// Navigation Scroll Effect
// ===================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===================================
// Mobile Menu Toggle
// ===================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===================================
// Smooth Scrolling
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Scroll Animations (Intersection Observer)
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
const animateElements = document.querySelectorAll('.project-card, .blog-card, .stat-card, .skill-tag');
animateElements.forEach(el => {
    el.setAttribute('data-animate', '');
    observer.observe(el);
});

// ===================================
// Stats Counter Animation
// ===================================
const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('counted')) {
                statNumber.classList.add('counted');
                animateCounter(statNumber);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// ===================================
// Scroll to Top Button
// ===================================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// Active Navigation Link
// ===================================
const sections = document.querySelectorAll('section[id]');

const highlightNavigation = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = 'var(--primary-color)';
            } else {
                navLink.style.color = '';
            }
        }
    });
};

window.addEventListener('scroll', highlightNavigation);
window.addEventListener('load', highlightNavigation);

// ===================================
// Typing Effect (Optional)
// ===================================
const createTypingEffect = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';

    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };

    type();
};

// ===================================
// Particle Background (Optional)
// ===================================
const createParticles = () => {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 4 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.background = 'var(--primary-color)';
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random() * 0.5;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particlesContainer.appendChild(particle);
    }

    // Add keyframes for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translate(0, 0);
            }
            25% {
                transform: translate(10px, -10px);
            }
            50% {
                transform: translate(-10px, -20px);
            }
            75% {
                transform: translate(-5px, -10px);
            }
        }
    `;
    document.head.appendChild(style);
};

// Initialize particles
createParticles();

// ===================================
// Email Copy Functionality (Optional)
// ===================================
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const email = link.getAttribute('href').replace('mailto:', '');

        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                // Create a temporary tooltip
                const tooltip = document.createElement('span');
                tooltip.textContent = '이메일이 복사되었습니다!';
                tooltip.style.position = 'absolute';
                tooltip.style.background = 'var(--primary-color)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '8px 12px';
                tooltip.style.borderRadius = '6px';
                tooltip.style.fontSize = '0.875rem';
                tooltip.style.zIndex = '9999';
                tooltip.style.whiteSpace = 'nowrap';

                link.parentElement.style.position = 'relative';
                link.parentElement.appendChild(tooltip);

                setTimeout(() => {
                    tooltip.remove();
                }, 2000);
            });
        }
    });
});

// ===================================
// Form Validation (if you add a contact form)
// ===================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.email || !data.message) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('올바른 이메일 주소를 입력해주세요.');
            return;
        }

        // Here you would normally send the data to a server
        console.log('Form data:', data);
        alert('메시지가 전송되었습니다!');
        contactForm.reset();
    });
}

// ===================================
// Performance Optimization
// ===================================
// Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===================================
// Console Easter Egg
// ===================================
console.log(
    '%c👋 안녕하세요!',
    'color: #6366f1; font-size: 24px; font-weight: bold;'
);
console.log(
    '%c제 포트폴리오에 관심을 가져주셔서 감사합니다!\n코드가 궁금하시다면 GitHub에서 확인해보세요: https://github.com/GooDongWoo',
    'color: #8b5cf6; font-size: 14px;'
);

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully! 🚀');

    // Add any initialization code here
    highlightNavigation();

    // Prevent FOUC (Flash of Unstyled Content)
    document.body.style.opacity = '1';
});

// ===================================
// Dark Mode Toggle (Optional Enhancement)
// ===================================
const createDarkModeToggle = () => {
    const toggle = document.createElement('button');
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    toggle.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.25rem;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 999;
        transition: all 0.3s ease;
    `;

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = toggle.querySelector('i');
        icon.className = document.body.classList.contains('dark-mode')
            ? 'fas fa-sun'
            : 'fas fa-moon';
    });

    // Uncomment to enable dark mode toggle
    // document.body.appendChild(toggle);
};

// createDarkModeToggle();
