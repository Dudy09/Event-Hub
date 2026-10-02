// Modal de compra de ingressos, em 3 etapas: ingressos → pagamento → confirmação.
//
// Como usar em qualquer página (precisa de css/compra-modal.css e do Font Awesome):
//   abrirCompraModal(
//       { titulo: "Show do Coldplay", data: "12 de Setembro de 2025 - 21:00",
//         imagem: "assets/foto.png", local: "Nubank Parque - SP", precoBase: 180 },
//       { aoConcluir: function () { /* roda depois do botão "Concluir" */ } }
//   );
(function () {

    // HTML das 3 etapas (indicador, ingressos, pagamento e confirmação)
    const CORPO_HTML = `
        <!-- Indicador de Etapas -->
                            <div class="steps-indicator" id="stepsIndicator">
                                <div class="step-dot active" id="stepDot1">1</div>
                                <div class="step-line" id="stepLine1"></div>
                                <div class="step-dot" id="stepDot2">2</div>
                                <div class="step-line" id="stepLine2"></div>
                                <div class="step-dot" id="stepDot3">3</div>
                            </div>

                            <!-- ETAPA 1: Escolha dos Ingressos -->
                            <div id="step1Content">
                                <div class="ticket-event-summary">
                                    <img src="" alt="Evento" id="ticketEventImage">
                                    <div class="ticket-event-summary-info">
                                        <h3 id="ticketEventTitle">Show do Coldplay</h3>
                                        <p><i class="far fa-calendar-alt"></i> <span id="ticketEventDate">12 de Setembro de 2025 - 21:00</span></p>
                                        <p><i class="fas fa-map-marker-alt"></i> <span id="ticketEventLocal"></span></p>
                                    </div>
                                </div>

                                <div class="ticket-section-title">
                                    <i class="fas fa-layer-group"></i> Escolha o tipo de ingresso
                                </div>

                                <div class="ticket-types" id="ticketTypes"></div>

                                <div class="ticket-section-title">
                                    <i class="fas fa-sort-numeric-up"></i> Quantidade
                                </div>

                                <div style="display: flex; justify-content: center; margin-bottom: 30px;">
                                    <div class="quantity-selector">
                                        <button class="quantity-btn" id="decreaseQty" data-acao="qty-menos">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <span class="quantity-value" id="quantityValue">1</span>
                                        <button class="quantity-btn" id="increaseQty" data-acao="qty-mais">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="order-summary">
                                    <h4><i class="fas fa-receipt"></i> Resumo do Pedido</h4>
                                    <div id="orderLines"></div>
                                    <div class="order-line total">
                                        <span>Total</span>
                                        <span id="orderTotal">R$ 180,00</span>
                                    </div>
                                </div>

                                <button class="btn-finalizar" data-acao="ir-pagamento">
                                    <i class="fas fa-arrow-right"></i> Ir para Pagamento
                                </button>
                            </div>

                            <!-- ETAPA 2: Forma de Pagamento -->
                            <div id="step2Content" style="display: none;">
                                <div class="ticket-section-title">
                                    <i class="fas fa-credit-card"></i> Forma de Pagamento
                                </div>

                                <div class="order-summary" style="margin-bottom: 20px;">
                                    <div class="order-line">
                                        <span id="paymentSummaryItems">Inteira x 1</span>
                                        <span id="paymentSummarySubtotal">R$ 180,00</span>
                                    </div>
                                    <div class="order-line total">
                                        <span>Total a pagar</span>
                                        <span id="paymentSummaryTotal">R$ 180,00</span>
                                    </div>
                                </div>

                                <div class="payment-methods">
                                    <div class="payment-method" id="methodPix" data-acao="pagamento" data-metodo="pix">
                                        <div class="payment-method-icon pix">
                                            <i class="fa-brands fa-pix"></i>
                                        </div>
                                        <div class="payment-method-info">
                                            <h4>PIX</h4>
                                            <p>Aprovação imediata</p>
                                        </div>
                                        <div class="payment-method-radio"></div>
                                    </div>

                                    <div class="payment-method" id="methodDebito" data-acao="pagamento" data-metodo="debito">
                                        <div class="payment-method-icon debito">
                                            <i class="fas fa-credit-card"></i>
                                        </div>
                                        <div class="payment-method-info">
                                            <h4>Cartão de Débito</h4>
                                            <p>Débito à vista</p>
                                        </div>
                                        <div class="payment-method-radio"></div>
                                    </div>

                                    <div class="payment-method" id="methodCredito" data-acao="pagamento" data-metodo="credito">
                                        <div class="payment-method-icon credito">
                                            <i class="fas fa-credit-card"></i>
                                        </div>
                                        <div class="payment-method-info">
                                            <h4>Cartão de Crédito</h4>
                                            <p>Parcele em até 12x</p>
                                        </div>
                                        <div class="payment-method-radio"></div>
                                    </div>
                                </div>

                                <!-- Detalhes: PIX -->
                                <div class="payment-details" id="detailsPix">
                                    <div class="pix-box">
                                        <div class="pix-icon">
                                            <i class="fa-brands fa-pix"></i>
                                        </div>
                                        <h4>Pague com PIX</h4>
                                        <p>Escaneie o QR Code ou copie o código abaixo:</p>
                                        <div class="pix-code" id="pixCode">
                                            00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-e5f6-7890-abcd-ef12345678905204000053039865405180.005802BR5913EVENTHUB LTDA6009SAO PAULO62070503***6304ABCD
                                        </div>
                                        <button class="btn-copiar-pix" data-acao="copiar-pix">
                                            <i class="fas fa-copy"></i> Copiar código PIX
                                        </button>
                                    </div>
                                </div>

                                <!-- Detalhes: Cartão -->
                                <div class="payment-details" id="detailsCartao">
                                    <div class="card-form">
                                        <div class="form-group">
                                            <label>Número do Cartão</label>
                                            <div class="card-number-group">
                                                <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19" data-mascara="cartao">
                                                <i class="fas fa-credit-card card-brand" id="cardBrandIcon"></i>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label>Nome do Titular</label>
                                            <input type="text" id="cardName" placeholder="Como está impresso no cartão">
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Validade</label>
                                                <input type="text" id="cardExpiry" placeholder="MM/AA" maxlength="5" data-mascara="validade">
                                            </div>
                                            <div class="form-group">
                                                <label>CVV</label>
                                                <input type="text" id="cardCvv" placeholder="123" maxlength="4" data-mascara="numeros">
                                            </div>
                                        </div>
                                        <div class="form-group" id="installmentsGroup" style="display: none;">
                                            <label>Parcelas</label>
                                            <select id="installments"></select>
                                        </div>
                                        <div class="installments-info" id="installmentsInfo" style="display: none;">
                                            <i class="fas fa-info-circle"></i>
                                            <span>Parcele sua compra em até 12x no cartão de crédito.</span>
                                        </div>
                                    </div>
                                </div>

                                <button class="btn-finalizar" data-acao="finalizar" id="btnConfirmarPagamento">
                                    <i class="fas fa-lock"></i> Confirmar Pagamento
                                </button>
                                <button class="btn-voltar-etapa" data-acao="voltar-ingressos">
                                    <i class="fas fa-arrow-left"></i> Voltar
                                </button>
                            </div>

                            <!-- ETAPA 3: Confirmação -->
                            <div class="ticket-success" id="ticketSuccess">
                                <div class="success-icon">
                                    <i class="fas fa-check"></i>
                                </div>
                                <h3>Compra realizada!</h3>
                                <p>Seu ingresso foi confirmado. Apresente o código abaixo na entrada.</p>

                                <div class="success-details">
                                    <div class="order-line">
                                        <span>Evento</span>
                                        <span id="successEventTitle">Show do Coldplay</span>
                                    </div>
                                    <div class="order-line">
                                        <span>Ingressos</span>
                                        <span id="successItems">Inteira x 1</span>
                                    </div>
                                    <div class="order-line">
                                        <span>Pagamento</span>
                                        <span id="successPayment">PIX</span>
                                    </div>
                                    <div class="order-line total">
                                        <span>Total pago</span>
                                        <span id="successTotal">R$ 180,00</span>
                                    </div>
                                </div>

                                <div class="code" id="ticketCode">EVT-2026-XXXX</div>
                                <button class="btn-finalizar" data-acao="concluir">
                                    <i class="fas fa-check"></i> Concluir
                                </button>
                            </div>
    `;

    // Tipos de ingresso e multiplicador de preço sobre o preço base
    const tiposIngresso = {
        inteira: { nome: "Inteira", descricao: "Ingresso sem desconto", multiplicador: 1.0 },
        meia: { nome: "Meia-Entrada", descricao: "Estudantes e idosos (50% off)", multiplicador: 0.5 },
        vip: { nome: "VIP", descricao: "Acesso à área VIP + open bar", multiplicador: 2.5 }
    };

    let overlay = null; // fundo escurecido que cobre a página
    let modal = null;   // a janela de compra
    let evento = { titulo: "", data: "", imagem: "", local: "", precoBase: 0 };
    let tipoSelecionado = "inteira";
    let quantidade = 1;
    let formaPagamento = "";
    let aoConcluir = null;
    let overflowAnterior = "";

    const el = (id) => document.getElementById(id);

    function formatarReais(valor) {
        return "R$ " + valor.toFixed(2).replace(".", ",");
    }

    // =========================================
    // CRIAÇÃO DO MODAL (uma vez só)
    // =========================================
    function criar() {
        if (overlay) return;

        overlay = document.createElement("div");
        overlay.className = "ticket-modal-overlay";
        overlay.id = "compraOverlay";
        overlay.setAttribute("aria-hidden", "true");
        overlay.innerHTML = `
            <div class="ticket-modal" id="compraModal" role="dialog" aria-modal="true" aria-label="Comprar ingressos">
                <div class="ticket-modal-inner" id="compraCorpo">
                    <div class="ticket-modal-header">
                        <h2><i class="fas fa-ticket-alt"></i> Comprar Ingressos</h2>
                        <button type="button" class="close-ticket" data-acao="fechar" aria-label="Fechar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="ticket-modal-body">${CORPO_HTML}</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        modal = overlay.querySelector("#compraModal");

        // Clique fora da janela fecha
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) fechar();
        });

        // Cliques nos botões (cada botão tem um data-acao)
        modal.addEventListener("click", (event) => {
            const alvo = event.target.closest("[data-acao]");
            if (!alvo) return;

            switch (alvo.dataset.acao) {
                case "fechar": fechar(); break;
                case "qty-menos": alterarQuantidade(-1); break;
                case "qty-mais": alterarQuantidade(1); break;
                case "tipo": selecionarTipo(alvo.dataset.tipo); break;
                case "ir-pagamento": irParaPagamento(); break;
                case "voltar-ingressos": voltarParaIngressos(); break;
                case "pagamento": selecionarPagamento(alvo.dataset.metodo); break;
                case "copiar-pix": copiarPix(alvo); break;
                case "finalizar": finalizarCompra(); break;
                case "concluir": concluir(); break;
            }
        });

        // Máscaras dos campos do cartão
        modal.addEventListener("input", (event) => {
            const mascara = event.target.dataset.mascara;
            if (mascara === "cartao") formatarCartao(event.target);
            else if (mascara === "validade") formatarValidade(event.target);
            else if (mascara === "numeros") apenasNumeros(event.target);
        });

        // Esc fecha a janela (preventDefault avisa os outros scripts que o Esc já foi usado)
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && overlay && overlay.classList.contains("active")) {
                event.preventDefault();
                fechar();
            }
        });
    }

    // =========================================
    // ABRIR / FECHAR
    // =========================================
    function abrir(dadosEvento, opcoes) {
        criar();

        evento = Object.assign({ titulo: "", data: "", imagem: "", local: "", precoBase: 0 }, dadosEvento);
        aoConcluir = (opcoes && opcoes.aoConcluir) || null;

        // Resumo do evento no topo da etapa 1
        const imagem = el("ticketEventImage");
        imagem.src = evento.imagem;
        imagem.style.display = evento.imagem ? "" : "none";
        el("ticketEventTitle").textContent = evento.titulo;
        el("ticketEventDate").textContent = evento.data;
        el("ticketEventLocal").textContent = evento.local;

        // Começa sempre do zero na etapa 1
        tipoSelecionado = "inteira";
        quantidade = 1;
        el("quantityValue").textContent = "1";
        renderizarTipos();
        atualizarResumo();
        voltarParaIngressos();
        el("compraCorpo").scrollTop = 0;

        overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");
    }

    function fechar() {
        if (!overlay) return;
        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = overflowAnterior;
    }

    function concluir() {
        fechar();
        if (typeof aoConcluir === "function") aoConcluir();
    }

    // =========================================
    // ETAPA 1: INGRESSOS
    // =========================================
    function renderizarTipos() {
        const container = el("ticketTypes");
        container.innerHTML = "";

        Object.keys(tiposIngresso).forEach((chave) => {
            const tipo = tiposIngresso[chave];
            const preco = evento.precoBase * tipo.multiplicador;

            const card = document.createElement("div");
            card.className = "ticket-type-card" + (chave === tipoSelecionado ? " selected" : "");
            card.dataset.acao = "tipo";
            card.dataset.tipo = chave;
            card.innerHTML = `
                <div class="ticket-type-info">
                    <h4>${tipo.nome}</h4>
                    <p>${tipo.descricao}</p>
                </div>
                <div class="ticket-type-price">
                    ${formatarReais(preco)}
                    ${tipo.multiplicador < 1 ? "<span>/ pessoa</span>" : ""}
                </div>
            `;
            container.appendChild(card);
        });
    }

    function selecionarTipo(chave) {
        tipoSelecionado = chave;
        renderizarTipos();
        atualizarResumo();
    }

    function alterarQuantidade(delta) {
        const novaQtd = quantidade + delta;
        if (novaQtd >= 1 && novaQtd <= 10) {
            quantidade = novaQtd;
            el("quantityValue").textContent = quantidade;
            atualizarResumo();
        }
    }

    function calcularSubtotal() {
        return evento.precoBase * tiposIngresso[tipoSelecionado].multiplicador * quantidade;
    }

    function atualizarResumo() {
        const tipo = tiposIngresso[tipoSelecionado];
        const subtotal = calcularSubtotal();

        el("orderLines").innerHTML = `
            <div class="order-line">
                <span>${tipo.nome} x ${quantidade}</span>
                <span>${formatarReais(subtotal)}</span>
            </div>
        `;
        el("orderTotal").textContent = formatarReais(subtotal);

        el("decreaseQty").disabled = quantidade <= 1;
        el("increaseQty").disabled = quantidade >= 10;
    }

    // =========================================
    // NAVEGAÇÃO ENTRE AS ETAPAS
    // =========================================
    function irParaPagamento() {
        const tipo = tiposIngresso[tipoSelecionado];
        const subtotal = calcularSubtotal();

        el("paymentSummaryItems").textContent = `${tipo.nome} x ${quantidade}`;
        el("paymentSummarySubtotal").textContent = formatarReais(subtotal);
        el("paymentSummaryTotal").textContent = formatarReais(subtotal);

        atualizarParcelas(subtotal);

        el("step1Content").style.display = "none";
        el("step2Content").style.display = "block";
        el("ticketSuccess").classList.remove("show");

        el("stepDot1").classList.remove("active");
        el("stepDot1").classList.add("done");
        el("stepLine1").classList.add("done");
        el("stepDot2").classList.add("active");

        el("compraCorpo").scrollTop = 0;
    }

    function voltarParaIngressos() {
        el("step1Content").style.display = "block";
        el("step2Content").style.display = "none";
        el("ticketSuccess").classList.remove("show");

        el("stepDot1").classList.add("active");
        el("stepDot1").classList.remove("done");
        el("stepLine1").classList.remove("done");
        el("stepDot2").classList.remove("active", "done");
        el("stepLine2").classList.remove("done");
        el("stepDot3").classList.remove("active", "done");

        formaPagamento = "";
        modal.querySelectorAll(".payment-method").forEach((m) => m.classList.remove("selected"));
        modal.querySelectorAll(".payment-details").forEach((d) => d.classList.remove("show"));

        el("compraCorpo").scrollTop = 0;
    }

    function atualizarParcelas(total) {
        const select = el("installments");
        select.innerHTML = "";
        for (let i = 1; i <= 12; i++) {
            const juros = i > 6 ? " (com juros)" : " (sem juros)";
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `${i}x de ${formatarReais(total / i)}${juros}`;
            select.appendChild(option);
        }
    }

    // =========================================
    // ETAPA 2: PAGAMENTO
    // =========================================
    function selecionarPagamento(metodo) {
        formaPagamento = metodo;

        modal.querySelectorAll(".payment-method").forEach((m) => m.classList.remove("selected"));
        modal.querySelectorAll(".payment-details").forEach((d) => d.classList.remove("show"));

        const grupoParcelas = el("installmentsGroup");
        const infoParcelas = el("installmentsInfo");

        if (metodo === "pix") {
            el("methodPix").classList.add("selected");
            el("detailsPix").classList.add("show");
            grupoParcelas.style.display = "none";
            infoParcelas.style.display = "none";
        } else if (metodo === "debito") {
            el("methodDebito").classList.add("selected");
            el("detailsCartao").classList.add("show");
            grupoParcelas.style.display = "none";
            infoParcelas.style.display = "none";
        } else if (metodo === "credito") {
            el("methodCredito").classList.add("selected");
            el("detailsCartao").classList.add("show");
            grupoParcelas.style.display = "flex";
            infoParcelas.style.display = "flex";
        }
    }

    function formatarCartao(input) {
        let valor = input.value.replace(/\D/g, "");
        valor = valor.replace(/(\d{4})(?=\d)/g, "$1 ");
        input.value = valor;

        const icone = el("cardBrandIcon");
        if (valor.startsWith("4")) {
            icone.className = "fab fa-cc-visa card-brand";
            icone.style.color = "#1a1f71";
        } else if (valor.startsWith("5")) {
            icone.className = "fab fa-cc-mastercard card-brand";
            icone.style.color = "#eb001b";
        } else if (valor.startsWith("3")) {
            icone.className = "fab fa-cc-amex card-brand";
            icone.style.color = "#006fcf";
        } else {
            icone.className = "fas fa-credit-card card-brand";
            icone.style.color = "#1a56db";
        }
    }

    function formatarValidade(input) {
        let valor = input.value.replace(/\D/g, "");
        if (valor.length >= 2) {
            valor = valor.substring(0, 2) + "/" + valor.substring(2, 4);
        }
        input.value = valor;
    }

    function apenasNumeros(input) {
        input.value = input.value.replace(/\D/g, "");
    }

    function copiarPix(botao) {
        const codigo = el("pixCode").textContent.trim();
        navigator.clipboard.writeText(codigo).then(() => {
            const htmlOriginal = botao.innerHTML;
            botao.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(() => { botao.innerHTML = htmlOriginal; }, 2000);
        });
    }

    // =========================================
    // ETAPA 3: CONFIRMAÇÃO
    // =========================================
    function finalizarCompra() {
        if (!formaPagamento) {
            alert("Por favor, selecione uma forma de pagamento.");
            return;
        }

        if (formaPagamento !== "pix") {
            const numero = el("cardNumber").value.replace(/\s/g, "");
            const nome = el("cardName").value.trim();
            const validade = el("cardExpiry").value;
            const cvv = el("cardCvv").value;

            if (numero.length < 13) {
                alert("Por favor, insira um número de cartão válido.");
                return;
            }
            if (!nome) {
                alert("Por favor, insira o nome do titular.");
                return;
            }
            if (validade.length < 5) {
                alert("Por favor, insira a validade do cartão.");
                return;
            }
            if (cvv.length < 3) {
                alert("Por favor, insira o CVV.");
                return;
            }
        }

        const tipo = tiposIngresso[tipoSelecionado];

        el("successEventTitle").textContent = evento.titulo;
        el("successItems").textContent = `${tipo.nome} x ${quantidade}`;
        el("successPayment").textContent =
            formaPagamento === "pix" ? "PIX" :
            formaPagamento === "debito" ? "Cartão de Débito" : "Cartão de Crédito";
        el("successTotal").textContent = formatarReais(calcularSubtotal());

        const codigoAleatorio = Math.random().toString(36).substring(2, 8).toUpperCase();
        el("ticketCode").textContent = `EVT-2026-${codigoAleatorio}`;

        el("stepDot2").classList.remove("active");
        el("stepDot2").classList.add("done");
        el("stepLine2").classList.add("done");
        el("stepDot3").classList.add("active");

        el("step1Content").style.display = "none";
        el("step2Content").style.display = "none";
        el("ticketSuccess").classList.add("show");

        el("compraCorpo").scrollTop = 0;
    }

    // =========================================
    // Funções que as páginas podem chamar
    // =========================================
    window.abrirCompraModal = abrir;
    window.fecharCompraModal = fechar;

    // Cria a janela assim que a página carrega
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", criar);
    } else {
        criar();
    }
})();