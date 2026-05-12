const API_BASE_URL = window.PELUDOPOLIS_API_URL || "http://localhost:3000";

const TOKEN_KEY = "peludopolis_token";
const USER_KEY = "peludopolis_user";

const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const authState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: getStoredUser()
};

const getInputValue = (id) => {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
};

const getJson = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("El servidor no respondió JSON. Revisa que el backend esté corriendo.");
  }

  const body = await response.json();

  if (!response.ok || body.ok === false) {
    throw new Error(body.message || "Ocurrió un error inesperado");
  }

  return body;
};

const apiRequest = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (authState.token) {
    headers.Authorization = `Bearer ${authState.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  return getJson(response);
};

const saveSession = (sessionData) => {
  const accessToken = sessionData.accessToken || sessionData.token;
  const user = sessionData.user;

  if (!accessToken || !user) {
    throw new Error("La respuesta de login no incluye token o usuario.");
  }

  authState.token = accessToken;
  authState.user = user;

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearSession = () => {
  authState.token = null;
  authState.user = null;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  // Limpieza de llaves viejas por si quedaron de versiones anteriores
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const showAlert = (elementId, message, type = "danger") => {
  const alert = document.getElementById(elementId);
  if (!alert) return;

  alert.className = `alert alert-${type}`;
  alert.textContent = message;
};

const clearAlert = (elementId) => {
  const alert = document.getElementById(elementId);
  if (!alert) return;

  alert.className = "alert d-none";
  alert.textContent = "";
};

const setButtonLoading = (button, isLoading, loadingText) => {
  if (!button) return;

  if (isLoading) {
    button.dataset.originalText = button.textContent || "";
    button.textContent = loadingText;
    button.disabled = true;
    return;
  }

  button.textContent = button.dataset.originalText || button.textContent || "Enviar";
  button.disabled = false;
};

const updateAuthUi = () => {
  const user = authState.user || getStoredUser();

  const navGuest = document.getElementById("nav-guest");
  const navUser = document.getElementById("nav-user");
  const navUserName = document.getElementById("navUserName");

  if (user) {
    if (navGuest) navGuest.style.display = "none";
    if (navUser) navUser.style.display = "block";

    if (navUserName) {
      navUserName.textContent =
        user.firstName ||
        user.first_name ||
        user.username ||
        user.email ||
        "Usuario";
    }

    return;
  }

  if (navGuest) navGuest.style.display = "block";
  if (navUser) navUser.style.display = "none";

  if (navUserName) {
    navUserName.textContent = "Usuario";
  }
};

const closeModal = (modalId) => {
  const modalElement = document.getElementById(modalId);
  if (!modalElement || !window.bootstrap) return;

  const modal =
    window.bootstrap.Modal.getInstance(modalElement) ||
    new window.bootstrap.Modal(modalElement);

  modal.hide();
};

const handleLogin = async (event) => {
  event.preventDefault();
  clearAlert("loginAlert");

  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');

  setButtonLoading(submitButton, true, "Entrando...");

  try {
    const payload = {
      email: getInputValue("loginEmail"),
      password: document.getElementById("loginPassword")?.value || ""
    };

    const body = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    saveSession(body.data);
    updateAuthUi();

    // Si es admin, redirigir al panel de admin
    if (body.data.user?.role === 'admin') {
        window.location.href = '/admin-panel'; 
        return;
}

    form.reset();
    closeModal("loginModal");
  } catch (error) {
    showAlert("loginAlert", error.message);
  } finally {
    setButtonLoading(submitButton, false);
  }
};

const handleRegister = async (event) => {
  event.preventDefault();
  clearAlert("registerAlert");

  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');

  setButtonLoading(submitButton, true, "Registrando...");

  try {
    const payload = {
      username: getInputValue("registerUsername"),
      email: getInputValue("registerEmail"),
      firstName: getInputValue("registerFirstName"),
      lastName: getInputValue("registerLastName"),
      password: document.getElementById("registerPassword")?.value || "",
      phone: getInputValue("registerPhone") || undefined,
      address: getInputValue("registerAddress") || undefined
    };

    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    showAlert("registerAlert", "Cuenta creada. Ahora inicia sesión.", "success");
    form.reset();
  } catch (error) {
    showAlert("registerAlert", error.message);
  } finally {
    setButtonLoading(submitButton, false);
  }
};

const handleLogout = () => {
  clearSession();
  updateAuthUi();
  window.location.href = "/";
};

const validateExistingSession = async () => {
  if (!authState.token) {
    updateAuthUi();
    return;
  }

  try {
    const body = await apiRequest("/auth/me");
    const user = body.data.user || body.data;

    authState.user = user;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    clearSession();
  } finally {
    updateAuthUi();
  }
};

window.logout = handleLogout;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document.getElementById("registerForm")?.addEventListener("submit", handleRegister);
  document.getElementById("logoutButton")?.addEventListener("click", handleLogout);

  validateExistingSession();
});