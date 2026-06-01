import { getUsuarioLogado } from "../core/auth.js";
import { API } from "../core/api.js";
import { enviarProposta, transicionarStatus } from "../core/FluxoCotacoes.js";

function chamarEstilizacao() {
    if (document.getElementById("css-modal-cotacao")) return;

    const link = document.createElement("link");
    link.id = "css-modal-cotacao";
    link.rel = "stylesheet";
    link.href = "css/components/ModalCotacaoResposta.css";
    document.head.appendChild(link);
}

function bloquearBotao(botao, texto) {
    if (!botao) return;

    botao.disabled = true;
    botao.classList.add("carregando");
    botao.dataset.textoOriginal = botao.textContent;
    botao.textContent = texto;
}

function desbloquearBotao(botao) {
    if (!botao) return;

    botao.disabled = false;
    botao.classList.remove("carregando");
    botao.textContent = botao.dataset.textoOriginal || botao.textContent;
}

function normalizarStatus(status) {
    if (status === "PROPOSTA_ENVIADA") return "RESPONDIDA";
    if (status === "NEGOCIANDO") return "EM_NEGOCIACAO";
    return status || "SOLICITADA";
}

function formatarStatus(status) {
    return normalizarStatus(status).replace(/_/g, " ");
}

function getIdCotacao(cotacao) {
    return cotacao.idCotacao || cotacao.id;
}

function usuarioPodeUsarModalLoja(usuario) {
    return usuario && usuario.tipoUsuario === "Vendedor";
}

function atualizarHeaderStatus(modal, novoStatus) {
    const badge = modal.querySelector(".modal-status-badge");
    if (badge) badge.textContent = formatarStatus(novoStatus);
}

/* =========================
   CHAT
========================= */

async function buscarMensagens(idCotacao) {
    const usuario = getUsuarioLogado();

    if (!usuario) return [];

    try {
        const response = await fetch(
            `${API}/mensagens/cotacao/${idCotacao}?idUsuario=${usuario.id}`
        );

        if (!response.ok) {
            const erro = await response.text();
            console.warn("Erro ao buscar mensagens:", erro);
            return [];
        }

        return response.json();

    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        return [];
    }
}

