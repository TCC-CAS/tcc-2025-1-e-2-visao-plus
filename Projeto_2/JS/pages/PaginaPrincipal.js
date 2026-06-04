import { configurarHeader } from "../components/header.js";
import { getUsuarioLogado } from "../core/auth.js";
import { getLojaAtual } from "../core/loja.js";
import { listarLojas } from "../core/loja.js";
import { listarCotacoesPorUsuario, criarCardCotacao, chamarEstilizacao, initScrollCotacoes } from "../core/cotacoes.js";
import { initBuscaLojas, chamarEstilizacaoSearchBar } from "../components/searchBar.js";
import { inicializarMapa } from "../core/apiMapa.js";
import { abrirModalCotacaoConsumidor } from "../components/ModalCotacaoConsumidor.js";
import { montarSecaoCupons } from "../components/CuponsWidget.js";

let lojasCache = [];

async function carregarMapa() {

    const oticas = await listarLojas();

    inicializarMapa(oticas);

}

function esconderTodosOsBlocos() {
    // Seções
    document.getElementById("secao-cotacoes").style.display = "none";
    document.getElementById("secao-admin").style.display = "none";
}


function configurarTela() {

    // Primeiro, escondemos tudo
    esconderTodosOsBlocos();

    // Tentamos descobrir se tem alguém logado
    const usuario = getUsuarioLogado();

    if (!usuario) {
        return;
    }

    ("Usuário logado:", usuario);

    // Agora decide pelo tipo
    if (usuario.tipoUsuario === "Comum") {
        document.getElementById("secao-cotacoes").style.display = "block";

    } else if (usuario.tipoUsuario === "Vendedor") {
        document.getElementById("secao-cotacoes").style.display = "none";

    } else if (usuario.tipoUsuario === "Admin") {
        document.getElementById("secao-admin").style.display = "block";
        document.getElementById("secao-cotacoes").style.display = "none";
    }
}

async function carregarLojas() {
    try {
        const lojas = await listarLojas();
        lojasCache = lojas;

        renderizarLojas(lojas);
        initBuscaLojas(lojas);

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar lojas");
    }
}

window.renderizarLojas = renderizarLojas;

function renderizarLojas(lojas) {
    const container = document.getElementById("lista-lojas");
    container.innerHTML = "";

    if (lojas.length === 0) {
        container.innerHTML = "<p>Nenhuma loja cadastrada.</p>";
        return;
    }

    lojas.forEach(loja => {
        const card = criarCardLoja(loja);
        container.appendChild(card);
    });
}

function criarCardLoja(loja) {
    const div = document.createElement("div");
    div.classList.add("card-loja");

    div.innerHTML = `
        <div class="imagem-loja">
            <img src="${loja.fotoUrl || "imgs/store1.png"}" alt="${loja.nome}">
        </div>
        <div class="dados-loja">
            <h2>${loja.nome}</h2>
            <p><strong>${loja.email}</strong></p>
            <p><strong>${loja.endereco}</strong></p>
        </div>
    `;

    // Agora abre o modal em vez de redirecionar direto
    div.addEventListener("click", () => abrirModalLoja(loja));

    return div;
}

function abrirModalLoja(loja) {
    document.getElementById("modal-foto").src = loja.fotoUrl || "imgs/store1.png";
    document.getElementById("modal-nome").textContent = loja.nome;
    document.getElementById("modal-cidade").textContent = loja.cidade || "";
    document.getElementById("modal-email").textContent = loja.email || "—";
    document.getElementById("modal-endereco").textContent = loja.endereco || "—";
    document.getElementById("modal-telefone").textContent = loja.telefone || "—";

    document.getElementById("modal-btn-ver").onclick = () => {
        window.location.href = `PaginaLoja.html?id=${loja.id}`;
    };

    document.getElementById("modal-loja").classList.add("ativo");
}

function fecharModal() {
    document.getElementById("modal-loja").classList.remove("ativo");
}

// Fecha clicando no X ou fora do modal
document.getElementById("modal-fechar").addEventListener("click", fecharModal);
document.getElementById("modal-loja").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) fecharModal();
});

async function carregarCotacoes(idUsuario) {
    const usuario = getUsuarioLogado();

    if (!usuario || usuario.tipoUsuario !== "Comum") return;

    const container = document.getElementById("lista-cotacoes");
    container.innerHTML = "";

    const cotacoes = await listarCotacoesPorUsuario(idUsuario);

    if (!cotacoes || cotacoes.length === 0) {
        container.innerHTML = "<p>Nenhuma cotação encontrada.</p>";
        return;
    }

    cotacoes.forEach(cotacao => {
        const card = criarCardCotacao(cotacao, () => {
            abrirModalCotacaoConsumidor(cotacao, (cotacaoAtualizada) => {
                Object.assign(cotacao, cotacaoAtualizada);
                carregarCotacoes(usuario.id);
            });
        });

        container.appendChild(card);
    });
    initScrollCotacoes();
}

function inicializarSessoesRecolhiveis() {
    const paineis = document.querySelectorAll("[data-collapsible]");

    paineis.forEach(painel => {
        const botao = painel.querySelector(".painel-header");
        const icone = painel.querySelector(".painel-icone");

        if (!botao) return;

        botao.addEventListener("click", () => {
            painel.classList.toggle("fechado");

            const estaFechado = painel.classList.contains("fechado");
            icone.textContent = estaFechado ? "+" : "−";

            if (!estaFechado) {
                setTimeout(() => {
                    initScrollCotacoes();
                }, 200);
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    configurarHeader();
    configurarTela();
    carregarLojas();

    chamarEstilizacaoSearchBar();

    chamarEstilizacao();
    initScrollCotacoes();
    carregarMapa();

    const usuario = getUsuarioLogado();

    if (usuario && usuario.tipoUsuario === "Comum") {
        carregarCotacoes(usuario.id);
    }

    montarSecaoCupons({
        containerId: "secao-cupons-globais",
        modo: "global",
        titulo: "Cupons disponíveis na VisionPlus+",
        subtitulo: "Resgate cupons ativos de óticas parceiras antes que acabem."
    });

    inicializarSessoesRecolhiveis();
});







