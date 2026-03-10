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
const imgLente = document.getElementById("foto-lente");
const imgArmacao = document.getElementById("foto-armacao");



// ------------------------------
// Funções públicas
// ------------------------------
function imagensProdutos() {
    if (imgLente) {
        imgLente.src = lenteSelecionada?.fotoUrl || "imgs/store1.png";
    }

    if (imgArmacao) {
        imgArmacao.src = armacaoSelecionada?.fotoUrl || "imgs/store1.png";
    }
}

export function adicionarProdutoCotacao(produto, tipo) {
    if (tipo === "lente") {
        lenteSelecionada = produto;
    } else {
        armacaoSelecionada = produto;
    }
    imagensProdutos();
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

    spanLente.innerHTML = lenteSelecionada
        ? `Lente: ${lenteSelecionada.nome} 
           <button id="remover-lente">✕</button>`
        : "Lente: nenhuma";

    spanArmacao.innerHTML = armacaoSelecionada
        ? `Armação: ${armacaoSelecionada.nome} 
           <button id="remover-armacao">✕</button>`
        : "Armação: nenhuma";

    document.getElementById("remover-lente")?.addEventListener("click", () => {
        lenteSelecionada = null;
        atualizarResumo();
        atualizarBotao();
    });

    document.getElementById("remover-armacao")?.addEventListener("click", () => {
        armacaoSelecionada = null;
        atualizarResumo();
        atualizarBotao();
    });

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

    if (!lenteSelecionada || !armacaoSelecionada) {
        alert("Selecione lente e armação para solicitar cotação.");
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