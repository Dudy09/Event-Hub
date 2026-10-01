// Gera o hash SHA-256 da senha (igual ao do cadastro-usuario.js, para a comparação bater)
async function gerarHash(texto) {
    const bytes = new TextEncoder().encode(texto);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

async function verificarLogin() {

    // 1. Pega o que o usuário digitou
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;

    // 2. Conta de teste (pode apagar essas linhas quando não precisar mais)
    if (usuario === "admin" && senha === "1234") {
        alert("Login bem-sucedido!");
        window.location.href = "http://localhost/event-hub/home-page.html";
        return;
    }

    // 3. Lê os clientes cadastrados no localStorage
    const clientes = JSON.parse(localStorage.getItem("cadastro-cliente")) || [];

    // 4. Procura o cliente pelo e-mail ou pelo CPF (com ou sem pontos e traço)
    const digitado = usuario.toLowerCase();
    const digitadoNumeros = usuario.replace(/\D/g, "");

    const cliente = clientes.find((c) =>
        (c.email || "").trim().toLowerCase() === digitado ||
        (digitadoNumeros.length === 11 && (c.cpf || "").replace(/\D/g, "") === digitadoNumeros)
    );

    // 5. Confere a senha comparando os hashes
    if (cliente && cliente.senhaHash && cliente.senhaHash === await gerarHash(senha)) {
        // Guarda quem está logado (sem o hash da senha) para a area-usuario.html
        const { senhaHash, ...clienteSemSenha } = cliente;
        localStorage.setItem("clienteAtivo", JSON.stringify(clienteSemSenha));

        alert("Login bem-sucedido!");
        window.location.href = "http://localhost/event-hub/home-page.html";
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

// Função para abrir o menu
function openMenu() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
}

// Função para fechar o menu
function closeMenu() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Eventos de clique (só se o elemento existir na página; no index.html não existem)
if (menuBtn) menuBtn.addEventListener('click', openMenu); // Abre ao clicar nas 3 barrinhas
if (closeBtn) closeBtn.addEventListener('click', closeMenu); // Fecha ao clicar no X
if (overlay) overlay.addEventListener('click', closeMenu); // Fecha ao clicar fora do menu