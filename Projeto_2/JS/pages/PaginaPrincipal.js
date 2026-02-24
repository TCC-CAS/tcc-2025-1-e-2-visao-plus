import { configurarHeader } from "../components/header.js";
import { getUsuarioLogado } from "../core/auth.js";
import { getLojaAtual } from "../core/loja.js";
import { listarLojas } from "../core/loja.js";


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
        renderizarLojas(lojas);
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar lojas");
    }
}

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
        <h2>${loja.nome}</h2>
        <p><strong>${loja.email}</strong></p>
        <p><strong>${loja.endereco}</strong></p>
    `;

    div.addEventListener("click", () => {
        window.location.href = `PaginaLoja.html?id=${loja.id}`;
    });

    return div;
}

document.addEventListener("DOMContentLoaded", () => {
    configurarHeader();
    configurarTela();
    carregarLojas();
});







