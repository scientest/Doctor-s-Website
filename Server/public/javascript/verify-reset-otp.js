const otpInputs = Array.from(document.querySelectorAll('.otp-input-group input'));
const otpForm = document.getElementById('otpForm');
const otpTimer = document.getElementById('otpTimer');
const resendOtpLink = document.getElementById('resendOtpLink');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const customModal = document.getElementById('customModal');
const modalMessage = document.getElementById('modalMessage');
const closeModalBtn = document.getElementById('closeModalBtn');

let timerInterval;
let timeLeft = 180;

function showModal(message) {
    modalMessage.textContent = message;
    customModal.classList.remove('hidden');
}

function hideModal() {
    customModal.classList.add('hidden');
}

closeModalBtn.addEventListener('click', hideModal);

otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (input.value.length > 1) {
            input.value = input.value.slice(0, 1);
        }

        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});

function startTimer() {
    timeLeft = 180;
    resendOtpLink.classList.add('hidden');
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        otpTimer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            otpTimer.textContent = '0:00';
            resendOtpLink.classList.remove('hidden');
            showModal('OTP expired. Please click "Resend OTP".');
        }
        timeLeft--;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', startTimer);

resendOtpLink.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('Resending OTP...');
    showModal('New OTP sent to your Email ID!');
    startTimer();
    otpInputs.forEach(input => input.value = '');
    otpInputs[0].focus();
});

otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = otpInputs.map(input => input.value).join('');

    if (otp.length !== 6) {
        showModal('Please enter the complete 6-digit OTP.');
        return;
    }

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Verifying...';
    clearInterval(timerInterval);

    try {
        const response = await fetch('/verify-reset-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp: otp }),
        });

        const result = await response.json();

        if (response.ok) {
            showModal('OTP Verified Successfully! Redirecting to password reset...');
            setTimeout(() => {
                window.location.href = `/reset-password`;
            }, 1500);
        } else {
            showModal(result.errorMessage || 'Invalid OTP. Please try again.');
            startTimer();
            otpInputs.forEach(input => input.value = '');
            otpInputs[0].focus();
        }
    } catch (error) {
        console.error('Error during OTP verification request:', error);
        showModal('An unexpected error occurred during verification. Please try again.');
        startTimer();
    } finally {
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.innerHTML = 'Verify';
    }
});