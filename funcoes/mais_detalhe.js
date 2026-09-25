/*
function verificar_evento(id) {
    if (typeof id === 'object' && id.id) {
        id = id.id;
    } else if (id instanceof HTMLElement) {
        id = id.id;
    }
    
    if (!id && window.event && window.event.currentTarget) {
        id = window.event.currentTarget.id;
    }

    window.location.href = `detalhes.html?id=${id}`;
}
*/

function verificar_evento(elementoOuId) {
    let id = '';

    if (typeof elementoOuId === 'string') {
        id = elementoOuId;
    } else if (elementoOuId && elementoOuId.id) {
        id = elementoOuId.id;
    }
    
    if (id) {
        window.location.href = `detalhes.html?id=${id}`;
    } else {
        console.error('Não foi possível identificar o ID do evento.');
    }
}

async function carregarEventos() {
    try {
        const resposta = await fetch('/event-hub/dados/shows.json'); 
        const eventos = await resposta.json();
        
        const container = document.getElementById('container-eventos');
        if (!container) return;

        container.innerHTML = '';
        
        let cardHTML = '';

        eventos.forEach(evento => {
            const imagemExibicao = evento.imagem?.imagem_exibicao || '';
            const categoria = evento.categoria_principal || '';
            const estado = evento.informacoes?.informacoes_local?.estado || '';
            const dataReduzida = evento.informacoes?.informacoes_data?.data_reduzida || '';

            cardHTML += `
                <div class="event-card">
                    <div class="event-content">
                        <img src="${imagemExibicao}" alt="Event Hub">
                        <div class="event-info">
                            <h1>${evento.nome}</h1>
                            <p>${categoria} - ${estado}</p>
                            <p>${dataReduzida}</p>
                            <button 
                                type="button" 
                                class="mais-detalhes" 
                                id="${evento.id}" 
                                value="${evento.valor_botao}">
                                Ver Detalhes
                            </button>
                            <input type="text" style="display: none;">
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = cardHTML;
        
        container.addEventListener('click', function(eventoClique) {
            const botaoClicado = eventoClique.target.closest('.mais-detalhes');
            if (botaoClicado) {
                verificar_evento(botaoClicado);
            }
        });

    } catch (erro) {
        console.error('Erro ao carregar o arquivo JSON:', erro);
    }
}

window.onload = carregarEventos;