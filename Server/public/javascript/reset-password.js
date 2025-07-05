const resetForm = document.getElementById('resetForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');

if (!resetForm || !passwordInput || !confirmPasswordInput || !modal || !modalMessage) {
    console.error('One or more required elements are missing from the DOM.');
    // Optionally, you can stop script execution here
    // throw new Error('Required DOM elements not found');
}

function togglePassword(fieldId) {
    const input = document.getElementById(fieldId);
    const icon = input.nextElementSibling ? input.nextElementSibling.querySelector('i') : null;

    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.add('fa-eye');
            icon.classList.remove('fa-eye-slash');
        }
    }
}

function showModal(message, isError = false) {
    modalMessage.textContent = message;
    modalMessage.style.color = isError ? 'red' : 'green';
    modal.classList.remove('hidden');
}

if (resetForm) {
    resetForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        showModal('', false);

        if (password === '' || confirmPassword === '') {
            showModal('Please fill in both password fields.', true);
            return;
        }

        if (password !== confirmPassword) {
            showModal('Passwords do not match.', true);
            return;
        }

        if (password.length < 8) {
            showModal('Password must be at least 8 characters long.', true);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, confirmPassword }),
            });

            const result = await response.json();

            if (response.ok) {
                showModal(result.message || 'Password reset successful!', false);
                setTimeout(() => {
                    window.location.href = 'http://localhost:3000/login';
                }, 2000);
            } else {
                showModal(result.message || 'Password reset failed. Please try again.', true);
            }
        } catch (err) {
            console.error('Password reset fetch error:', err);
            showModal('A network error occurred. Please try again later.', true);
        }
    });
}
