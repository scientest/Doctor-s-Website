function displayGoogleAuthMessage(message, isError = false) {
    const messageElement = document.getElementById('googleAuthErrorMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = isError ? 'server-message error-message' : 'server-message success-message';
        messageElement.style.display = 'block';
    } else {
        console.warn("Element with ID 'googleAuthErrorMessage' not found to display Google Auth message.");
        if (isError) {
            console.error(message);
        } else {
            console.log(message);
        }
    }
}

function handleCredentialResponse(response) {
    const token = response?.credential;

    if (!token || typeof token !== 'string') {
        console.error("No valid Google token received.");
        displayGoogleAuthMessage("Google Sign-In failed: Invalid token. Please refresh the page and try again.", true);
        return;
    }

    console.log("Received Google ID token:", token);

    fetch('/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    })
    .then(async res => {
        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await res.json();
        } else {
            const textResponse = await res.text();
            console.error("Server responded with non-JSON content:", textResponse);
            displayGoogleAuthMessage("Unexpected server response format. Please try again later.", true);
            return;
        }

        if (!res.ok || !data?.success) {
            const message = data?.message || "Google login failed.";
            console.warn("Login rejected by server:", message);
            displayGoogleAuthMessage(`Google Sign-In failed: ${message}`, true);
            return;
        }

        console.log("Google login success:", data);

        const safeEmail = encodeURIComponent(data.email || 'user');
        const redirectUrl = data.redirectUrl || `/dashboard/${safeEmail}`;

        window.location.href = redirectUrl;
    })
    .catch(err => {
        console.error("Error during Google Sign-In fetch:", err);
        displayGoogleAuthMessage("Unable to connect to the server. Please check your internet and try again.", true);
    });
}