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

// ── Chat ────────────────────────────────────────────────

async function buscarMensagens(idCotacao) {
    try {
        const response = await fetch(`${API}/mensagens/cotacao/${idCotacao}`);
        if (!response.ok) return [];
        return response.json();
    } catch { return []; }
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
        const hora  = new Date(msg.enviadoEm).toLocaleTimeString("pt-BR", {
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

    container.scrollTop = container.scrollHeight;
}

// ── Painel de ações por status e ator ──────────────────

function renderizarPainelAcoes(cotacao, usuario, modal, onStatusAtualizado) {
    const container = modal.querySelector("#painelAcoes");
    container.innerHTML = "";

    const status = cotacao.status;
    const ehLoja = usuario?.tipoUsuario === "Vendedor";
    const idAtor = usuario?.id;

    // Estados finais — sem ações
    if (status === "FINALIZADA" || status === "CANCELADA") {
        container.innerHTML = `
            <p style="text-align:center;color:#9ca3af;font-size:13px;margin:0">
                Esta cotação está encerrada.
            </p>`;
        return;
    }

    // ── Botão cancelar — sempre disponível enquanto não encerrado ──
    const btnCancelar = criarBotao("Cancelar cotação", "#fee2e2", "#991b1b", async () => {
        if (!confirm("Tem certeza que deseja cancelar esta cotação?")) return;
        await executarTransicao(cotacao, "CANCELADA", idAtor, modal, onStatusAtualizado);
    });

    // ── Ações da LOJA ───────────────────────────────────
    if (ehLoja) {
        if (status === "SOLICITADA") {
            container.appendChild(criarBotao("Iniciar negociação", "#f0f9ff", "#156783", async () => {
                await executarTransicao(cotacao, "NEGOCIANDO", idAtor, modal, onStatusAtualizado);
            }));
        }

        if (status === "SOLICITADA" || status === "NEGOCIANDO") {
            container.appendChild(criarBotaoEnviarProposta(cotacao, usuario, modal, onStatusAtualizado));
        }

        if (status === "APROVADA") {
            container.appendChild(criarBotao("Exigir sinal antes de reservar", "#fffbeb", "#b45309", async () => {
                await executarTransicao(cotacao, "AGUARDANDO_SINAL", idAtor, modal, onStatusAtualizado);
            }));
            container.appendChild(criarBotao("Reservar produto direto", "#f0fdf4", "#166534", async () => {
                await executarTransicao(cotacao, "RESERVADA", idAtor, modal, onStatusAtualizado);
            }));
        }

        if (status === "AGUARDANDO_SINAL") {
            container.appendChild(criarBotao("Confirmar sinal recebido", "#f0fdf4", "#166534", async () => {
                await executarTransicao(cotacao, "RESERVADA", idAtor, modal, onStatusAtualizado);
            }));
        }

        if (status === "RESERVADA") {
            container.appendChild(criarBotao("Finalizar — produto entregue", "#f0fdf4", "#166534", async () => {
                await executarTransicao(cotacao, "FINALIZADA", idAtor, modal, onStatusAtualizado);
            }));
        }
    }

    // ── Ações do CLIENTE ────────────────────────────────
    if (!ehLoja) {
        if (status === "PROPOSTA_ENVIADA") {
            container.appendChild(criarBotao("✓ Aprovar proposta", "#f0fdf4", "#166534", async () => {
                await executarTransicao(cotacao, "APROVADA", idAtor, modal, onStatusAtualizado);
            }));
            container.appendChild(criarBotao("Pedir revisão", "#f0f9ff", "#156783", async () => {
                await executarTransicao(cotacao, "NEGOCIANDO", idAtor, modal, onStatusAtualizado);
            }));
        }

        if (status === "RESERVADA") {
            container.appendChild(criarBotao("Finalizar — produto retirado", "#f0fdf4", "#166534", async () => {
                await executarTransicao(cotacao, "FINALIZADA", idAtor, modal, onStatusAtualizado);
            }));
        }
    }

    container.appendChild(btnCancelar);
}

// ── Botão genérico ──────────────────────────────────────

function criarBotao(texto, bgColor, textColor, onClick) {
    const btn = document.createElement("button");
    btn.textContent = texto;
    btn.style.cssText = `
        width:100%; padding:10px; border-radius:8px;
        background:${bgColor}; color:${textColor};
        border:1px solid ${textColor}33;
        font-weight:600; font-size:13px;
        cursor:pointer; transition:opacity 0.15s;
        margin-bottom:8px;
    `;
    btn.addEventListener("mouseenter", () => btn.style.opacity = "0.8");
    btn.addEventListener("mouseleave", () => btn.style.opacity = "1");
    btn.addEventListener("click", onClick);
    return btn;
}

// ── Botão enviar proposta com campos inline ─────────────

function criarBotaoEnviarProposta(cotacao, usuario, modal, onStatusAtualizado) {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "margin-bottom:8px;";
    wrapper.innerHTML = `
        <div class="resposta-box">
            <p class="painel-label">Enviar proposta</p>
            <input id="valorFinal"     type="number" step="0.01" min="0" placeholder="Valor final (R$)" />
            <input id="prazoEntrega"   type="number"             min="1" placeholder="Prazo em dias" />
            <textarea id="observacaoLoja" placeholder="Observação (opcional)"></textarea>
            <button id="btnEnviarResposta">Enviar proposta</button>
        </div>
    `;

    wrapper.querySelector("#btnEnviarResposta").addEventListener("click", async () => {
        const valorFinal     = parseFloat(wrapper.querySelector("#valorFinal").value);
        const prazoEntrega   = parseInt(wrapper.querySelector("#prazoEntrega").value);
        const observacaoLoja = wrapper.querySelector("#observacaoLoja").value.trim();

        if (!valorFinal || !prazoEntrega) {
            alert("Preencha o valor final e o prazo.");
            return;
        }

        try {
            const cotacaoAtualizada = await enviarProposta(
                cotacao.idCotacao,
                cotacao.loja.id,
                valorFinal,
                prazoEntrega,
                observacaoLoja
            );
            onStatusAtualizado?.(cotacaoAtualizada);
            atualizarHeaderStatus(modal, cotacaoAtualizada.status);
            cotacao.status = cotacaoAtualizada.status;
            renderizarPainelAcoes(cotacao, usuario, modal, onStatusAtualizado);
        } catch (e) {
            alert("Erro ao enviar proposta: " + e.message);
        }
    });

    return wrapper;
}

// ── Executa transição e atualiza o modal ────────────────

async function executarTransicao(cotacao, novoStatus, idAtor, modal, onStatusAtualizado) {
    try {
        const cotacaoAtualizada = await transicionarStatus(cotacao.idCotacao, novoStatus, idAtor);
        cotacao.status = cotacaoAtualizada.status;
        onStatusAtualizado?.(cotacaoAtualizada);
        atualizarHeaderStatus(modal, cotacaoAtualizada.status);

        const usuario = getUsuarioLogado();
        renderizarPainelAcoes(cotacao, usuario, modal, onStatusAtualizado);
    } catch (e) {
        alert("Erro: " + e.message);
    }
}

function atualizarHeaderStatus(modal, novoStatus) {
    const badge = modal.querySelector(".modal-status-badge");
    if (badge) badge.textContent = novoStatus.replace(/_/g, " ");
}

// ── Modal principal ─────────────────────────────────────

export function abrirModalCotacao(cotacao, onStatusAtualizado) {
    chamarEstilizacao();

    const usuario = getUsuarioLogado();
    const modal   = document.createElement("div");
    modal.classList.add("modal-cotacao");

    modal.innerHTML = `
        <div class="modal-cotacao-content">

            <div class="modal-cotacao-header">
                <span class="modal-cotacao-titulo">
                    Cotação #${cotacao.idCotacao} — ${cotacao.loja?.nome ?? ""}
                </span>
                <div style="display:flex;align-items:center;gap:10px">
                    <span class="modal-status-badge">
                        ${(cotacao.status ?? "SOLICITADA").replace(/_/g, " ")}
                    </span>
                    <button class="modal-cotacao-fechar" id="btnFecharModal">×</button>
                </div>
            </div>

            <div class="modal-cotacao-body">

                <div class="painel-esquerdo">

                    <div class="cotacao-dados">
                        <p class="painel-label">Produto</p>
                        <div class="dado-row">
                            <span class="dado-chave">Nome</span>
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
                            <span class="dado-valor">R$ ${cotacao.produto?.valor ?? "—"}</span>
                        </div>
                        ${cotacao.valorFinal ? `
                        <div class="dado-row">
                            <span class="dado-chave">Proposta</span>
                            <span class="dado-valor" style="color:#0f6e56">
                                R$ ${cotacao.valorFinal}
                            </span>
                        </div>
                        <div class="dado-row">
                            <span class="dado-chave">Prazo confirmado</span>
                            <span class="dado-valor">${cotacao.prazoEntregaConfirmado} dias</span>
                        </div>` : ""}
                        ${cotacao.observacaoLoja ? `
                        <div class="dado-row" style="flex-direction:column;align-items:flex-start;gap:4px">
                            <span class="dado-chave">Obs. da loja</span>
                            <span class="dado-valor" style="font-weight:400;color:#374151">
                                ${cotacao.observacaoLoja}
                            </span>
                        </div>` : ""}
                    </div>

                    <div id="painelAcoes" style="display:flex;flex-direction:column;gap:0"></div>

                </div>

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

    // Renderiza ações de acordo com status + ator
    renderizarPainelAcoes(cotacao, usuario, modal, onStatusAtualizado);

    // ── Chat ────────────────────────────────────────────
    const chatContainer = modal.querySelector("#chatMensagens");
    const chatInput     = modal.querySelector("#chatInput");
    const btnEnviarChat = modal.querySelector("#btnEnviarChat");

    let intervalo = null;

    async function atualizarChat() {
        const mensagens = await buscarMensagens(cotacao.idCotacao);
        renderizarMensagens(mensagens, usuario.id, chatContainer);
    }

    atualizarChat();
    intervalo = setInterval(atualizarChat, 5000);

    async function submitMensagem() {
        const texto = chatInput.value.trim();
        if (!texto) return;
        chatInput.value    = "";
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

    // ── Fechar ──────────────────────────────────────────
    function fechar() {
        clearInterval(intervalo);
        modal.classList.remove("ativo");
        setTimeout(() => modal.remove(), 200);
    }

    modal.querySelector("#btnFecharModal").onclick = fechar;
    modal.addEventListener("click", (e) => {
        if (e.target === modal) fechar();
    });
}