// Carrega os dados do cliente que acabou de se cadastrar/logar
// (simula a leitura de um cadastro-cliente.json, mas lendo do localStorage)
document.addEventListener("DOMContentLoaded", () => {

    const cliente = JSON.parse(localStorage.getItem("clienteAtivo"));

    if (!cliente) {
        // Ninguém "logado" no momento -> volta pro cadastro/login
        window.location.href = "../cadastro.html";
        return;
    }

    // Mapeia dado -> id do elemento na página que vai mostrar esse dado.
    // Só preenche o que existir; se o id não existir no HTML, ele ignora sem dar erro.
    const campos = {
        "nome-cliente": cliente.nome,
        "email-cliente": cliente.email,
        "telefone-cliente": cliente.telefone,
        "cpf-cliente": cliente.cpf,
        "rg-cliente": cliente.rg,
        "data-nascimento-cliente": cliente.dataNascimento,
        "endereco-cliente": `${cliente.rua}, ${cliente.numero} - ${cliente.bairro}, ${cliente.cidade}/${cliente.estado} - ${cliente.cep}`
    };

    for (const id in campos) {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = campos[id];
    }
});