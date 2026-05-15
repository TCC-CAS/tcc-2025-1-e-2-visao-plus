import { API } from "./api.js";
import { abrirModalCotacao } from "../components/ModalCotacaoResposta.js";
import { getUsuarioLogado } from "./auth.js";

export async function criarCotacao(dadosCotacao) {
    const response = await fetch(`${API}/cotacoes/criarCotacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosCotacao),
    });
    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
    return response.json();
}

export async function listarCotacoesPorUsuario(idUsuario) {
    const response = await fetch(`${API}/cotacoes/listarCotacoesPU/${idUsuario}`);
    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
    return response.json();
}

export async function listarCotacoesPorLoja(idLoja) {
    const response = await fetch(`${API}/cotacoes/listarCotacoesPL/${idLoja}`);
    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
    return response.json();
}

export function chamarEstilizacao() {
    if (document.getElementById("css-lista-cotacoes")) return;
    const link = document.createElement("link");
    link.id = "css-lista-cotacoes";
    link.rel = "stylesheet";
    link.href = "css/components/ListaCotacoes.css";
    document.head.appendChild(link);
}

// ── Mapeamento de status para label e cor ───────────────
const STATUS_CONFIG = {
    SOLICITADA:       { label: "Solicitada",        cor: "#6b7280" },
    NEGOCIANDO:       { label: "Negociando",         cor: "#156783" },
    PROPOSTA_ENVIADA: { label: "Proposta enviada",   cor: "#b45309" },
    APROVADA:         { label: "Aprovada",           cor: "#0f6e56" },
    AGUARDANDO_SINAL: { label: "Aguardando sinal",   cor: "#b45309" },
    RESERVADA:        { label: "Reservada",          cor: "#1d4ed8" },
    FINALIZADA:       { label: "Finalizada",         cor: "#166534" },
    CANCELADA:        { label: "Cancelada",          cor: "#991b1b" },
};

export function criarCardCotacao(cotacao, onStatusAtualizado) {
    const usuario = getUsuarioLogado();
    const ehLoja  = usuario?.tipoUsuario === "Vendedor";

    const card     = document.createElement("div");
    card.classList.add("card", "mb-3", "shadow-sm");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const nomeProduto = cotacao.produto?.nome     || "Produto";
    const nomeLoja    = cotacao.loja?.nome        || "Loja";
    const status      = cotacao.status            || "SOLICITADA";
    const valorBase   = cotacao.produto?.valor    ?? "-";
    const valorFinal  = cotacao.valorFinal        ?? null;
    const grauDir     = cotacao.produto?.grauDireito  ?? "-";
    const grauEsq     = cotacao.produto?.grauEsquerdo ?? "-";

    const cfg = STATUS_CONFIG[status] || { label: status, cor: "#6b7280" };

    cardBody.innerHTML = `
        <h5 class="card-title mb-2">${nomeProduto}</h5>
        <h6 class="card-subtitle mb-3 text-muted">${ehLoja ? "Cliente" : "Loja"}: ${ehLoja ? cotacao.nomeUsuario ?? "—" : nomeLoja}</h6>
        <div class="dados">
            <p class="mb-1">
                <strong>Status:</strong>
                <span style="color:${cfg.cor};font-weight:600">${cfg.label}</span>
            </p>
            <p class="mb-1"><strong>Grau:</strong> OD ${grauDir} | OE ${grauEsq}</p>
            <p class="mb-1"><strong>Valor base:</strong> R$ ${valorBase}</p>
            ${valorFinal ? `<p class="mb-1"><strong>Proposta:</strong> R$ ${valorFinal}</p>` : ""}
        </div>
    `;

    // Botão principal — abre o modal
    const botaoAbrir = document.createElement("button");
    botaoAbrir.classList.add("btn", "btn-primary", "mt-2");
    botaoAbrir.style.marginRight = "8px";
    botaoAbrir.innerText = "Ver detalhes";
    botaoAbrir.addEventListener("click", () => {
        abrirModalCotacao(cotacao, onStatusAtualizado);
    });
    cardBody.appendChild(botaoAbrir);

    card.appendChild(cardBody);
    return card;
}

export function initScrollCotacoes() {
    const lista    = document.getElementById("lista-cotacoes");
    const btnLeft  = document.getElementById("scroll-left");
    const btnRight = document.getElementById("scroll-right");

    if (!lista || !btnLeft || !btnRight) return;

    const scrollAmount = 5 * 256;
    btnRight.addEventListener("click", () => lista.scrollBy({ left:  scrollAmount, behavior: "smooth" }));
    btnLeft.addEventListener ("click", () => lista.scrollBy({ left: -scrollAmount, behavior: "smooth" }));
}