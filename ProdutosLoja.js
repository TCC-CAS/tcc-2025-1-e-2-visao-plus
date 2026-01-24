const API = "http://localhost:8080/"; // ajusta se precisar

document.addEventListener("DOMContentLoaded", () => {
    initPaginaAdmin();
});

function initPaginaAdmin() {
    setNomeLoja(Nomeloja); // depois você pode buscar isso do backend
    carregarArmacoes();
    carregarLentes();
    configurarEventos();
}

async function setNomeLoja() {
    try {
        const response = await fetch(`${API}/lojas/buscarLoja`);
        if (!response.ok) throw new Error("Erro ao buscar loja");

        const loja = await response.json();
        const Nomeloja = loja.nome;
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar lojas");
    }
}

async function carregarArmacoes() {
    try {
        const response = await fetch(`${API}/armacoes/listarArmacoes`);
        if (!response.ok) throw new Error("Erro ao buscar armações");

        const armacoes = await response.json();
        renderizarArmacoes(armacoes);
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar armações"); 
    }
}

async function carregarLentes() {
    try {
        const response = await fetch(`${API}/lentes/listarLentes`);
        if (!response.ok) throw new Error("Erro ao buscar lentes");

        const lentes = await response.json();
        renderizarLentes(lentes);
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar lentes");
    }
}

function abrirModal(idModal) {
    document.getElementById(idModal).classList.remove("hidden");
}

function fecharModal(idModal) {
    document.getElementById(idModal).classList.add("hidden");
}

function renderizarArmacoes(armacoes) {
    const container = document.getElementById("lista-armacoes");
    container.innerHTML = "";
    armacoes.forEach(armacao => {
        const div = document.createElement("div");
        div.className = "produto";
        div.innerHTML = `
            <h3>${armacao.nome}</h3>
            <p>Preço: R$ ${armacao.preco}</p>
            <button onclick="abrirModal('modal-editar-armacao')">Editar</button>
        `;
        container.appendChild(div);
    });
}

function renderizarLentes(lentes) {
    const container = document.getElementById("lista-lentes");
    container.innerHTML = "";
    lentes.forEach(lente => {
        const div = document.createElement("div");
        div.className = "produto";
        div.innerHTML = `
            <h3>${lente.nome}</h3>
            <p>Preço: R$ ${lente.preco}</p>
            <button onclick="abrirModal('modal-editar-lente')">Editar</button>
        `;
        container.appendChild(div);
    });
}