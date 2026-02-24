// js/components/modalCotacao.js

import { getUsuarioLogado } from "../core/auth.js";
import { criarCotacao } from "../core/cotacoes.js";

// ------------------------------
// Estado interno do modal
// ------------------------------
let lenteSelecionada = null;
let armacaoSelecionada = null;

// ------------------------------
// Elementos do DOM
// ------------------------------
const modal = document.getElementById("modal-cotacao");
const btnFlutuante = document.getElementById("btn-cotacao");
const spanLente = document.getElementById("Lente");
const spanArmacao = document.getElementById("Armacao");
const btnFecharModal = document.getElementById("fechar-modal-cotacao");
const formCotacao = document.getElementById("form-cotacao");

// ------------------------------
// Funções públicas
// ------------------------------
export function adicionarProdutoCotacao(produto, tipo) {
    if (tipo === "lente") {
        lenteSelecionada = produto;
    } else {
        armacaoSelecionada = produto;
    }

    atualizarResumo();
    atualizarBotao();
}

export function alternarCotacao() {
    modal.classList.toggle("ativo");
}

// ------------------------------
// Funções internas
// ------------------------------
function atualizarResumo() {
    spanLente.textContent = lenteSelecionada
        ? `Lente: ${lenteSelecionada.nome} (R$ ${lenteSelecionada.preco.toFixed(2)})`
        : "Lente: nenhuma";

    spanArmacao.textContent = armacaoSelecionada
        ? `Armação: ${armacaoSelecionada.nome} (R$ ${armacaoSelecionada.preco.toFixed(2)})`
        : "Armação: nenhuma";
}

function atualizarBotao() {
    if (!btnFlutuante) return;

    if (lenteSelecionada || armacaoSelecionada) {
        btnFlutuante.classList.add("ativo");
    } else {
        btnFlutuante.classList.remove("ativo");
    }
}

// ------------------------------
// Eventos do modal
// ------------------------------
btnFlutuante?.addEventListener("click", alternarCotacao);
btnFecharModal?.addEventListener("click", alternarCotacao);

// ------------------------------
// Função utilitária para pegar id da loja da URL
// ------------------------------
function getIdLojaDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"), 10);
}

// ------------------------------
// Envio da cotação
// ------------------------------
formCotacao?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = getUsuarioLogado();
    if (!usuario) {
        alert("Você precisa estar logado para enviar uma cotação.");
        return;
    }

    if (!lenteSelecionada && !armacaoSelecionada) {
        alert("Selecione pelo menos um produto para cotar.");
        return;
    }

    // Pegando os graus do formulário
    const grauEsquerdo = parseFloat(document.getElementById("grau-esq").value) || null;
    const grauDireito = parseFloat(document.getElementById("grau-dir").value) || null;

    const idLoja = getIdLojaDaUrl();

    // Montando DTO completo para o backend
    const dadosCotacao = {
        produto: {
            nome: lenteSelecionada?.nome || armacaoSelecionada?.nome || "Produto",
            idLente: lenteSelecionada?.id || null,
            idArmacao: armacaoSelecionada?.id || null,
            grauDireito,
            grauEsquerdo,
            idUsuario: usuario.id,
            idLoja,
            valor: lenteSelecionada?.preco || armacaoSelecionada?.preco || 0,
            prazoEntrega: 7 // valor default
        },
        idUsuario: usuario.id,
        idLoja
    };

    try {
        console.log("JSON que será enviado:", JSON.stringify(dadosCotacao, null, 2));
        await criarCotacao(dadosCotacao);
        alert("Cotação enviada com sucesso!");
        alternarCotacao();
    } catch (error) {
        console.error(error);
        alert("Erro ao enviar cotação. Tente novamente.");
    }
});