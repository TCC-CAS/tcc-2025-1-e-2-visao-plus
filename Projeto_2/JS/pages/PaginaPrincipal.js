import { configurarHeader } from "../components/header.js";
import { getUsuarioLogado } from "../core/auth.js";
import { getLojaAtual } from "../core/loja.js";
import { listarLojas } from "../core/loja.js";
import { listarCotacoesPorUsuario, criarCardCotacao, chamarEstilizacao, initScrollCotacoes } from "../core/cotacoes.js";
import { initBuscaLojas, chamarEstilizacaoSearchBar } from "../components/searchBar.js";
import { inicializarMapa } from "../core/apiMapa.js";

let lojasCache = [];

async function carregarMapa(){

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
        // Se não tiver ninguém logado, não mostramos nada
        return;
    }

    console.log("Usuário logado:", usuario);

    // Agora decide pelo tipo
    if (usuario.tipoUsuario === "Comum") {

        document.getElementById("secao-cotacoes").style.display = "block";

    } else if (usuario.tipoUsuario === "Vendedor") {

        document.getElementById("secao-cotacoes").style.display = "block";

    } else if (usuario.tipoUsuario === "Admin") {

        document.getElementById("secao-admin").style.display = "block";
        document.getElementById("secao-cotacoes").style.display = "block";
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

    div.addEventListener("click", () => {
        window.location.href = `PaginaLoja.html?id=${loja.id}`;
    });

    return div;
}

async function carregarCotacoes(idUsuario) {
    const container = document.getElementById("lista-cotacoes");
    container.innerHTML = "";

    const cotacoes = await listarCotacoesPorUsuario(idUsuario);

    cotacoes.forEach(c => {
        const card = criarCardCotacao(c);
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    configurarHeader();
    configurarTela();
    carregarLojas();

    chamarEstilizacaoSearchBar();

    chamarEstilizacao();
    initScrollCotacoes();    
    carregarCotacoes(getUsuarioLogado().id);

    carregarMapa();
});







