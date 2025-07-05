const profileDropdownToggle = document.getElementById('profileDropdownToggle');
const profileDropdownMenu = document.getElementById('profileDropdownMenu');
const logoutButton = document.getElementById('logoutButton');
const animatedNumbers = document.querySelectorAll('.animated-number');
const profilePhoto = document.getElementById('profilePhoto');
const photoUpload = document.getElementById('photoUpload');
const changePhotoBtn = document.getElementById('changePhotoBtn');

profileDropdownToggle.addEventListener('click', () => {
    profileDropdownMenu.classList.toggle('show');
    profileDropdownToggle.classList.toggle('active');
});

window.addEventListener('click', (event) => {
    if (!profileDropdownToggle.contains(event.target) && !profileDropdownMenu.contains(event.target)) {
        profileDropdownMenu.classList.remove('show');
        profileDropdownToggle.classList.remove('active');
    }
});

logoutButton.addEventListener('click', () => {
    window.location.href = '/logout';
});

function animateNumber(element) {
    const target = parseInt(element.dataset.target);
    let current = 0;
    const duration = 1000;
    const stepTime = 10;
    const increment = target / (duration / stepTime);

    if (element.animationTimer) {
        clearInterval(element.animationTimer);
    }

    element.animationTimer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(element.animationTimer);
        } else {
            element.textContent = Math.round(current);
        }
    }, stepTime);
}

changePhotoBtn.addEventListener('click', () => {
    photoUpload.click();
});

photoUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePhoto.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

window.addEventListener('load', () => {
    animatedNumbers.forEach(num => {
        num.textContent = num.dataset.target;
        if (parseInt(num.dataset.target) > 0) {
            animateNumber(num);
        }
    });
});
