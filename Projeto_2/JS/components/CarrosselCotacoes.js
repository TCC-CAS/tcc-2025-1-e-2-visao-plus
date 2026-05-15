import { getUsuarioLogado } from "../core/auth.js";
import { listarCotacoesPorUsuario, listarCotacoesPorLoja, criarCardCotacao, chamarEstilizacao } from "../core/cotacoes.js";
import { getLojaDoUsuario } from "../core/loja.js";

function injetarEstilizacao() {
    if (document.getElementById("css-carrossel-cotacoes")) return;
    const link = document.createElement("link");
    link.id = "css-carrossel-cotacoes";
    link.rel = "stylesheet";
    link.href = "css/components/CarrosselCotacoes.css";
    document.head.appendChild(link);
 
    // CSS das cotações também
    chamarEstilizacao();
}

// ── Monta o HTML do carrossel num container existente ───
 
export function montarCarrosselCotacoes(containerId) {
    injetarEstilizacao();
 
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container não encontrado: ${containerId}`);
        return;
    }

    const usuario = getUsuarioLogado();
    if (!usuario) {
        console.warn("Usuário não logado");
        return;
    }
    
    const ehLoja = usuario.tipoUsuario === "Vendedor";
    const titulo = ehLoja ? "Cotações recebidas" : "Minhas cotações";
 
    container.innerHTML = `
        <div class="carrossel-cotacoes-wrapper" id="carrossel-cotacoes-wrapper">
 
            <div class="carrossel-header" id="carrossel-header">
                <div class="carrossel-header-esq">
                    <span class="carrossel-titulo">${titulo}</span>
                    <span class="carrossel-badge" id="carrossel-badge">0</span>
                </div>
                <button class="carrossel-toggle" id="carrossel-toggle" aria-label="Minimizar">
                    <span id="carrossel-toggle-icone">▾</span>
                </button>
            </div>
 
            <div class="carrossel-body" id="carrossel-body">
                <div class="cotacoes-wrapper">
                    <button class="scroll-btn left"  id="scroll-left-cotacoes">‹</button>
                    <div class="lista-cotacoes" id="lista-cotacoes-componente"></div>
                    <button class="scroll-btn right" id="scroll-right-cotacoes">›</button>
                </div>
            </div>
 
        </div>
    `;

    // Toggle collapse
    const body   = container.querySelector("#carrossel-body");
    const toggle = container.querySelector("#carrossel-toggle");
    const icone  = container.querySelector("#carrossel-toggle-icone");
    let aberto   = true;
 
    toggle.addEventListener("click", () => {
        aberto = !aberto;
        body.classList.toggle("fechado", !aberto);
        icone.textContent = aberto ? "▾" : "▸";
        toggle.setAttribute("aria-label", aberto ? "Minimizar" : "Expandir");
    });
 
}