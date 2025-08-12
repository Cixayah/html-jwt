const LOGIN_URL = 'https://cix-api.vercel.app/auth/login';
const REGISTER_URL = 'https://cix-api.vercel.app/auth/register';

const authForm = document.getElementById('authForm');
const formTitle = document.getElementById('formTitle');
const submitButton = document.getElementById('submitButton');
const toggleForm = document.getElementById('toggleForm');
const messageElement = document.getElementById('message');
const nameField = document.getElementById('nameField');
const confirmPasswordField = document.getElementById('confirmPasswordField');

// Variável de controle para alternar entre Login e Registro
let isRegistering = false;

// Alternar entre Login e Registro
toggleForm.addEventListener('click', () => {
    isRegistering = !isRegistering;
    if (isRegistering) {
        formTitle.innerText = 'Registrar';
        submitButton.innerText = 'Registrar';
        toggleForm.innerText = 'Entrar';
        nameField.style.display = 'block';
        confirmPasswordField.style.display = 'block';
    } else {
        formTitle.innerText = 'Login';
        submitButton.innerText = 'Entrar';
        toggleForm.innerText = 'Registrar';
        nameField.style.display = 'none';
        confirmPasswordField.style.display = 'none';
    }
});

// Manipulador de envio do formulário
authForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isRegistering) {
        // Registro
        const name = document.getElementById('name').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            messageElement.innerHTML = '<div class="text-red-500">As senhas não coincidem.</div>';
            return;
        }

        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, confirmPassword })
            });

            const data = await response.json();
            if (response.ok) {
                messageElement.innerHTML = '<div class="text-green-500">Registro bem-sucedido! Faça login.</div>';
                toggleForm.click(); // Voltar para o formulário de login
            } else {
                messageElement.innerHTML = `<div class="text-red-500">${data.message || 'Erro ao registrar.'}</div>`;
            }
        } catch (error) {
            console.error('Erro:', error);
            messageElement.innerHTML = '<div class="text-red-500">Erro ao conectar com o servidor.</div>';
        }
    } else {
        // Login
        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                setJwtCookie(data.token);
                messageElement.innerHTML = '<div class="text-green-500">Login bem-sucedido!</div>';
                // Example: fetch authenticated user data
                fetchAuthenticatedUser();
                // Example function that uses JWT to fetch authenticated user data
                async function fetchAuthenticatedUser() {
                    try {
                        // Replace with your real protected endpoint URL
                        const USER_URL = 'https://cix-api.vercel.app/auth/me';
                        const response = await fetchWithAuth(USER_URL);
                        if (response.ok) {
                            const user = await response.json();
                            messageElement.innerHTML += `<div class="text-blue-500">Authenticated user: ${user.name || user.email || JSON.stringify(user)}</div>`;
                        } else {
                            messageElement.innerHTML += '<div class="text-red-500">Could not fetch authenticated user data.</div>';
                        }
                    } catch (error) {
                        messageElement.innerHTML += '<div class="text-red-500">Error fetching authenticated user.</div>';
                    }
                }
            } else {
                messageElement.innerHTML = `<div class="text-red-500">${data.message || 'Erro ao fazer login.'}</div>`;
            }
        } catch (error) {
            console.error('Erro:', error);
            messageElement.innerHTML = '<div class="text-red-500">Erro ao conectar com o servidor.</div>';
        }
    }
});

// Utilitário para salvar o token JWT em cookie seguro
function setJwtCookie(token) {
    // Expira em 1 dia, ajustável conforme necessário
    const expires = new Date(Date.now() + 86400 * 1000).toUTCString();
    document.cookie = `jwt=${token}; expires=${expires}; path=/; SameSite=Strict`;
}

// Utilitário para ler o token JWT do cookie
function getJwtFromCookie() {
    const match = document.cookie.match(/(?:^|; )jwt=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

// Exemplo de uso do token em requisições autenticadas:
async function fetchWithAuth(url, options = {}) {
    const token = getJwtFromCookie();
    if (!options.headers) options.headers = {};
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, options);
}
