// Espera o HTML carregar antes de rodar o script
document.addEventListener("DOMContentLoaded", () => {

    // Para onde ir depois de cadastrar (troque pela página que você tiver)
    const PAGINA_DESTINO = "Dashbard/index.html";

    // 1. Seleção dos elementos
    const form = document.getElementById("form-cadastro-empresa");
    const passos = document.querySelectorAll(".passo-cadastro");   // as 5 seções do formulário
    const indicadores = document.querySelectorAll(".etapa");       // as bolinhas numeradas do topo
    const barraProgresso = document.getElementById("barraProgresso");
    const porcentagemTexto = document.getElementById("porcentagem");

    const PASSO_OPCIONAL = 3; // índice do passo 4 (Perfil), que pode ser pulado
    let passoAtual = 0;

    // 2. Mostra só o passo atual, atualiza indicadores e barra de progresso
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

    // 3. Máscaras simples (só deixam os números formatados)
    function aplicarMascara(campo, formatar) {
        if (!campo) return;
        campo.addEventListener("input", () => {
            campo.value = formatar(campo.value.replace(/\D/g, ""));
        });
    }

    const maskCNPJ = (n) => n.slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");

    const maskCPF = (n) => n.slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    const maskTelefone = (n) => n.slice(0, 11)
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

    aplicarMascara(form.elements["cnpj"], maskCNPJ);
    aplicarMascara(form.elements["resp_cpf"], maskCPF);
    aplicarMascara(form.elements["telefone_empresa"], maskTelefone);
    aplicarMascara(form.elements["resp_telefone"], maskTelefone);

    // 4. Valida os campos do passo atual
    function validarPassoAtual() {
        const campos = passos[passoAtual].querySelectorAll("input, select, textarea");

        for (const campo of campos) {
            if (!campo.checkValidity()) {
                campo.reportValidity(); // mostra a mensagem do navegador
                return false;
            }
        }

        // Validação extra do CNPJ (passo 1). Usa validarCNPJ() se existir em validarDocumentos.js
        if (passoAtual === 0) {
            const cnpj = form.elements["cnpj"].value;
            const valido = (typeof validarCNPJ === "function")
                ? validarCNPJ(cnpj)
                : cnpj.replace(/\D/g, "").length === 14;

            if (!valido) {
                alert("CNPJ inválido. Verifique o número digitado.");
                form.elements["cnpj"].focus();
                return false;
            }
        }

        // Validação extra do CPF do responsável (passo 2)
        if (passoAtual === 1 && typeof validarCPF === "function") {
            if (!validarCPF(form.elements["resp_cpf"].value)) {
                alert("CPF inválido. Verifique o número digitado.");
                form.elements["resp_cpf"].focus();
                return false;
            }
        }

        return true;
    }

    // 5. Avançar, voltar e pular (globais: o HTML chama via onclick)
    window.proximoPasso = function () {
        if (validarPassoAtual() && passoAtual < passos.length - 1) {
            passoAtual++;
            atualizarPasso();
        }
    };

    window.passoAnterior = function () {
        if (passoAtual > 0) {
            passoAtual--;
            atualizarPasso();
        }
    };

    window.pularPasso = function () {
        if (passoAtual === PASSO_OPCIONAL) {
            passoAtual++;
            atualizarPasso();
        }
    };

    // 6. Hash SHA-256 da senha (mesma função do cadastro de usuário)
    async function gerarHash(texto) {
        const bytes = new TextEncoder().encode(texto);
        const hash = await crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }

    // 7. Envio do formulário
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Enter num passo que não é o último: só avança
        if (passoAtual < passos.length - 1) {
            window.proximoPasso();
            return;
        }

        if (!validarPassoAtual()) return;

        const senha = form.elements["senha"].value;
        if (senha !== form.elements["confirmar_senha"].value) {
            alert("As senhas não coincidem! Por favor, verifique.");
            return;
        }

        const v = (nome) => form.elements[nome].value.trim();

        // Dados da empresa (a senha NÃO entra aqui)
        const dadosEmpresa = {
            id: Date.now(),
            dadosGerais: {
                razaoSocial: v("razao_social"),
                nomeFantasia: v("nome_fantasia"),
                cnpj: v("cnpj"),
                categoria: v("categoria"),
                porte: v("porte"),
                telefone: v("telefone_empresa"),
                email: v("email_empresa")
            },
            responsavelLegal: {
                nome: v("resp_nome"),
                cpf: v("resp_cpf"),
                rg: v("resp_rg"),
                cargo: v("resp_cargo"),
                dataNascimento: v("resp_data_nascimento"),
                telefone: v("resp_telefone"),
                email: v("resp_email")
            },
            endereco: {
                cep: v("cep"),
                rua: v("rua"),
                numero: v("numero"),
                complemento: v("complemento"),
                bairro: v("bairro"),
                cidade: v("cidade"),
                uf: v("estado"),
                referencia: v("referencia")
            },
            perfil: {
                descricao: v("descricao"),
                areaAtuacao: v("atuacao"),
                site: v("site"),
                instagram: v("instagram"),
                facebook: v("facebook"),
                linkedin: v("linkedin")
            }
        };

        // "Banco de dados" simulado em localStorage, em formato de lista
        const empresas = JSON.parse(localStorage.getItem("cadastro-empresa")) || [];

        // Não deixa cadastrar o mesmo CNPJ ou e-mail duas vezes
        const cnpjNumeros = dadosEmpresa.dadosGerais.cnpj.replace(/\D/g, "");
        const emailMinusculo = dadosEmpresa.dadosGerais.email.toLowerCase();
        const jaExiste = empresas.some((e) =>
            (e.dadosGerais?.cnpj || "").replace(/\D/g, "") === cnpjNumeros ||
            (e.dadosGerais?.email || "").trim().toLowerCase() === emailMinusculo
        );

        if (jaExiste) {
            alert("Já existe um cadastro com esse CNPJ ou e-mail.");
            return;
        }

        // Só o hash da senha é guardado, usado pelo login
        const senhaHash = await gerarHash(senha);
        empresas.push({ ...dadosEmpresa, senhaHash });
        localStorage.setItem("cadastro-empresa", JSON.stringify(empresas));

        alert("Cadastro realizado com sucesso!");
        window.location.href = PAGINA_DESTINO;
    });

    // 8. Inicializa o primeiro passo
    atualizarPasso();
});