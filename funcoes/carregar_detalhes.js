async function carregarDetalhesDoEvento() {
    try {
        // 1. Pega o ID que foi passado na URL (ex: ?id=Coldplay)
        const urlParams = new URLSearchParams(window.location.search);
        const idEvento = urlParams.get('id');

        if (!idEvento) {
            document.body.innerHTML = "<h1>Evento não encontrado.</h1>";
            return;
        }

        // 2. Busca o arquivo JSON de shows (ajuste o caminho se necessário)
        const resposta = await fetch('/event-hub/dados/shows.json');
        const eventos = await resposta.json();

        // 3. Procura no array o evento que tem o ID igual ao da URL
        const evento = eventos.find(e => e.id === idEvento);

        if (!evento) {
            document.body.innerHTML = "<h1>Evento não cadastrado no sistema.</h1>";
            return;
        }

        // 4. Preenche as informações na tela usando os dados do JSON
        document.getElementById('detalhe-nome').innerText = evento.nome;
        
        const infoData = evento.informacoes.informacoes_data;
        document.getElementById('detalhe-data-hora').innerText = `${infoData.data_completo} - ${infoData.horario}`;
        
        const infoLocal = evento.informacoes.informacoes_local;
        document.getElementById('detalhe-local').innerText = `Local: ${infoLocal.local} - ${infoLocal.estado}`;
        
        document.getElementById('detalhe-descricao').innerText = evento.informacoes.informacoes_gerais.descricao;
        
        // Exibe a imagem de fundo (se houver, caso contrário usa a de exibição)
        document.getElementById('detalhe-imagem-fundo').src = evento.imagem.imagem_fundo || evento.imagem.imagem_exibicao;

        // Procura o menor preço na lista de ingressos para exibir no bloco lateral
        if (evento.ingressos && evento.ingressos.length > 0) {
            const precos = evento.ingressos.map(i => i.preco);
            const menorPreco = Math.min(...precos);
            document.getElementById('detalhe-preco').innerText = `R$ ${menorPreco},00`;
        }

        // Preenche dados do organizador
        document.getElementById('detalhe-organizador-nome').innerText = evento.organizador.nome;
        document.getElementById('detalhe-organizador-avaliacao').innerText = `${evento.organizador.estrelas} ★ (${evento.organizador.avaliacoes})`;

    } catch (erro) {
        console.error('Erro ao carregar detalhes:', erro);
    }
}

// Executa a função assim que a página de detalhes abrir
window.onload = carregarDetalhesDoEvento;
