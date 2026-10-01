// Pesquisa de eventos da home-page.html
// (mesma lógica do home_pagina_inicial.html, adaptada para a barra que já existe na página)
document.addEventListener("DOMContentLoaded", () => {

    // 1. Seleção dos elementos
    const campoPesquisa = document.getElementById("pesquisa-eventos");
    const container = document.querySelector(".eventos-container");
    const tituloSecao = document.querySelector(".titulo-eventos p");

    if (!campoPesquisa || !container || !tituloSecao) return;

    const cards = container.querySelectorAll(".event-card");
    const tituloOriginal = tituloSecao.textContent; // "Principais eventos"

    // 2. Mensagem de "nenhum evento encontrado" (criada aqui, não precisa mexer no HTML)
    const semResultados = document.createElement("div");
    semResultados.style.cssText =
        "display: none; text-align: center; padding: 40px 20px; color: #64748b;";
    semResultados.innerHTML = `
        <h3 style="font-family: 'Poppins', sans-serif; font-size: 20px; margin-bottom: 8px;">
            Nenhum evento encontrado
        </h3>
        <p style="font-size: 14px;">Tente pesquisar por outro termo, como "música" ou "SP".</p>
    `;
    container.insertAdjacentElement("afterend", semResultados);

    // 3. Deixa o texto sem acento, minúsculo e com espaços simples
    //    (assim "musica" também encontra "Música")
    function normalizar(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .trim();
    }

    // Texto pesquisável do card: título, categoria/local e data (sem o texto do botão)
    function textoDoCard(card) {
        return Array.from(card.querySelectorAll("h1, p"))
            .map((el) => el.textContent)
            .join(" ");
    }

    // 4. Filtra os cards pelo título, categoria, local e data (tudo que aparece no card)
    function filtrarEventos() {
        const termoOriginal = campoPesquisa.value.trim();
        const termo = normalizar(termoOriginal);
        let encontrados = 0;

        cards.forEach((card) => {
            const corresponde = normalizar(textoDoCard(card)).includes(termo);
            card.style.display = corresponde ? "" : "none";
            if (corresponde) encontrados++;
        });

        // Com poucos resultados, alinha os cards à esquerda em vez de espalhar nas pontas
        container.style.justifyContent = termo ? "flex-start" : "";

        semResultados.style.display = (encontrados === 0) ? "block" : "none";

        if (termo === "") {
            tituloSecao.textContent = tituloOriginal;
        } else if (encontrados === 0) {
            tituloSecao.textContent = "Resultados da busca";
        } else {
            tituloSecao.textContent = `Resultados para "${termoOriginal}"`;
        }
    }

    // 5. Eventos: ao digitar, ao apertar Enter e ao clicar no "X" do campo de busca
    campoPesquisa.addEventListener("input", filtrarEventos);
    campoPesquisa.addEventListener("search", filtrarEventos);
    campoPesquisa.addEventListener("keydown", (event) => {
        if (event.key === "Enter") filtrarEventos();
    });
});