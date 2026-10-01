// Espera o HTML carregar antes de rodar o script
document.addEventListener("DOMContentLoaded", () => {

    // 1. Seleção dos elementos
    const form = document.getElementById("form-cadastro");
    const passos = document.querySelectorAll(".passo-cadastro");   // as 4 seções reais do formulário
    const indicadores = document.querySelectorAll(".etapa");       // as bolinhas numeradas do topo
    const barraProgresso = document.getElementById("barraProgresso");
    const porcentagemTexto = document.getElementById("porcentagem");

    let passoAtual = 0; // 0 = primeiro passo

    // 2. Mostra só o passo atual, atualiza o indicador e a barra de progresso
    function atualizarPasso() {
        passos.forEach((passo, index) => {
            passo.style.display = (index === passoAtual) ? "block" : "none";
        });

        indicadores.forEach((indicador, index) => {
            indicador.classList.remove("ativa", "concluida");
            if (index < passoAtual) indicador.classList.add("concluida");
            else if (index === passoAtual) indicador.classList.add("ativa");
        });

        const porcentagem = Math.round(((passoAtual + 1) / passos.length) * 100);
        barraProgresso.style.width = porcentagem + "%";
        porcentagemTexto.textContent = porcentagem + "%";

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // 3. Valida os campos obrigatórios do passo atual
    function validarPassoAtual() {
        const campos = passos[passoAtual].querySelectorAll("input[required]");

        for (const campo of campos) {
            if (!campo.checkValidity()) {
                campo.reportValidity(); // mostra a mensagem do navegador
                return false;
            }
        }

        // Validação extra do CPF (etapa 1), usando validarDocumentos.js
        if (passoAtual === 0 && typeof validarCPF === "function") {
            const cpf = form.elements["cpf"].value;
            if (!validarCPF(cpf)) {
                alert("CPF inválido. Verifique o número digitado.");
                form.elements["cpf"].focus();
                return false;
            }
        }

        return true;
    }

    // 4. Avançar (função global: o HTML chama via onclick="proximoPasso()")
    window.proximoPasso = function () {
        if (validarPassoAtual() && passoAtual < passos.length - 1) {
            passoAtual++;
            atualizarPasso();
        }
    };

    // 5. Voltar (função global: o HTML chama via onclick="passoAnterior()")
    window.passoAnterior = function () {
        if (passoAtual > 0) {
            passoAtual--;
            atualizarPasso();
        }
    };

    // 6. Gera o hash SHA-256 da senha (a senha nunca é salva em texto puro)
    // OBS: a mesma função existe em funcoes/testando.js, para o login comparar igual
    async function gerarHash(texto) {
        const bytes = new TextEncoder().encode(texto);
        const hash = await crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }

    // 7. Envio do formulário
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // não recarrega a página

        // Se o Enter foi apertado num passo que não é o último, só avança
        if (passoAtual < passos.length - 1) {
            window.proximoPasso();
            return;
        }

        if (!validarPassoAtual()) return;

        const senha = form.elements["senha"].value;
        const confirmarSenha = form.elements["confirmar_senha"].value;

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem! Por favor, verifique.");
            return;
        }

        // Dados do usuário (sem a senha; ela é guardada só como hash, mais abaixo)
        const dadosUsuario = {
            id: Date.now(),
            nome: form.elements["nome"].value,
            dataNascimento: form.elements["data_nascimento"].value,
            cpf: form.elements["cpf"].value,
            rg: form.elements["rg"].value,
            email: form.elements["email"].value,
            telefone: form.elements["telefone"].value,
            cep: form.elements["cep"].value,
            rua: form.elements["rua"].value,
            numero: form.elements["numero"].value,
            bairro: form.elements["bairro"].value,
            cidade: form.elements["cidade"].value,
            estado: form.elements["estado"].value,
            senha: form.elements["senha"].value
        };

        // "Banco de dados" simulado em localStorage, no formato de uma lista
        const clientes = JSON.parse(localStorage.getItem("cadastro-cliente")) || [];

        // Não deixa cadastrar o mesmo CPF ou e-mail duas vezes (o login depende disso)
        const cpfNumeros = dadosUsuario.cpf.replace(/\D/g, "");
        const emailMinusculo = dadosUsuario.email.trim().toLowerCase();
        const jaExiste = clientes.some((c) =>
            (c.cpf || "").replace(/\D/g, "") === cpfNumeros ||
            (c.email || "").trim().toLowerCase() === emailMinusculo
        );

        if (jaExiste) {
            alert("Já existe um cadastro com esse CPF ou e-mail.");
            return;
        }

        // Na lista de clientes vai também o hash da senha, usado só pelo login
        const senhaHash = await gerarHash(senha);
        clientes.push({ ...dadosUsuario, senhaHash });
        localStorage.setItem("cadastro-cliente", JSON.stringify(clientes));

        // Marca esse cliente como o "logado" agora, pra area-usuario.html saber quem mostrar
        localStorage.setItem("clienteAtivo", JSON.stringify(dadosUsuario));

        window.location.href = "area-usuario.html";
    });

    // 7. Inicializa o primeiro passo (sem isso só o passo 1 fica visível por acaso do HTML)
    atualizarPasso();
});