async function enviarMensagem(idCotacao, idRemetente, texto) {
    const response = await fetch(`${API}/mensagens/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idCotacao, idRemetente, texto })
    });

    if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro || "Erro ao enviar mensagem.");
    }

    return response.json();
}

function renderizarMensagens(mensagens, idUsuarioLogado, container) {
    container.innerHTML = "";

    if (!mensagens || mensagens.length === 0) {
        container.innerHTML = `<p class="chat-vazio">Nenhuma mensagem ainda.</p>`;
        return;
    }

    mensagens.forEach((msg) => {
        const minha = msg.idRemetente === idUsuarioLogado;
        const hora = msg.enviadoEm
            ? new Date(msg.enviadoEm).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            })
            : "";

        const div = document.createElement("div");
        div.classList.add("chat-msg", minha ? "minha" : "deles");

        div.innerHTML = `
            <div class="chat-bubble">${msg.texto}</div>
            <span class="chat-meta">${minha ? "Você" : msg.nomeRemetente || "Cliente"} · ${hora}</span>
        `;

        container.appendChild(div);
    });

    container.scrollTop = container.scrollHeight;
}

/* =========================
   AÇÕES LOJA
========================= */

function criarBotao(texto, classe, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = texto;
    btn.className = `btn-acao-cotacao ${classe}`;
    btn.addEventListener("click", async () => {
        await onClick(btn);
    });
    return btn;
}

async function executarTransicao(cotacao, novoStatus, botao, modal, onStatusAtualizado) {
    const usuario = getUsuarioLogado();
    const idCotacao = getIdCotacao(cotacao);

    try {
        bloquearBotao(botao, "Processando...");

        const cotacaoAtualizada = await transicionarStatus(idCotacao, novoStatus, loja?.id);

        cotacao.status = cotacaoAtualizada.status;
        onStatusAtualizado?.(cotacaoAtualizada);

        atualizarHeaderStatus(modal, cotacaoAtualizada.status);
        renderizarPainelLoja(cotacao, modal, onStatusAtualizado);

    } catch (e) {
        alert(e.message || "Erro ao atualizar cotação.");
    } finally {
        desbloquearBotao(botao);
    }
}

function criarFormularioProposta(cotacao, modal, onStatusAtualizado) {
    const wrapper = document.createElement("div");

    let enviandoProposta = false;

    wrapper.innerHTML = `
        <div class="resposta-box">
            <p class="painel-label">Enviar proposta</p>

            <input id="valorFinal" type="number" step="0.01" min="0" placeholder="Valor final (R$)" />

            <input id="prazoEntrega" type="number" min="1" placeholder="Prazo em dias" />

            <textarea id="observacaoLoja" placeholder="Observação da loja (opcional)"></textarea>

            <button id="btnEnviarResposta" type="button">Enviar proposta</button>
        </div>
    `;

    const inputValor = wrapper.querySelector("#valorFinal");
    const inputPrazo = wrapper.querySelector("#prazoEntrega");
    const inputObservacao = wrapper.querySelector("#observacaoLoja");
    const btnEnviar = wrapper.querySelector("#btnEnviarResposta");

    btnEnviar.addEventListener("click", async () => {
        if (enviandoProposta) return;

        const valorFinal = parseFloat(inputValor.value);
        const prazoEntrega = parseInt(inputPrazo.value);
        const observacaoLoja = inputObservacao.value.trim();

        if (!valorFinal || valorFinal <= 0) {
            alert("Informe um valor final válido.");
            return;
        }

        if (!prazoEntrega || prazoEntrega <= 0) {
            alert("Informe um prazo de entrega válido.");
            return;
        }

        try {
            enviandoProposta = true;

            btnEnviar.disabled = true;
            btnEnviar.classList.add("carregando");
            btnEnviar.dataset.textoOriginal = btnEnviar.textContent;
            btnEnviar.textContent = "Enviando...";

            inputValor.disabled = true;
            inputPrazo.disabled = true;
            inputObservacao.disabled = true;

            const cotacaoAtualizada = await enviarProposta(
                getIdCotacao(cotacao),
                cotacao.loja?.id,
                valorFinal,
                prazoEntrega,
                observacaoLoja
            );

            cotacao.status = cotacaoAtualizada.status;
            cotacao.valorFinal = cotacaoAtualizada.valorFinal;
            cotacao.prazoEntregaConfirmado = cotacaoAtualizada.prazoEntregaConfirmado;
            cotacao.observacaoLoja = cotacaoAtualizada.observacaoLoja;

            onStatusAtualizado?.(cotacaoAtualizada);

            atualizarHeaderStatus(modal, cotacaoAtualizada.status);

            renderizarPainelLoja(cotacao, modal, onStatusAtualizado);

        } catch (e) {
            alert(e.message || "Erro ao enviar proposta.");

            enviandoProposta = false;

            btnEnviar.disabled = false;
            btnEnviar.classList.remove("carregando");
            btnEnviar.textContent = btnEnviar.dataset.textoOriginal || "Enviar proposta";

            inputValor.disabled = false;
            inputPrazo.disabled = false;
            inputObservacao.disabled = false;
        }
    });

    return wrapper;
}

function renderizarPainelLoja(cotacao, modal, onStatusAtualizado) {
    const container = modal.querySelector("#painelAcoes");
    container.innerHTML = "";

    const status = normalizarStatus(cotacao.status);

    const aviso = document.createElement("div");
    aviso.className = "modal-aviso-papel";
    aviso.textContent = "Você está visualizando esta cotação como loja.";
    container.appendChild(aviso);

    const acoes = document.createElement("div");
    acoes.className = "acoes-cotacao";

    if (status === "SOLICITADA" || status === "EM_NEGOCIACAO") {
        acoes.appendChild(criarFormularioProposta(cotacao, modal, onStatusAtualizado));
    }

    if (status === "RESPONDIDA") {
        const aguardando = document.createElement("div");
        aguardando.className = "resposta-bloqueada";
        aguardando.textContent = "Proposta enviada. Aguarde a resposta do consumidor.";
        acoes.appendChild(aguardando);
    }

    if (status === "APROVADA") {
        acoes.appendChild(criarBotao("Exigir sinal antes de reservar", "btn-reserva", async (btn) => {
            await executarTransicao(cotacao, "AGUARDANDO_SINAL", btn, modal, onStatusAtualizado);
        }));

        acoes.appendChild(criarBotao("Reservar produto direto", "btn-aprovar", async (btn) => {
            await executarTransicao(cotacao, "RESERVADA", btn, modal, onStatusAtualizado);
        }));
    }

    if (status === "AGUARDANDO_SINAL") {
        acoes.appendChild(criarBotao("Confirmar sinal recebido", "btn-aprovar", async (btn) => {
            await executarTransicao(cotacao, "RESERVADA", btn, modal, onStatusAtualizado);
        }));
    }

    if (status === "RESERVADA") {
        acoes.appendChild(criarBotao("Finalizar — produto entregue", "btn-finalizar", async (btn) => {
            await executarTransicao(cotacao, "FINALIZADA", btn, modal, onStatusAtualizado);
        }));
    }

    if (["CANCELADA", "REJEITADA", "FINALIZADA"].includes(status)) {
        const encerrada = document.createElement("div");
        encerrada.className = "resposta-bloqueada";
        encerrada.textContent = "Esta cotação está encerrada.";
        acoes.appendChild(encerrada);
    }

    container.appendChild(acoes);
}

/* =========================
   MODAL LOJA
========================= */

export function abrirModalRespostaCotacaoLoja(cotacao, onStatusAtualizado) {
    chamarEstilizacao();

    const usuario = getUsuarioLogado();

    if (!usuarioPodeUsarModalLoja(usuario)) {
        alert("Apenas usuários de loja podem responder cotações.");
        return;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal-cotacao");

    modal.innerHTML = `
        <div class="modal-cotacao-content modal-loja">

            <div class="modal-cotacao-header">
                <span class="modal-cotacao-titulo">
                    Responder cotação #${getIdCotacao(cotacao)} — ${cotacao.usuario?.nome ?? "Cliente"}
                </span>

                <div style="display:flex;align-items:center;gap:10px">
                    <span class="modal-status-badge">
                        ${formatarStatus(cotacao.status)}
                    </span>
                    <button class="modal-cotacao-fechar" id="btnFecharModal">×</button>
                </div>
            </div>

            <div class="modal-cotacao-body">

                <div class="painel-esquerdo">

                    <div class="cotacao-dados">
                        <p class="painel-label">Solicitação do cliente</p>

                        <div class="dado-row">
                            <span class="dado-chave">Cliente</span>
                            <span class="dado-valor">${cotacao.usuario?.nome ?? "—"}</span>
                        </div>

                        <div class="dado-row">
                            <span class="dado-chave">Produto</span>
                            <span class="dado-valor">${cotacao.produto?.nome ?? "—"}</span>
                        </div>

                        <div class="dado-row">
                            <span class="dado-chave">Grau OD</span>
                            <span class="dado-valor">${cotacao.produto?.grauDireito ?? "—"}</span>
                        </div>

                        <div class="dado-row">
                            <span class="dado-chave">Grau OE</span>
                            <span class="dado-valor">${cotacao.produto?.grauEsquerdo ?? "—"}</span>
                        </div>

                        <div class="dado-row">
                            <span class="dado-chave">Valor base</span>
                            <span class="dado-valor">R$ ${cotacao.produto?.valor ?? cotacao.valorBase ?? "—"}</span>
                        </div>

                        ${cotacao.valorFinal ? `
                            <div class="dado-row">
                                <span class="dado-chave">Proposta enviada</span>
                                <span class="dado-valor" style="color:#0f6e56">
                                    R$ ${cotacao.valorFinal}
                                </span>
                            </div>
                        ` : ""}
                    </div>

                    <div id="painelAcoes"></div>

                </div>

                <div class="painel-direito">
                    <div class="chat-mensagens" id="chatMensagens">
                        <p class="chat-vazio">Carregando mensagens...</p>
                    </div>

                    <div class="chat-input-area">
                        <input type="text" id="chatInput"  maxlength="500" placeholder="Escreva uma mensagem..." />
                        <button id="btnEnviarChat">➤</button>
                    </div>
                </div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => modal.classList.add("ativo"), 10);

    renderizarPainelLoja(cotacao, modal, onStatusAtualizado);

    iniciarChat(modal, cotacao, usuario);

    function fechar() {
        modal.classList.remove("ativo");
        setTimeout(() => modal.remove(), 200);
    }

    modal.querySelector("#btnFecharModal").onclick = fechar;

    modal.addEventListener("click", (e) => {
        if (e.target === modal) fechar();
    });
}

