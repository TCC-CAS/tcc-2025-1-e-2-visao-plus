import { responderCotacao } from "../core/FluxoCotacoes.js";
import { getUsuarioLogado } from "../core/auth.js";
import { API } from "../core/api.js";

function chamarEstilizacao() {
    if (document.getElementById("css-modal-cotacao")) return;
    const link = document.createElement("link");
    link.id = "css-modal-cotacao";
    link.rel = "stylesheet";
    link.href = "css/components/ModalCotacaoResposta.css";
    document.head.appendChild(link);
}

// ── Chat ────────────────────────────────────────────────

async function buscarMensagens(idCotacao) {
    const response = await fetch(`${API}/mensagens/cotacao/${idCotacao}`);
    if (!response.ok) return [];
    return response.json();
}

async function enviarMensagem(idCotacao, idRemetente, texto) {
    await fetch(`${API}/mensagens/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idCotacao, idRemetente, texto })
    });
}

function renderizarMensagens(mensagens, idUsuarioLogado, container) {
    container.innerHTML = "";

    if (mensagens.length === 0) {
        container.innerHTML = `<p class="chat-vazio">Nenhuma mensagem ainda. Diga olá!</p>`;
        return;
    }

    mensagens.forEach(msg => {
        const minha = msg.idRemetente === idUsuarioLogado;
        const hora = new Date(msg.enviadoEm).toLocaleTimeString("pt-BR", {
            hour: "2-digit", minute: "2-digit"
        });

        const div = document.createElement("div");
        div.classList.add("chat-msg", minha ? "minha" : "deles");
        div.innerHTML = `
            <div class="chat-bubble">${msg.texto}</div>
            <span class="chat-meta">${minha ? "Você" : msg.nomeRemetente} · ${hora}</span>
        `;
        container.appendChild(div);
    });

    // scroll automático pra última mensagem
    container.scrollTop = container.scrollHeight;
}

// ── Modal ───────────────────────────────────────────────

export function abrirModalCotacao(cotacao) {
    chamarEstilizacao();

    const usuario = getUsuarioLogado();
    const modal = document.createElement("div");
    modal.classList.add("modal-cotacao");

    modal.innerHTML = `
        <div class="modal-cotacao-content">

            <div class="modal-cotacao-header">
                <span class="modal-cotacao-titulo">Cotação #${cotacao.idCotacao} — ${cotacao.loja.nome}</span>
                <div style="display:flex;align-items:center;gap:10px">
                    <span class="modal-status-badge">${cotacao.status || "Pendente"}</span>
                    <button class="modal-cotacao-fechar" id="btnFecharModal">×</button>
                </div>
            </div>

            <div class="modal-cotacao-body">

                <!-- PAINEL ESQUERDO -->
                <div class="painel-esquerdo">

                    <div class="cotacao-dados">
                        <p class="painel-label">Produto</p>
                        <div class="dado-row">
                            <span class="dado-chave">Nome</span>
                            <span class="dado-valor">${cotacao.produto.nome}</span>
                        </div>
                        <div class="dado-row">
                            <span class="dado-chave">Grau OD</span>
                            <span class="dado-valor">${cotacao.produto.grauDireito}</span>
                        </div>
                        <div class="dado-row">
                            <span class="dado-chave">Grau OE</span>
                            <span class="dado-valor">${cotacao.produto.grauEsquerdo}</span>
                        </div>
                        <div class="dado-row">
                            <span class="dado-chave">Valor base</span>
                            <span class="dado-valor">R$ ${cotacao.produto.valor}</span>
                        </div>
                    </div>

                    <div class="resposta-box">
                        <p class="painel-label">Sua resposta</p>
                        <input id="valorFinal" type="number" step="0.01" min="0" placeholder="Valor final (R$)" />
                        <input id="prazoEntrega" type="number" placeholder="Prazo em dias" />
                        <textarea id="observacaoLoja" placeholder="Observação da loja"></textarea>
                        <button id="btnEnviarResposta">Enviar proposta</button>
                    </div>

                </div>

                <!-- PAINEL DIREITO: CHAT -->
                <div class="painel-direito">
                    <div class="chat-mensagens" id="chatMensagens">
                        <p class="chat-vazio">Carregando mensagens...</p>
                    </div>

                    <div class="chat-input-area">
                        <input type="text" id="chatInput" placeholder="Escreva uma mensagem..." />
                        <button id="btnEnviarChat">➤</button>
                    </div>
                </div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => modal.classList.add("ativo"), 10);

    // ── Referências internas ─────────────────────────────
    const chatContainer  = modal.querySelector("#chatMensagens");
    const chatInput      = modal.querySelector("#chatInput");
    const btnEnviarChat  = modal.querySelector("#btnEnviarChat");

    // ── Polling de mensagens ─────────────────────────────
    let intervalo = null;

    async function atualizarChat() {
        const mensagens = await buscarMensagens(cotacao.idCotacao);
        renderizarMensagens(mensagens, usuario.id, chatContainer);
    }

    atualizarChat();
    intervalo = setInterval(atualizarChat, 5000);

    // ── Enviar mensagem no chat ──────────────────────────
    async function submitMensagem() {
        const texto = chatInput.value.trim();
        if (!texto) return;

        chatInput.value = "";
        chatInput.disabled = true;
        btnEnviarChat.disabled = true;

        await enviarMensagem(cotacao.idCotacao, usuario.id, texto);
        await atualizarChat();

        chatInput.disabled = false;
        btnEnviarChat.disabled = false;
        chatInput.focus();
    }

    btnEnviarChat.addEventListener("click", submitMensagem);

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitMensagem();
        }
    });

    // ── Fechar ───────────────────────────────────────────
    function fechar() {
        clearInterval(intervalo);
        modal.classList.remove("ativo");
        setTimeout(() => modal.remove(), 200);
    }

    modal.querySelector("#btnFecharModal").onclick = fechar;

    modal.addEventListener("click", (e) => {
        if (e.target === modal) fechar();
    });

    // ── Enviar proposta ──────────────────────────────────
    modal.querySelector("#btnEnviarResposta").onclick = async () => {
        await responderCotacao(cotacao.idCotacao, cotacao.loja.id);
        fechar();
    };
}