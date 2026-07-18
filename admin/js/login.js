document.addEventListener("DOMContentLoaded", () => {
    // Check if already logged in
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = "dashboard.html";
        return;
    }

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");
    const togglePasswordBtn = document.getElementById("togglePassword");

    // Toggle password visibility
    togglePasswordBtn.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        
        const icon = togglePasswordBtn.querySelector("i");
        if (type === "text") {
            icon.classList.remove("fa-regular", "fa-eye");
            icon.classList.add("fa-regular", "fa-eye-slash");
        } else {
            icon.classList.remove("fa-regular", "fa-eye-slash");
            icon.classList.add("fa-regular", "fa-eye");
        }
    });

    // Form submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Show loading state
        loginBtn.disabled = true;
        const originalContent = loginBtn.innerHTML;
        loginBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Authenticating...</span>`;

        const credentials = {
            username: usernameInput.value.trim(),
            password: passwordInput.value
        };

        try {
            const response = await fetch("https://piyuu-ripg.onrender.com?sslmode=require/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showToast("Login successful! Redirecting...", "success");
                
                // Store authentication token
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1200);
            } else {
                showToast(data.message || "Invalid credentials. Please try again.", "error");
                loginBtn.disabled = false;
                loginBtn.innerHTML = originalContent;
            }
        } catch (error) {
            console.error("Login request error:", error);
            showToast("Server unreachable. Please make sure the backend is running.", "error");
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalContent;
        }
    });

    // Toast system
    function showToast(message, type = "info") {
        const container = document.getElementById("toastContainer");
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        const iconClass = type === "success" 
            ? "fa-solid fa-circle-check" 
            : type === "error" 
            ? "fa-solid fa-circle-exclamation" 
            : "fa-solid fa-circle-info";

        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <div class="toast-message">${message}</div>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.add("show");
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3500);
    }
});
