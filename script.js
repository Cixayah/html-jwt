const URL = 'https://cix-api.vercel.app/auth/login';

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const credentials = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        console.log(data);

        // Exibir mensagem de sucesso ou erro
        const messageElement = document.getElementById('message');
        if (response.ok) {
            // Armazenar o token no LocalStorage ou SessionStorage
            localStorage.setItem('token', data.token);
            messageElement.innerHTML = '<div class="alert alert-success">Login bem-sucedido!</div>';

            // Aqui você pode redirecionar para outra página ou executar outra ação
            // window.location.href = 'outraPagina.html';
        } else {
            messageElement.innerHTML = '<div class="alert alert-danger">Erro ao fazer login. Tente novamente.</div>';
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('message').innerHTML = '<div class="alert alert-danger">Erro ao conectar com o servidor.</div>';
    }
});

// Função para verificar o token
function verificarToken() {
    const token = localStorage.getItem('token');
    if (token) {
        console.log('Token encontrado:', token);
        // Aqui você pode adicionar lógica para validar o token ou decodificá-lo
        // por exemplo, verificar sua expiração
    } else {
        console.log('Nenhum token encontrado. Usuário não autenticado.');
    }
}

// Chamar a função de verificação de token ao carregar a página
verificarToken();
