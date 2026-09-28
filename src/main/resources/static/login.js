const API_URL = "/users";

let isRegisterMode = false;

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    document.querySelector(".auth-panel .auth-form").hidden = isRegisterMode;
    document.getElementById("registerForm").hidden = !isRegisterMode;
    document.getElementById("authTitle").textContent = isRegisterMode ? "Create Account" : "Welcome Back";
    document.getElementById("authSubtitle").textContent = isRegisterMode
        ? "Sign up for your Todo account"
        : "Login to your Todo account";
    document.getElementById("authPrompt").textContent = isRegisterMode
        ? "Already have an account?"
        : "Don't have an account?";
    document.getElementById("authSwitch").textContent = isRegisterMode ? "Login" : "Create Account";
    document.getElementById(isRegisterMode ? "registerUsername" : "loginUsername").focus();
}

function saveLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "index.html";
}

async function registerUser() {
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Registration failed");
        }

        const user = await response.json();
        saveLoggedInUser(user);
    } catch (error) {
        console.error(error);
        alert("Registration failed: " + error.message);
    }
}

async function loginUser() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Login failed");
        }

        const user = await response.json();
        saveLoggedInUser(user);
    } catch (error) {
        console.error(error);
        alert("Login failed: " + error.message);
    }
}
