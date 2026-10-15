async function carregarDetalhesDoEvento() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const idEvento = urlParams.get('id');

        if (!idEvento) {
            document.body.innerHTML = "<h1 style='text-align: center; padding: 50px;'>Evento não encontrado na URL.</h1>";
            return;
        }

        const eventos = obterEventos();
        const evento = eventos.find(e => e.id === idEvento);

        if (!evento) {
            document.body.innerHTML = "<h1 style='text-align: center; padding: 50px;'>Evento não cadastrado no sistema.</h1>";
            return;
        }

        // Função utilitária para preencher texto em elementos com segurança
        const setTexto = (id, texto) => {
            const el = document.getElementById(id);
            if (el) el.innerText = texto;
        };

        // 1. Nome e Imagem
        setTexto('detalhe-nome', evento.nome || '');

        const imgFundo = document.getElementById('detalhe-imagem-fundo');
        if (imgFundo) {
            const caminhoImagem = evento.imagem?.imagem_fundo || evento.imagem?.imagem_exibicao;
            const imagemPadrao = 'assets/img_not_found.jpg'; // Defina o caminho da sua imagem genérica/reserva

            if (caminhoImagem) {
                imgFundo.src = caminhoImagem;

                // Caso a imagem falhe ao carregar (caminho quebrado/arquivo inexistente)
                imgFundo.onerror = function() {
                    this.onerror = null; // Evita loop infinito se a imagem padrão também falhar
                    this.src = imagemPadrao;
                };
            } else {
                // Caso o JSON nem possua o campo da imagem
                imgFundo.src = imagemPadrao;
            }
        }

        // 2. Data e Hora
        const infoData = evento.informacoes?.informacoes_data;
        if (infoData) {
            setTexto('detalhe-data-hora', `${infoData.data_completo} - ${infoData.horario}`);
        }

        // 3. Informações Gerais (Duração, Classificação, Descrição, Local)
        const infoGerais = evento.informacoes?.informacoes_gerais;
        if (infoGerais) {
            setTexto('detalhe-duracao', `Duração: ${infoGerais.duracao}`);
            setTexto('detalhe-classificacao', `Classificação: ${infoGerais.classificacao}`);
            setTexto('detalhe-descricao', infoGerais.descricao);
        }

        const infoLocal = evento.informacoes?.informacoes_local;
        if (infoLocal) {
            setTexto('detalhe-local', `Local: ${infoLocal.local} - ${infoLocal.cidade} (${infoLocal.estado})`);
        }

        // 4. Tags (renderiza dinamicamente adicionando o espaço)
        const containerTags = document.getElementById('detalhe-tags');
        if (containerTags && evento.tags) {
            containerTags.innerHTML = ''; // Limpa tags antigas
            Object.values(evento.tags).forEach(tag => {
                if (tag && tag.trim() !== '') {
                    const btn = document.createElement('button');
                    btn.className = 'tags';
                    btn.innerText = tag;
                    containerTags.appendChild(btn);
                    
                    // Adiciona o espaço em branco após cada botão (igual ao HTML estático)
                    containerTags.appendChild(document.createTextNode(' '));
                }
            });
        }

        // 5. Ingressos (calcula o menor preço)
        if (evento.ingressos && evento.ingressos.length > 0) {
            const precos = evento.ingressos.map(i => i.preco);
            const menorPreco = Math.min(...precos);
            setTexto('detalhe-preco', `R$ ${menorPreco.toFixed(2).replace('.', ',')}`);
        }

        // 6. Organizador
        const org = evento.organizador;
        if (org) {
            setTexto('detalhe-organizador-nome', org.nome);
            
            const elAvaliacao = document.getElementById('detalhe-organizador-avaliacao');
            if (elAvaliacao) {
                elAvaliacao.innerHTML = `${org.estrelas} <img src="assets/icon_estrela.png" alt="icon de estrela" style="height: 24px; width: 24px; margin-left: 5px;"> (${org.avaliacoes})`;
            }

            const linkOrg = document.getElementById('detalhe-organizador-link');
            if (linkOrg && org.link) {
                linkOrg.href = org.link;
            }
        }

    } catch (erro) {
        console.error('Erro ao carregar os detalhes do evento:', erro);
    }
}

window.onload = carregarDetalhesDoEvento;