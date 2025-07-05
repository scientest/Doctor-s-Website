document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forgotPasswordForm');
  const emailInput = document.getElementById('email');
  const modal = document.getElementById('customModal');
  const modalMessage = document.getElementById('modalMessage');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const emailError = document.getElementById('emailError');

  if (!form || !emailInput || !modal || !modalMessage || !closeModalBtn || !emailError) {
    // One or more elements are missing, do not proceed
    console.error('Forgot password script: One or more required elements are missing from the DOM.');
    return;
  }

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      emailError.textContent = 'Email address cannot be empty.';
      emailError.classList.remove('hidden');
      return;
    }

    if (!isValidEmail(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailError.classList.remove('hidden');
      return;
    }

    emailError.classList.add('hidden');

    fetch('/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        modalMessage.textContent = 'OTP sent successfully to your email!';
        modal.classList.remove('hidden');
        // No redirect here — user will confirm via OK button
      } else {
        modalMessage.textContent = data.message || 'Failed to send OTP. Please try again.';
        modal.classList.remove('hidden');
      }
    })
    .catch(() => {
      modalMessage.textContent = 'An error occurred. Please try again later.';
      modal.classList.remove('hidden');
    });
  });

  emailInput.addEventListener('input', () => {
    if (!emailError.classList.contains('hidden')) {
      emailError.classList.add('hidden');
    }
  });

  closeModalBtn.addEventListener('click', () => {
    if (modalMessage.textContent.toLowerCase().includes('otp sent')) {
      window.location.href = '/verify-reset-otp';
    } else {
      modal.classList.add('hidden');
    }
  });
});