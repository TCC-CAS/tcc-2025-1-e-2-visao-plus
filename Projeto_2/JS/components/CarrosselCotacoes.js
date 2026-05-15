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
}