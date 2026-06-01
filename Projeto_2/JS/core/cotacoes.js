import { API } from "./api.js";
import { getUsuarioLogado } from "./auth.js";

export async function criarCotacao(dadosCotacao) {
    const response = await fetch(`${API}/cotacoes/criarCotacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosCotacao),
    });

    if (!response.ok) {
        const mensagemErro = await response.text();
        throw new Error(mensagemErro || `Erro na requisição: ${response.status}`);
    }

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

export function criarCardCotacao(cotacao, onAbrir) {
    const usuario = getUsuarioLogado();
    const ehLoja = usuario?.tipoUsuario === "Vendedor";

    const card = document.createElement("div");
    card.classList.add("card-cotacao");

    const nomeProduto = cotacao.produto?.nome || "Produto";
    const nomeLoja = cotacao.loja?.nome || "Loja";
    const nomeCliente = cotacao.usuario?.nome || cotacao.nomeUsuario || "Cliente";

    const status = cotacao.status || "SOLICITADA";
    const valorBase = cotacao.produto?.valor ?? cotacao.valorBase ?? "-";
    const valorFinal = cotacao.valorFinal ?? null;
    const grauDir = cotacao.produto?.grauDireito ?? "-";
    const grauEsq = cotacao.produto?.grauEsquerdo ?? "-";

    const cfg = STATUS_CONFIG?.[status] || {
        label: status.replace(/_/g, " "),
        cor: "#6b7280"
    };

    card.innerHTML = `
        <div class="card-cotacao-topo">
            <div>
                <h3>${nomeProduto}</h3>
                <p>${ehLoja ? "Cliente" : "Loja"}: ${ehLoja ? nomeCliente : nomeLoja}</p>
            </div>

            <span class="badge-status" style="background:${cfg.cor}">
                ${cfg.label}
            </span>
        </div>

        <div class="card-cotacao-dados">
            <p><strong>Grau:</strong> OD ${grauDir} | OE ${grauEsq}</p>
            <p><strong>Valor base:</strong> R$ ${valorBase}</p>
            ${
                valorFinal
                    ? `<p><strong>Proposta:</strong> R$ ${valorFinal}</p>`
                    : `<p><strong>Proposta:</strong> aguardando</p>`
            }
        </div>

        <button type="button" class="btn-ver-cotacao">
            Ver detalhes
        </button>
    `;

    const botaoAbrir = card.querySelector(".btn-ver-cotacao");

    botaoAbrir.addEventListener("click", (event) => {
        event.stopPropagation();

        if (typeof onAbrir === "function") {
            onAbrir(cotacao);
        }
    });

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