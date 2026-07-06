// Real-time Form Validation, Password Strength, and Visibility Toggle

document.addEventListener('DOMContentLoaded', () => {
    initValidation();
    initPasswordToggle();
    initPasswordStrength();
});

// 1. Setup Password Visibility Toggle
function initPasswordToggle() {
    const toggles = document.querySelectorAll('.password-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const wrapper = toggle.closest('.password-input-wrapper');
            if (!wrapper) return;

            const input = wrapper.querySelector('input');
            if (!input) return;

            const isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');
            
            // Toggle eye/eye-off icons or text inside
            const iconSvg = toggle.querySelector('svg');
            if (iconSvg) {
                if (isPassword) {
                    // Change to eye-off visual (crossed path or similar indicator)
                    iconSvg.style.opacity = '0.5';
                } else {
                    iconSvg.style.opacity = '1';
                }
            }
        });
    });
}

// 2. Real-time strength meter for Register
function initPasswordStrength() {
    const passwordInput = document.querySelector('#register-password');
    const strengthBar = document.querySelector('.password-strength-fill');
    
    if (!passwordInput || !strengthBar) return;

    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        let score = 0;
        
        if (val.length >= 8) score += 1; // Length condition
        if (/[A-Z]/.test(val)) score += 1; // Upper condition
        if (/[0-9]/.test(val)) score += 1; // Number condition
        if (/[^A-Za-z0-9]/.test(val)) score += 1; // Special char condition

        let width = '0%';
        let color = 'var(--color-danger)';
        
        switch (score) {
            case 1:
                width = '25%';
                color = 'var(--color-danger)';
                break;
            case 2:
                width = '50%';
                color = 'var(--color-warning)';
                break;
            case 3:
                width = '75%';
                color = 'var(--color-accent)';
                break;
            case 4:
                width = '100%';
                color = 'var(--color-success)';
                break;
        }

        strengthBar.style.width = width;
        strengthBar.style.backgroundColor = color;
    });
}

// 3. General Form Validation Handler
function initValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

        // Setup real-time checks on blur & input
        inputs.forEach(input => {
            const check = () => validateInput(input);
            input.addEventListener('blur', check);
            input.addEventListener('input', () => {
                if (input.classList.contains('error') || input.classList.contains('success')) {
                    check();
                }
            });
        });

        // Form Submit listener
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            inputs.forEach(input => {
                const isValid = validateInput(input);
                if (!isValid) isFormValid = false;
            });

            if (isFormValid) {
                submitForm(form);
            } else {
                showToast('Please fix the errors in the form.', 'error');
            }
        });
    });
}

function validateInput(input) {
    const val = input.value.trim();
    let isValid = true;
    let errorMsg = '';

    // Required check
    if (val === '') {
        isValid = false;
        errorMsg = 'This field is required.';
    } else {
        // Specific checks
        const type = input.getAttribute('type');
        const id = input.getAttribute('id');

        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                isValid = false;
                errorMsg = 'Please enter a valid email address.';
            }
        } else if (type === 'tel') {
            const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;
            if (!phoneRegex.test(val)) {
                isValid = false;
                errorMsg = 'Please enter a valid phone number.';
            }
        } else if (id === 'register-password' && val.length < 8) {
            isValid = false;
            errorMsg = 'Password must be at least 8 characters long.';
        } else if (id === 'confirm-password') {
            const originalPassword = document.querySelector('#register-password');
            if (originalPassword && val !== originalPassword.value.trim()) {
                isValid = false;
                errorMsg = 'Passwords do not match.';
            }
        }
    }

    setValidationState(input, isValid, errorMsg);
    return isValid;
}

function setValidationState(input, isValid, errorMsg) {
    const group = input.closest('.form-group');
    if (!group) return;

    let feedback = group.querySelector('.form-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        group.appendChild(feedback);
    }

    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        feedback.classList.remove('error');
        feedback.classList.add('success');
        feedback.textContent = 'Looks good!';
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        feedback.classList.remove('success');
        feedback.classList.add('error');
        feedback.textContent = errorMsg;
    }
}

// 4. Form Submission Simulation (with loading indicator)
function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="loader-spinner" style="width: 20px; height: 20px; border-width: 2px; display: inline-block;"></span>
        Submitting...
    `;

    // Simulate Server Request
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Show Success Toast
        showToast('Form submitted successfully! Thank you.', 'success');
        
        // Reset Form
        form.reset();
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('success', 'error');
            const group = input.closest('.form-group');
            if (group) {
                const feedback = group.querySelector('.form-feedback');
                if (feedback) feedback.remove();
            }
        });

        // Hide strength bar if present
        const strengthBar = document.querySelector('.password-strength-fill');
        if (strengthBar) strengthBar.style.width = '0%';

    }, 2000);
}
