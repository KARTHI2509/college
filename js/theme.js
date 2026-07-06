// Theme Management, Cursor Glow, Reading Progress & Back to Top

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCursorGlow();
    initReadingProgress();
    initBackToTop();
    initNavbarScroll();
});

// 1. Dark Mode / Light Mode Theme Switching
function initTheme() {
    const themeSwitches = document.querySelectorAll('.theme-switch');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeSwitches.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Dispatch a custom event so other components can respond if needed
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
            
            showToast(`Theme switched to ${newTheme} mode!`, 'success');
        });
    });
}

// 2. Cursor Glow Track (Desktop only)
function initCursorGlow() {
    // Create glow element dynamically if not present
    let glow = document.querySelector('.cursor-glow');
    if (!glow) {
        glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
    }

    document.addEventListener('mousemove', (e) => {
        if (!document.body.classList.contains('mouse-active')) {
            document.body.classList.add('mouse-active');
        }
        // Use requestAnimationFrame for 60fps positioning performance
        window.requestAnimationFrame(() => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
        });
    });

    document.addEventListener('mouseleave', () => {
        document.body.classList.remove('mouse-active');
    });
}

// 3. Reading Progress Indicator
function initReadingProgress() {
    // Create progress bar if not present
    let progress = document.querySelector('.reading-progress');
    if (!progress) {
        progress = document.createElement('div');
        progress.className = 'reading-progress';
        document.body.prepend(progress);
    }

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (docHeight > 0) {
            const percentage = (scrollTop / docHeight) * 100;
            progress.style.width = `${percentage}%`;
        }
    });
}

// 4. Back to Top Button
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 5. Sticky/Transparent Navbar Scroll Animation
function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once at load
}

// Helper to show toasts (reused across validation.js and theme.js)
window.showToast = function(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    // Slide in
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    const closeToast = () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', closeToast);

    // Auto dismiss after 4 seconds
    setTimeout(closeToast, 4000);
};
