// js/components/modalCotacao.js

import { getUsuarioLogado } from "../core/auth.js";
import { criarCotacao } from "../core/cotacoes.js";

// ------------------------------
// Estado interno do modal
// ------------------------------
let lenteSelecionada = null;
let armacaoSelecionada = null;
let enviandoCotacao = false;

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
const msgPaginaLoja = document.getElementById("msgPaginaLoja");
const btnEnviarCotacao = document.getElementById("btn-enviar-cotacao");

// ------------------------------
// Utils
// ------------------------------

function mostrarMensagem(elemento, texto, tipo) {
    if (!elemento) {
        alert(texto);
        return;
    }

    elemento.textContent = texto;
    elemento.classList.remove("sucesso", "erro");
    elemento.classList.add("mostrar", tipo);

    setTimeout(() => {
        elemento.classList.remove("mostrar");
    }, 4000);
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

function usuarioPodeSolicitarCotacao() {
    const usuario = getUsuarioLogado();
    return usuario && usuario.tipoUsuario === "Comum";
}

function validarPermissaoCotacao() {
    const usuario = getUsuarioLogado();

    if (!usuario) {
        mostrarMensagem(
            msgPaginaLoja,
            "Você precisa estar logado como consumidor para solicitar cotação.",
            "erro"
        );

        setTimeout(() => {
            window.location.href = "Login.html";
        }, 1800);

        return false;
    }

    if (usuario.tipoUsuario !== "Comum") {
        mostrarMensagem(
            msgPaginaLoja,
            "Usuários de loja não podem solicitar cotações.",
            "erro"
        );
        return false;
    }

    return true;
}

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
    if (!validarPermissaoCotacao()) return;

    if (tipo === "lente") {
        lenteSelecionada = produto;
    } else {
        armacaoSelecionada = produto;
    }

    imagensProdutos();
    atualizarResumo();
    atualizarBotao();

    mostrarMensagem(
        msgPaginaLoja,
        "Produto adicionado à cotação.",
        "sucesso"
    );
}

export function alternarCotacao() {
    if (!validarPermissaoCotacao()) return;

    modal.classList.toggle("ativo");
}

// ------------------------------
// Funções internas
// ------------------------------

function atualizarResumo() {
    spanLente.innerHTML = lenteSelecionada
        ? `Lente: ${lenteSelecionada.nome} 
           <button type="button" id="remover-lente">✕</button>`
        : "Lente: nenhuma";

    spanArmacao.innerHTML = armacaoSelecionada
        ? `Armação: ${armacaoSelecionada.nome} 
           <button type="button" id="remover-armacao">✕</button>`
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

    if (!usuarioPodeSolicitarCotacao()) {
        btnFlutuante.classList.remove("ativo");
        btnFlutuante.classList.add("cotacao-bloqueada");
        return;
    }

    if (lenteSelecionada || armacaoSelecionada) {
        btnFlutuante.classList.add("ativo");
    } else {
        btnFlutuante.classList.remove("ativo");
    }
}

function getIdLojaDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"), 10);
}

// ------------------------------
// Eventos do modal
// ------------------------------

btnFlutuante?.addEventListener("click", () => {
    if (!validarPermissaoCotacao()) return;
    alternarCotacao();
});

btnFecharModal?.addEventListener("click", () => {
    modal.classList.toggle("ativo");
});

// ------------------------------
// Envio da cotação
// ------------------------------

formCotacao?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (enviandoCotacao) return;

    if (!validarPermissaoCotacao()) return;

    const usuario = getUsuarioLogado();

    if (!lenteSelecionada || !armacaoSelecionada) {
        mostrarMensagem(
            msgPaginaLoja,
            "Selecione uma lente e uma armação para solicitar cotação.",
            "erro"
        );
        return;
    }

    const grauEsquerdo = parseFloat(document.getElementById("grau-esq").value) || null;
    const grauDireito = parseFloat(document.getElementById("grau-dir").value) || null;

    const idLoja = getIdLojaDaUrl();

    if (!idLoja) {
        mostrarMensagem(msgPaginaLoja, "Loja inválida para cotação.", "erro");
        return;
    }

    const dadosCotacao = {
        produto: {
            nome: lenteSelecionada?.nome || armacaoSelecionada?.nome || "Produto",
            idLente: lenteSelecionada?.id || null,
            idArmacao: armacaoSelecionada?.id || null,
            grauDireito,
            grauEsquerdo,
            idUsuario: usuario.id,
            idLoja,
            valor: (lenteSelecionada?.preco || 0) + (armacaoSelecionada?.preco || 0),
            prazoEntrega: 7
        },
        idUsuario: usuario.id,
        idLoja
    };

    try {
        enviandoCotacao = true;
        bloquearBotao(btnEnviarCotacao, "Enviando...");

        await criarCotacao(dadosCotacao);

        mostrarMensagem(
            msgPaginaLoja,
            "Cotação enviada com sucesso!",
            "sucesso"
        );

        lenteSelecionada = null;
        armacaoSelecionada = null;

        atualizarResumo();
        atualizarBotao();
        imagensProdutos();

        formCotacao.reset();
        modal.classList.remove("ativo");

    } catch (error) {
        console.error(error);

        mostrarMensagem(
            msgPaginaLoja,
            error.message || "Erro ao enviar cotação. Tente novamente.",
            "erro"
        );

    } finally {
        enviandoCotacao = false;
        desbloquearBotao(btnEnviarCotacao);
    }
});