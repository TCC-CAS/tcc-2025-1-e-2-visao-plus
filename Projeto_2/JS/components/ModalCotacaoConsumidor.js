import { getUsuarioLogado } from "../core/auth.js";
import { API } from "../core/api.js";
import { transicionarStatus } from "../core/FluxoCotacoes.js";

function chamarEstilizacao() {
    if (document.getElementById("css-modal-cotacao")) return;

    const link = document.createElement("link");
    link.id = "css-modal-cotacao";
    link.rel = "stylesheet";
    link.href = "css/components/ModalCotacaoResposta.css";
    document.head.appendChild(link);
}

function mostrarErro(texto) {
    alert(texto);
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
    if (status === "EM_NEGOCIACAO") return "NEGOCIANDO";
    return status || "SOLICITADA";
}

function formatarStatus(status) {
    return normalizarStatus(status).replace(/_/g, " ");
}

function getIdCotacao(cotacao) {
    return cotacao.idCotacao || cotacao.id;
}

function usuarioPodeUsarModalConsumidor(usuario) {
    return usuario && usuario.tipoUsuario === "Comum";
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
            <span class="chat-meta">${minha ? "Você" : msg.nomeRemetente || "Loja"} · ${hora}</span>
        `;

        container.appendChild(div);
    });

    container.scrollTop = container.scrollHeight;
}

/* =========================
   BOTÕES CONSUMIDOR
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

        const cotacaoAtualizada = await transicionarStatus(idCotacao, novoStatus, usuario.id);

        cotacao.status = cotacaoAtualizada.status;
        onStatusAtualizado?.(cotacaoAtualizada);

        atualizarHeaderStatus(modal, cotacaoAtualizada.status);
        renderizarPainelConsumidor(cotacao, modal, onStatusAtualizado);

    } catch (e) {
        mostrarErro(e.message || "Erro ao atualizar cotação.");
    } finally {
        desbloquearBotao(botao);
    }
}

function renderizarPainelConsumidor(cotacao, modal, onStatusAtualizado) {
    const container = modal.querySelector("#painelAcoes");
    container.innerHTML = "";

    const status = normalizarStatus(cotacao.status);

    const aviso = document.createElement("div");
    aviso.className = "modal-aviso-papel";
    aviso.textContent = "Você está visualizando esta cotação como consumidor.";
    container.appendChild(aviso);

    const acoes = document.createElement("div");
    acoes.className = "acoes-cotacao";

    if (status === "SOLICITADA") {
        acoes.appendChild(criarBotao("Cancelar cotação", "btn-cancelar", async (btn) => {
            if (!confirm("Deseja cancelar esta cotação?")) return;
            await executarTransicao(cotacao, "CANCELADA", btn, modal, onStatusAtualizado);
        }));
    }

    if (status === "RESPONDIDA") {
        acoes.appendChild(criarBotao("✓ Aprovar proposta", "btn-aprovar", async (btn) => {
            await executarTransicao(cotacao, "APROVADA", btn, modal, onStatusAtualizado);
        }));

        acoes.appendChild(criarBotao("Pedir negociação", "btn-negociar", async (btn) => {
            await executarTransicao(cotacao, "NEGOCIANDO", btn, modal, onStatusAtualizado);
        }));

        acoes.appendChild(criarBotao("Rejeitar proposta", "btn-rejeitar", async (btn) => {
            if (!confirm("Deseja rejeitar esta proposta?")) return;
            await executarTransicao(cotacao, "REJEITADA", btn, modal, onStatusAtualizado);
        }));
    }

    if (status === "NEGOCIANDO") {
        acoes.appendChild(criarBotao("Cancelar cotação", "btn-cancelar", async (btn) => {
            if (!confirm("Deseja cancelar esta negociação?")) return;
            await executarTransicao(cotacao, "CANCELADA", btn, modal, onStatusAtualizado);
        }));
    }

    if (status === "RESERVADA") {
        acoes.appendChild(criarBotao("Finalizar — produto retirado", "btn-finalizar", async (btn) => {
            await executarTransicao(cotacao, "FINALIZADA", btn, modal, onStatusAtualizado);
        }));
    }

    if (["CANCELADA", "REJEITADA", "FINALIZADA"].includes(status)) {
        const encerrada = document.createElement("div");
        encerrada.className = "resposta-bloqueada";
        encerrada.textContent = "Esta cotação está encerrada.";
        acoes.appendChild(encerrada);
    }

    if (status === "APROVADA") {
        const aprovada = document.createElement("div");
        aprovada.className = "resposta-bloqueada";
        aprovada.textContent = "Proposta aprovada. Aguarde a próxima etapa de reserva/sinal.";
        acoes.appendChild(aprovada);
    }

    container.appendChild(acoes);
}

function atualizarHeaderStatus(modal, novoStatus) {
    const badge = modal.querySelector(".modal-status-badge");
    if (badge) badge.textContent = formatarStatus(novoStatus);
}

/* =========================
   MODAL CONSUMIDOR
========================= */

export function abrirModalCotacaoConsumidor(cotacao, onStatusAtualizado) {
    chamarEstilizacao();

    const usuario = getUsuarioLogado();

    if (!usuarioPodeUsarModalConsumidor(usuario)) {
        alert("Apenas consumidores podem usar este modal de cotação.");
        return;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal-cotacao");

    modal.innerHTML = `
        <div class="modal-cotacao-content modal-consumidor">

            <div class="modal-cotacao-header">
                <span class="modal-cotacao-titulo">
                    Minha cotação #${getIdCotacao(cotacao)} — ${cotacao.loja?.nome ?? ""}
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
                        <p class="painel-label">Produto solicitado</p>

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
                                <span class="dado-chave">Proposta da loja</span>
                                <span class="dado-valor" style="color:#0f6e56">
                                    R$ ${cotacao.valorFinal}
                                </span>
                            </div>
                        ` : ""}

                        ${cotacao.prazoEntregaConfirmado ? `
                            <div class="dado-row">
                                <span class="dado-chave">Prazo</span>
                                <span class="dado-valor">${cotacao.prazoEntregaConfirmado} dias</span>
                            </div>
                        ` : ""}

                        ${cotacao.observacaoLoja ? `
                            <div class="dado-row" style="flex-direction:column;align-items:flex-start;gap:4px">
                                <span class="dado-chave">Observação da loja</span>
                                <span class="dado-valor" style="font-weight:400;color:#374151">
                                    ${cotacao.observacaoLoja}
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

    renderizarPainelConsumidor(cotacao, modal, onStatusAtualizado);

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
            mostrarErro(e.message || "Erro ao enviar mensagem.");
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