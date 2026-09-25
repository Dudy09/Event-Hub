function verificarLogin() { //Ele está definindo a função verificarLogin sem parâmetros

    // Lógica de verificação de login

    const usuario = document.getElementById("usuario").value; //Ele está selecionando o elemento com o id "usuario" e obtendo o valor digitado pelo usuário

    const senha = document.getElementById("senha").value; //Ele está selecionando o elemento com o id "senha" e obtendo o valor digitado pelo usuário

    if(usuario === "admin" && senha === "1234") { //Ele está verificando se o usuário é igual a "admin" e a senha é igual a "1234"
        alert("Login bem-sucedido!"); //Se a condição for verdadeira, ele exibirá um alerta com a mensagem "Login bem-sucedido!"
    window.location.href = "http://localhost/event-hub/home-page.html";
    }

    else
    {
        alert("Usuário ou senha incorretos!"); //Se a condição for falsa, ele exibirá um alerta com a mensagem "Usuário ou senha incorretos!"
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

// Eventos de clique
menuBtn.addEventListener('click', openMenu); // Abre ao clicar nas 3 barrinhas
closeBtn.addEventListener('click', closeMenu); // Fecha ao clicar no X
overlay.addEventListener('click', closeMenu); // Fecha ao clicar fora do menu