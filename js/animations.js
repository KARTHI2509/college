// Scroll Reveal, Counters, Typing Effect & Countdown Timers

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initTypingEffect();
    initCountdownTimers();
    initButtonRipple();
});

// 1. Scroll Reveal with Intersection Observer
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-fade-up, .reveal-fade-down, .reveal-slide-left, .reveal-slide-right, .reveal-zoom');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Unobserve after animating once to prevent redundant execution
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });
}

// 2. Statistics Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter-val');
    
    const countOptions = {
        root: null,
        threshold: 0.5
    };

    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const limit = parseInt(target.getAttribute('data-target'), 10) || 0;
                const duration = 2000; // 2 seconds animation
                const startTime = performance.now();
                const startVal = 0;

                const updateCount = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    if (elapsedTime >= duration) {
                        target.textContent = limit + (target.getAttribute('data-suffix') || '');
                        return;
                    }

                    const progress = elapsedTime / duration;
                    // Ease out cubic
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentVal = Math.floor(startVal + easeProgress * (limit - startVal));
                    
                    target.textContent = currentVal + (target.getAttribute('data-suffix') || '');
                    requestAnimationFrame(updateCount);
                };

                requestAnimationFrame(updateCount);
                observer.unobserve(target);
            }
        });
    }, countOptions);

    counters.forEach(counter => {
        countObserver.observe(counter);
    });
}

// 3. Typing Effect
function initTypingEffect() {
    const typingContainer = document.querySelector('.typing-effect');
    if (!typingContainer) return;

    const wordsJSON = typingContainer.getAttribute('data-words');
    if (!wordsJSON) return;

    const words = JSON.parse(wordsJSON);
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    typingContainer.classList.add('typing-cursor');

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingContainer.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingContainer.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at full word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            // Short pause before starting next word
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

// 4. Countdown Timer for Events
function initCountdownTimers() {
    const countdowns = document.querySelectorAll('.countdown-timer');
    
    countdowns.forEach(timer => {
        const targetDateStr = timer.getAttribute('data-date');
        if (!targetDateStr) return;

        const targetDate = new Date(targetDateStr).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                timer.innerHTML = '<span class="countdown-finished">Event has started!</span>';
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            const daysVal = timer.querySelector('.countdown-days');
            const hoursVal = timer.querySelector('.countdown-hours');
            const minutesVal = timer.querySelector('.countdown-minutes');
            const secondsVal = timer.querySelector('.countdown-seconds');

            if (daysVal) daysVal.textContent = days.toString().padStart(2, '0');
            if (hoursVal) hoursVal.textContent = hours.toString().padStart(2, '0');
            if (minutesVal) minutesVal.textContent = minutes.toString().padStart(2, '0');
            if (secondsVal) secondsVal.textContent = seconds.toString().padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    });
}

// 5. Button Ripple Animation
function initButtonRipple() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, .ripple');
        if (!btn) return;

        // Position of click inside the button
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Ensure button does not overflow the ripple
        const prevPosition = btn.style.position;
        if (!prevPosition || prevPosition === 'static') {
            btn.style.position = 'relative';
        }

        btn.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });
}
