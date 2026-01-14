
const CONFIG = {
    
    emailjs: {
        publicKey: process.env.publicKey,
        serviceID:  process.env.serviceID,
        templateID:  process.env.templateID,
        enabled: true
    },
    
   
    gemini: {
        apiKey: 'AIzaSyCHUL_A6o_qcAsPOhsxaecdC1rz5Wni5M', 
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        enabled: true 
    },
    
  
    storage: {
        userPrefix: 'cg_user_',
        settingsKey: 'cg_settings'
    }
};


CONFIG.gemini.enabled = CONFIG.gemini.apiKey.length > 0;

// =========================================
// UTILITY FUNCTIONS
// =========================================

/**
 * Debounce для оптимизации событий
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * RAF Throttle для плавной анимации
 */
function rafThrottle(callback) {
    let rafId = null;
    return function(...args) {
        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                callback.apply(this, args);
                rafId = null;
            });
        }
    };
}

/**
 * Sanitize HTML
 */
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Validate email
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Generate unique ID
 */
function generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// =========================================
// TOAST NOTIFICATION SYSTEM
// =========================================
class Toast {
    static show(message, type = 'info', duration = 3000) {
        const existing = document.querySelector('.cg-toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = `cg-toast cg-toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 99999;
            font-weight: 600;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// =========================================
// LOCAL STORAGE MANAGER
// =========================================
class StorageManager {
    static saveUser(userData) {
        try {
            const userId = generateId();
            const safeData = {
                id: userId,
                name: userData.name,
                surname: userData.surname,
                nickname: userData.nickname,
                email: userData.email,
                // Пароль НЕ сохраняем (даже хешированный)
                registeredAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            localStorage.setItem(
                `${CONFIG.storage.userPrefix}${userId}`, 
                JSON.stringify(safeData)
            );
            
            // Сохраняем ID текущего пользователя
            localStorage.setItem('cg_current_user', userId);
            
            return userId;
        } catch (error) {
            console.error('Storage error:', error);
            return null;
        }
    }
    
    static getCurrentUser() {
        try {
            const userId = localStorage.getItem('cg_current_user');
            if (!userId) return null;
            
            const data = localStorage.getItem(`${CONFIG.storage.userPrefix}${userId}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }
    
    static updateLastLogin() {
        try {
            const user = this.getCurrentUser();
            if (user) {
                user.lastLogin = new Date().toISOString();
                localStorage.setItem(
                    `${CONFIG.storage.userPrefix}${user.id}`, 
                    JSON.stringify(user)
                );
            }
        } catch (error) {
            console.error('Update login error:', error);
        }
    }
    
    static logout() {
        localStorage.removeItem('cg_current_user');
        Toast.show('Logged out successfully', 'info');
    }
    
    static getAllUsers() {
        const users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(CONFIG.storage.userPrefix)) {
                try {
                    const user = JSON.parse(localStorage.getItem(key));
                    users.push(user);
                } catch (e) {
                    console.error('Parse error:', e);
                }
            }
        }
        return users;
    }
}

// =========================================
// RATE LIMITER
// =========================================
class RateLimiter {
    constructor(maxRequests, windowMs, storageKey) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.storageKey = storageKey;
    }
    
    canMakeRequest() {
        const now = Date.now();
        let requests = this.getRequests();
        
        // Очистить старые запросы
        requests = requests.filter(time => now - time < this.windowMs);
        
        if (requests.length < this.maxRequests) {
            requests.push(now);
            this.saveRequests(requests);
            return true;
        }
        
        return false;
    }
    
    getWaitTime() {
        const requests = this.getRequests();
        if (requests.length === 0) return 0;
        
        const oldest = Math.min(...requests);
        const wait = this.windowMs - (Date.now() - oldest);
        return Math.ceil(wait / 1000);
    }
    
    getRequests() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }
    
    saveRequests(requests) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(requests));
        } catch (e) {
            console.error('Rate limiter storage error:', e);
        }
    }
}

const aiRateLimiter = new RateLimiter(10, 60000, 'cg_ai_rate_limit');
const emailRateLimiter = new RateLimiter(3, 300000, 'cg_email_rate_limit'); // 3 emails per 5 min

// =========================================
// FORM VALIDATION & REGISTRATION
// =========================================
class RegistrationForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.fields = {
            name: this.form.querySelector('#name-inp'),
            surname: this.form.querySelector('#surname-inp'),
            nickname: this.form.querySelector('#nickname-inp'),
            email: this.form.querySelector('#email-inp'),
            password: this.form.querySelector('#password-inp')
        };
        
        this.submitBtn = this.form.querySelector('#but-inpform');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Real-time validation
        this.fields.email?.addEventListener('blur', () => this.validateEmail());
        this.fields.password?.addEventListener('input', () => this.validatePassword());
        this.fields.nickname?.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
        });
    }
    
    validateEmail() {
        const email = this.fields.email.value.trim();
        if (!email) return false;
        
        if (!isValidEmail(email)) {
            this.showError(this.fields.email, 'Invalid email format');
            return false;
        }
        
        this.clearError(this.fields.email);
        return true;
    }
    
    validatePassword() {
        const password = this.fields.password.value;
        if (!password) return false;
        
        if (password.length < 6) {
            this.showError(this.fields.password, 'Password must be at least 6 characters');
            return false;
        }
        
        this.clearError(this.fields.password);
        return true;
    }
    
    showError(field, message) {
        field.style.borderColor = '#dc3545';
        
        let errorEl = field.nextElementSibling;
        if (!errorEl?.classList.contains('field-error')) {
            errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            errorEl.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;';
            field.parentNode.insertBefore(errorEl, field.nextSibling);
        }
        errorEl.textContent = message;
    }
    
    clearError(field) {
        field.style.borderColor = '';
        const errorEl = field.nextElementSibling;
        if (errorEl?.classList.contains('field-error')) {
            errorEl.remove();
        }
    }
    
    async handleSubmit() {
        const userData = {
            name: this.fields.name.value.trim(),
            surname: this.fields.surname.value.trim(),
            nickname: this.fields.nickname.value.trim(),
            email: this.fields.email.value.trim(),
            password: this.fields.password.value
        };
        
        // Validation
        if (!userData.name || !userData.email || !userData.password) {
            Toast.show('Please fill in all required fields', 'error');
            return;
        }
        
        if (!this.validateEmail() || !this.validatePassword()) {
            return;
        }
        
        // Check rate limit
        if (!emailRateLimiter.canMakeRequest()) {
            const wait = emailRateLimiter.getWaitTime();
            Toast.show(`Please wait ${wait}s before registering again`, 'warning');
            return;
        }
        
        this.setLoading(true);
        
        try {
            // 1. Save to localStorage first
            const userId = StorageManager.saveUser(userData);
            
            if (!userId) {
                throw new Error('Failed to save user data');
            }
            
            // 2. Try to send email (optional, can fail)
            if (CONFIG.emailjs.enabled) {
                try {
                    await this.sendEmail(userData);
                    Toast.show('✅ Registration successful! Check your email.', 'success');
                } catch (emailError) {
                    console.warn('Email sending failed:', emailError);
                    Toast.show('✅ Registered! (Email notification failed)', 'warning');
                }
            } else {
                Toast.show('✅ Registration successful!', 'success');
            }
            
            // 3. Reset form and close modal
            this.form.reset();
            setTimeout(() => {
                const modal = document.getElementById('signin-box');
                if (modal) modal.style.display = 'none';
            }, 2000);
            
        } catch (error) {
            console.error('Registration error:', error);
            Toast.show('❌ Registration failed. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    async sendEmail(userData) {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS not loaded');
        }
        
        const emailData = {
            user_name: userData.name,
            user_surname: userData.surname,
            user_nickname: userData.nickname,
            user_email: userData.email,
            registration_date: new Date().toLocaleString()
        };
        
        return await emailjs.send(
            CONFIG.emailjs.serviceID,
            CONFIG.emailjs.templateID,
            emailData
        );
    }
    
    setLoading(isLoading) {
        if (this.submitBtn) {
            this.submitBtn.disabled = isLoading;
            this.submitBtn.textContent = isLoading ? 'Sending...' : 'Submit';
        }
    }
}

// =========================================
// AI CHAT (Gemini)
// =========================================
class AIChat {
    constructor() {
        this.elements = {
            toggleBtn: document.getElementById('ai-toggle-btn'),
            chatBox: document.getElementById('ai-chat-box'),
            closeBtn: document.getElementById('ai-close-btn'),
            sendBtn: document.getElementById('ai-send-btn'),
            input: document.getElementById('ai-input'),
            messages: document.getElementById('ai-messages')
        };
        
        if (!this.elements.toggleBtn) return;
        
        this.init();
    }
    
    init() {
        this.elements.toggleBtn.addEventListener('click', () => this.toggle());
        this.elements.closeBtn?.addEventListener('click', () => this.close());
        this.elements.sendBtn?.addEventListener('click', () => this.send());
        this.elements.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.send();
            }
        });
    }
    
    toggle() {
        const isVisible = this.elements.chatBox.style.display === 'flex';
        this.elements.chatBox.style.display = isVisible ? 'none' : 'flex';
        
        if (!isVisible) {
            this.elements.input?.focus();
            
            if (!CONFIG.gemini.enabled) {
                this.addMessage(
                    '⚠️ AI Chat is not configured.\n\n' +
                    'To enable:\n' +
                    '1. Get API key from https://makersuite.google.com/app/apikey\n' +
                    '2. Add it to CONFIG.gemini.apiKey in the code\n' +
                    '3. Set domain restrictions in Google Cloud Console',
                    'ai-msg'
                );
            }
        }
    }
    
    close() {
        this.elements.chatBox.style.display = 'none';
    }
    
    async send() {
        const text = this.elements.input.value.trim();
        if (!text) return;
        
        if (!CONFIG.gemini.enabled) {
            Toast.show('AI Chat is not configured', 'warning');
            return;
        }
        
        if (!aiRateLimiter.canMakeRequest()) {
            const wait = aiRateLimiter.getWaitTime();
            Toast.show(`Rate limit: wait ${wait}s`, 'warning');
            return;
        }
        
        this.addMessage(text, 'user-msg');
        this.elements.input.value = '';
        
        const loaderId = `loader-${Date.now()}`;
        this.addMessage('Thinking...', 'ai-msg', loaderId);
        
        try {
            const response = await this.callGemini(text);
            document.getElementById(loaderId)?.remove();
            
            if (response) {
                this.addMessage(response, 'ai-msg');
            }
        } catch (error) {
            document.getElementById(loaderId)?.remove();
            console.error('AI Error:', error);
            
            let errorMsg = '❌ Sorry, something went wrong.';
            if (error.message.includes('API key')) {
                errorMsg = '❌ Invalid API key. Please check your configuration.';
            } else if (error.message.includes('quota')) {
                errorMsg = '❌ API quota exceeded. Try again later.';
            }
            
            this.addMessage(errorMsg, 'ai-msg');
        }
    }
    
    async callGemini(text) {
        const url = `${CONFIG.gemini.apiUrl}?key=${CONFIG.gemini.apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text }]
                }]
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            let botResponse = data.candidates[0].content.parts[0].text;
            // Format markdown
            botResponse = botResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return botResponse;
        }
        
        return null;
    }
    
    addMessage(text, className, id = null) {
        const div = document.createElement('div');
        div.className = `message ${className}`;
        if (id) div.id = id;
        
        // Sanitize user input
        if (className === 'user-msg') {
            div.textContent = text;
        } else {
            div.innerHTML = text;
        }
        
        this.elements.messages.appendChild(div);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }
}

// =========================================
// UI ENHANCEMENTS
// =========================================

function init3DEffects() {
    const cards = document.querySelectorAll('.fram');
    
    cards.forEach(card => {
        const handleMove = rafThrottle((e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const rotateX = (y - 0.5) * 15;
            const rotateY = (x - 0.5) * -15;
            
            card.style.transform = 
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

function initCodeCopy() {
    document.querySelectorAll('.code-area').forEach(area => {
        const btn = document.createElement('button');
        btn.textContent = 'Copy';
        btn.className = 'copy-code-btn';
        
        btn.onclick = async () => {
            try {
                await navigator.clipboard.writeText(area.value);
                btn.textContent = '✓ Copied!';
                setTimeout(() => btn.textContent = 'Copy', 2000);
            } catch {
                area.select();
                document.execCommand('copy');
                btn.textContent = '✓ Copied!';
                setTimeout(() => btn.textContent = 'Copy', 2000);
            }
        };
        
        area.parentNode.insertBefore(btn, area.nextSibling);
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section, .fram').forEach(el => {
        observer.observe(el);
    });
}

function initModals() {
    const signinBtn = document.getElementById('sign-in');
    const signinBox = document.getElementById('signin-box');
    const closeBtn = document.getElementById('close');
    
    signinBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (signinBox) {
            signinBox.style.display = signinBox.style.display === 'flex' ? 'none' : 'flex';
        }
    });
    
    closeBtn?.addEventListener('click', () => {
        if (signinBox) signinBox.style.display = 'none';
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && signinBox?.style.display === 'flex') {
            signinBox.style.display = 'none';
        }
    });
}

// =========================================
// MAIN INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌌 Code Galaxy - Frontend Only Mode');
    
    // Add animations CSS
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
    
    // Initialize EmailJS
    if (CONFIG.emailjs.enabled && typeof emailjs !== 'undefined') {
        emailjs.init(CONFIG.emailjs.publicKey);
        console.log('✅ EmailJS initialized');
    } else {
        console.warn('⚠️ EmailJS not available');
    }
    
    // Initialize features
    initModals();
    new RegistrationForm('input-form');
    new AIChat();
    init3DEffects();
    initCodeCopy();
    initScrollAnimations();
    
    // Check for returning user
    const currentUser = StorageManager.getCurrentUser();
    if (currentUser) {
        console.log('👋 Welcome back,', currentUser.name);
        StorageManager.updateLastLogin();
    }
    
    // Status
    console.log('📧 Email:', CONFIG.emailjs.enabled ? '✅' : '❌');
    console.log('🤖 AI Chat:', CONFIG.gemini.enabled ? '✅' : '❌');
    console.log('✅ Ready!');
});

// =========================================
// EXPORT FOR DEBUGGING
// =========================================
window.CodeGalaxy = {
    config: CONFIG,
    storage: StorageManager,
    toast: Toast,
    getCurrentUser: () => StorageManager.getCurrentUser(),
    logout: () => StorageManager.logout(),
    getAllUsers: () => StorageManager.getAllUsers()
};

console.log('💡 Debug: Use window.CodeGalaxy in console');