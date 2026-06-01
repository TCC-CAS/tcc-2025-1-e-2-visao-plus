import { configurarHeader } from "../components/header.js";
import { getUsuarioLogado } from "../core/auth.js";
import { criarCardCotacao, listarCotacoesPorLoja } from "../core/cotacoes.js";
import { getLojaDoUsuario } from "../core/loja.js";
import { abrirModalRespostaCotacaoLoja } from "../components/ModalRespostaCotacaoLoja.js";

let lojaAtual = null;
let cotacoesLoja = [];

document.addEventListener("DOMContentLoaded", async () => {
    const usuario = getUsuarioLogado();

    if (!usuario) {
        alert("Você precisa estar logado para acessar o painel da loja");
        window.location.href = "Login.html";
        return;
    }   

    if (usuario.tipoUsuario !== "Vendedor" && usuario.tipoUsuario !== "Admin") {
        alert("Você não tem permissão para acessar este painel");
        window.location.href = "PaginaPrincipal.html";
        return;
    }

    const loja = usuario.loja || await getLojaDoUsuario(usuario);

    if (!loja) {
        alert("Você não possui uma loja cadastrada");
        window.location.href = "CadastroLoja.html";
        return;
    }

    lojaAtual = loja;

    configurarHeader();

    configurarCards();
    mostrarPainel("engajamento");

    await carregarCotacoesLoja(lojaAtual.id);
    await carregarEstatisticas(lojaAtual.id);

    const btnMinhaLoja = document.getElementById("MinhaLoja");

    if (btnMinhaLoja) {
        btnMinhaLoja.addEventListener("click", () => {
            window.location.href = `PaginaLoja.html?id=${lojaAtual.id}`;
        });
    }
});

async function carregarCotacoesLoja(lojaId) {
    const container = document.getElementById("lista-cotacoes-loja");

    if (!container) return;

    container.innerHTML = "<p>Carregando cotações...</p>";

    try {
        cotacoesLoja = await listarCotacoesPorLoja(lojaId);

        renderizarCotacoesLoja();

    } catch (error) {
        console.error("Erro ao carregar cotações da loja:", error);
        container.innerHTML = "<p>Erro ao carregar cotações da loja.</p>";
    }
}

function renderizarCotacoesLoja() {
    const container = document.getElementById("lista-cotacoes-loja");

    if (!container) return;

    container.innerHTML = "";

    if (!cotacoesLoja || cotacoesLoja.length === 0) {
        container.innerHTML = "<p class='cotacoes-vazio'>Nenhuma cotação recebida.</p>";
        return;
    }

    cotacoesLoja.forEach((cotacao) => {
        const card = criarCardCotacao(cotacao, () => {
            abrirModalRespostaCotacaoLoja(cotacao, (cotacaoAtualizada) => {
                Object.assign(cotacao, cotacaoAtualizada);
                renderizarCotacoesLoja();
                carregarEstatisticas(lojaAtual.id);
            });
        });

        container.appendChild(card);
    });
}

function criarCardCotacaoLoja(cotacao) {
    const card = document.createElement("div");
    card.classList.add("card-cotacao");

    const idCotacao = cotacao.idCotacao || cotacao.id || "-";
    const nomeCliente = cotacao.usuario?.nome || cotacao.nomeUsuario || "Cliente";
    const nomeProduto = cotacao.produto?.nome || "Produto não informado";
    const status = cotacao.status || "SOLICITADA";
    const valorFinal = cotacao.valorFinal ? `R$ ${Number(cotacao.valorFinal).toFixed(2)}` : "Sem proposta";

    card.innerHTML = `
        <div class="card-cotacao-header">
            <strong>Cotação #${idCotacao}</strong>
            <span class="status-cotacao">${formatarStatus(status)}</span>
        </div>

        <p><strong>Cliente:</strong> ${nomeCliente}</p>
        <p><strong>Produto:</strong> ${nomeProduto}</p>
        <p><strong>Proposta:</strong> ${valorFinal}</p>
        <small>Clique para responder/ver detalhes</small>
    `;

    return card;
}

function formatarStatus(status) {
    if (!status) return "-";

    const statusNormalizado = status
        .replace("PROPOSTA_ENVIADA", "RESPONDIDA")
        .replace("NEGOCIANDO", "EM_NEGOCIACAO");

    return statusNormalizado.replace(/_/g, " ");
}

async function carregarEstatisticas(lojaId) {
    try {
        const cotacoes = await listarCotacoesPorLoja(lojaId);

        atualizarTexto("stat-cotacoes", cotacoes.length);

        const respondidas = cotacoes.filter(c =>
            c.status !== "SOLICITADA"
        ).length;

        const taxa = cotacoes.length > 0
            ? Math.round((respondidas / cotacoes.length) * 100)
            : 0;

        atualizarTexto("stat-taxa", `${taxa}%`);

        const aprovadas = cotacoes.filter(c =>
            c.status === "APROVADA" ||
            c.status === "RESERVADA" ||
            c.status === "FINALIZADA"
        ).length;

        atualizarTexto("stat-aprovadas", aprovadas);

        const comPropostas = cotacoes.filter(c => Number(c.valorFinal) > 0);

        let ticket = 0;

        if (comPropostas.length > 0) {
            const total = comPropostas.reduce((acc, c) => acc + Number(c.valorFinal), 0);
            ticket = total / comPropostas.length;
        }

        atualizarTexto("stat-ticket", `R$ ${ticket.toFixed(2)}`);

    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
    }
}

function configurarCards() {
    const cards = document.querySelectorAll(".card-aba");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const painel = card.dataset.painel;

            cards.forEach(c => c.classList.remove("ativo"));
            card.classList.add("ativo");

            mostrarPainel(painel);
        });
    });
}

function mostrarPainel(nomePainel) {
    const conteudo = document.getElementById("conteudo-dinamico");
    const painelSelecionado = document.getElementById(`painel-${nomePainel}`);

    if (!conteudo || !painelSelecionado) return;

    conteudo.classList.remove("vazio");
    conteudo.innerHTML = "";

    const clone = painelSelecionado.cloneNode(true);
    clone.removeAttribute("id");
    clone.classList.remove("painel-conteudo");

    conteudo.appendChild(clone);
    conteudo.scrollTop = 0;

    document.dispatchEvent(new CustomEvent("painelCentralAlterado", {
        detail: { painel: nomePainel }
    }));
}

function atualizarTexto(id, valor) {
    const elementoOriginal = document.getElementById(id);
    const elementoClonado = document.querySelector(`#conteudo-dinamico #${id}`);

    if (elementoOriginal) {
        elementoOriginal.textContent = valor;
    }

    if (elementoClonado) {
        elementoClonado.textContent = valor;
    }
}