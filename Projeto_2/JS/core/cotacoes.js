import { API } from "./api.js"; // API = "http://localhost:8080"
import { buscarLojaPorId } from "./loja.js";
import {abrirModalCotacao} from "../components/ModalCotacaoResposta.js"

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

export function chamarEstilizacao() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/components/ListaCotacoes.css";
    document.head.appendChild(link);
}

export function criarCardCotacao(cotacao) {

    const card = document.createElement("div");
    card.classList.add("card", "mb-3", "shadow-sm");
    

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // ===== DADOS REAIS DO JSON =====
    const nomeProduto = cotacao.produto?.nome || "Produto";
    const loja = cotacao.loja
    const status = cotacao.status || "-";

    const valorBase = cotacao.produto?.valor ?? "-";
    const valorFinal = cotacao.valorFinal ?? "-";
    const prazo = cotacao.produto?.prazoEntrega ?? "-";

    const grauDir = cotacao.produto?.grauDireito ?? "-";
    const grauEsq = cotacao.produto?.grauEsquerdo ?? "-";

    // ===== HTML =====
    cardBody.innerHTML = `
        <h5 class="card-title mb-2">${nomeProduto}</h5>
        <h6 class="card-subtitle mb-3 text-muted">Loja ${loja.nome}</h6>

        <div class="dados"> 
        <p class="mb-1"><strong>Status:</strong> ${status}</p>

        <p class="mb-1">
            <strong>Grau:</strong> 
            OD ${grauDir} | OE ${grauEsq}
        </p>

        <p class="mb-1"><strong>Valor:</strong> R$ ${valorBase}</p>
        <p class="mb-1"><strong>Prazo:</strong> ${prazo} dias</p>
        </div>
    `;

    const botao = document.createElement("button");
    botao.classList.add("btn", "btn-primary", "mt-2");
    botao.innerText = "Responder";
    botao.addEventListener("click", () => {
        abrirModalCotacao(cotacao);
    });

    cardBody.appendChild(botao);

    card.appendChild(cardBody);
    return card;
}

export function initScrollCotacoes() {
    const lista = document.getElementById("lista-cotacoes");
    const btnLeft = document.getElementById("scroll-left");
    const btnRight = document.getElementById("scroll-right");

    if (!lista || !btnLeft || !btnRight) return;

    const scrollAmount = 5 * 256;

    btnRight.addEventListener("click", () => {
        lista.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    btnLeft.addEventListener("click", () => {
        lista.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
}

