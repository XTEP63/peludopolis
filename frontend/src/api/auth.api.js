const API_BASE_URL = window.location.port === "3000"
  ? window.location.origin
  : "http://localhost:3000";
const TOKEN_KEY = "peludopolis_token";
const USER_KEY = "peludopolis_user";

const authState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: JSON.parse(localStorage.getItem(USER_KEY) || "null")
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

const saveSession = ({ accessToken, user }) => {
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
  const authNavText = document.getElementById("authNavText");
  const authOpenButton = document.getElementById("authOpenButton");
  const logoutButton = document.getElementById("logoutButton");

  if (authState.user) {
    const name = authState.user.firstName || authState.user.username || "Usuario";

    if (authNavText) authNavText.textContent = `Hola, ${name}`;
    authOpenButton?.removeAttribute("data-bs-toggle");
    authOpenButton?.removeAttribute("data-bs-target");
    authOpenButton?.setAttribute("title", "Ya iniciaste sesión");
    logoutButton?.classList.remove("d-none");
    return;
  }

  if (authNavText) authNavText.textContent = "Invitado";
  authOpenButton?.setAttribute("data-bs-toggle", "modal");
  authOpenButton?.setAttribute("data-bs-target", "#loginModal");
  authOpenButton?.setAttribute("title", "Iniciar sesión");
  logoutButton?.classList.add("d-none");
};

const closeModal = (modalId) => {
  const modalElement = document.getElementById(modalId);
  if (!modalElement || !window.bootstrap) return;

  const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
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
      email: document.getElementById("loginEmail").value.trim(),
      password: document.getElementById("loginPassword").value
    };

    const body = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    saveSession(body.data);
    updateAuthUi();
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
      username: document.getElementById("registerUsername").value.trim(),
      email: document.getElementById("registerEmail").value.trim(),
      firstName: document.getElementById("registerFirstName").value.trim(),
      lastName: document.getElementById("registerLastName").value.trim(),
      password: document.getElementById("registerPassword").value,
      phone: document.getElementById("registerPhone").value.trim() || undefined,
      address: document.getElementById("registerAddress").value.trim() || undefined
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
};

const validateExistingSession = async () => {
  if (!authState.token) {
    updateAuthUi();
    return;
  }

  try {
    const body = await apiRequest("/auth/me");
    authState.user = body.data;
    localStorage.setItem(USER_KEY, JSON.stringify(body.data));
  } catch {
    clearSession();
  } finally {
    updateAuthUi();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document.getElementById("registerForm")?.addEventListener("submit", handleRegister);
  document.getElementById("logoutButton")?.addEventListener("click", handleLogout);

  validateExistingSession();
});
