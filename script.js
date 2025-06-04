// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Local Storage Keys
const USERS_KEY = 'pandaUsers';
const CURRENT_USER_KEY = 'currentUser';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    addEventListeners();
    addAnimations();
});

// Initialize Application
function initializeApp() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser && window.location.pathname.includes('index.html')) {
        updateNavForLoggedInUser(currentUser);
    }
    
    // Initialize users array if it doesn't exist
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([]));
    }
}

// Event Listeners
function addEventListeners() {
    // Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup Form
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Smooth scrolling for anchor links
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
    
    // Add hover effects to buttons
    addButtonEffects();
    
    // Add form input animations
    addInputAnimations();
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate inputs
    if (!username || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Get users from localStorage
    const users = getUsers();
    
    // Find user
    const user = users.find(u => u.email === username && u.password === password);
    
    if (user) {
        // Login successful
        setCurrentUser(user, remember);
        showMessage('Login successful! Redirecting...', 'success');
        
        // Add loading animation to button
        const submitBtn = loginForm.querySelector('.btn-submit');
        submitBtn.innerHTML = '<span class="loading"></span> Signing In...';
        submitBtn.disabled = true;
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        showMessage('Invalid username or password', 'error');
        addShakeAnimation(loginForm);
    }
}

// Handle Signup
function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(signupForm);
    const fullname = formData.get('fullname');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // Validate inputs
    if (!fullname || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        addShakeAnimation(signupForm);
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Check if user already exists
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        showMessage('User with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        fullname,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Show success message
    showMessage('Account created successfully! Redirecting to login...', 'success');
    
    // Add loading animation to button
    const submitBtn = signupForm.querySelector('.btn-submit');
    submitBtn.innerHTML = '<span class="loading"></span> Creating Account...';
    submitBtn.disabled = true;
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Password Toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

// Utility Functions
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
}

function setCurrentUser(user, remember = false) {
    if (remember) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
}

function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'login.html';
}

function updateNavForLoggedInUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <span class="user-welcome">Welcome, ${user.fullname}!</span>
            <button onclick="logout()" class="btn-login">Logout</button>
        `;
    }
}

// Show Message
function showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert message
    const form = document.querySelector('.form');
    if (form) {
        form.insertBefore(message, form.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// Add shake animation to form
function addShakeAnimation(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Button Effects
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-submit, .btn-login, .btn-signup');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
    });
}

// Input Animations
function addInputAnimations() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

// Add Animations
function addAnimations() {
    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('body::after');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .hero-text, .hero-image');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
    
    // Panda character interactions
    const pandaCharacter = document.querySelector('.panda-character');
    if (pandaCharacter) {
        pandaCharacter.addEventListener('click', function() {
            this.style.animation = 'bounce 0.6s ease-in-out';
            setTimeout(() => {
                this.style.animation = 'wiggle 4s ease-in-out infinite';
            }, 600);
        });
    }
    
    // Social icons hover effects
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Add shake animation keyframes
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Inject shake animation
const style = document.createElement('style');
style.textContent = shakeKeyframes;
document.head.appendChild(style);

// Form validation with real-time feedback
function addRealTimeValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('input', function() {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
            this.style.borderColor = isValid ? '#4caf50' : '#f44336';
        });
    });
    
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            const isValid = this.value.length >= 6;
            this.style.borderColor = isValid ? '#4caf50' : '#f44336';
        });
    });
}

// Initialize real-time validation
document.addEventListener('DOMContentLoaded', addRealTimeValidation);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key on forms
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const form = e.target.closest('form');
        if (form) {
            const submitBtn = form.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }
    
    // Escape key to clear messages
    if (e.key === 'Escape') {
        const message = document.querySelector('.message');
        if (message) {
            message.remove();
        }
    }
});

// Auto-save form data (except passwords)
function autoSaveFormData() {
    const inputs = document.querySelectorAll('input:not([type="password"])');
    
    inputs.forEach(input => {
        // Load saved data
        const savedValue = localStorage.getItem(`form_${input.name}`);
        if (savedValue && input.type !== 'checkbox') {
            input.value = savedValue;
        }
        
        // Save data on input
        input.addEventListener('input', function() {
            if (this.type !== 'password') {
                localStorage.setItem(`form_${this.name}`, this.value);
            }
        });
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', autoSaveFormData);

// Clear auto-saved data on successful form submission
function clearAutoSavedData(form) {
    const inputs = form.querySelectorAll('input:not([type="password"])');
    inputs.forEach(input => {
        localStorage.removeItem(`form_${input.name}`);
    });
}

// Add to form submission handlers
if (loginForm) {
    loginForm.addEventListener('submit', function() {
        setTimeout(() => clearAutoSavedData(this), 100);
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', function() {
        setTimeout(() => clearAutoSavedData(this), 100);
    });
}