function iniciarChat(modal, cotacao, usuario) {
    const chatContainer = modal.querySelector("#chatMensagens");
    const chatInput = modal.querySelector("#chatInput");
    const btnEnviarChat = modal.querySelector("#btnEnviarChat");

    const idCotacao = getIdCotacao(cotacao);

    let intervalo = null;

    async function atualizarChat() {
        const mensagens = await buscarMensagens(idCotacao);
        renderizarMensagens(mensagens, usuario.id, chatContainer);
    }

    async function submitMensagem() {
        const texto = chatInput.value.trim();
        if (!texto) return;

        if (texto.length > 500) {
            alert("A mensagem deve ter no máximo 500 caracteres.");
            return;
        }

        try {
            bloquearBotao(btnEnviarChat, "...");
            chatInput.disabled = true;

            chatInput.value = "";

            await enviarMensagem(idCotacao, usuario.id, texto);
            await atualizarChat();

        } catch (e) {
            alert(e.message || "Erro ao enviar mensagem.");
        } finally {
            desbloquearBotao(btnEnviarChat);
            chatInput.disabled = false;
            chatInput.focus();
        }
    }

    atualizarChat();
    intervalo = setInterval(atualizarChat, 5000);

    btnEnviarChat.addEventListener("click", submitMensagem);

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitMensagem();
        }
    });

    const btnFechar = modal.querySelector("#btnFecharModal");
    const fecharOriginal = btnFechar.onclick;

    btnFechar.onclick = () => {
        clearInterval(intervalo);
        fecharOriginal?.();
    };
}