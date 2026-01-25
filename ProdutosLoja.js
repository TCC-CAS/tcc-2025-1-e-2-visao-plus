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

//FUNÇÕES DE CARREGAMENTO DE API'S - ARMAÇÕES E LENTES

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

//FUNÇÕES DE MODAIS

function abrirModal(idModal) {
    document.getElementById(idModal).classList.remove("hidden");
}

function fecharModal(idModal) {
    document.getElementById(idModal).classList.add("hidden");
}

//FUNÇÕES DE RENDERIZAÇÃO DE ARMAÇÕES

function renderizarArmacoes(armacoes) {
    const container = document.getElementById("lista-armacoes");
    container.innerHTML = "";

    if (armacoes.length === 0) {
        container.innerHTML = "<p>Nenhuma Armação cadastrada.</p>";
        return;
    }

    armacoes.forEach(armacao => {
        const cardArmacao = CardArmacao(armacao);
        container.appendChild(cardArmacao);
    });
}

function CardArmacao(armacao) {
    const div = document.createElement("div");
    div.classList.add("card-armacao");

    div.innerHTML = `
        <h3>${armacao.nome}</h3>
        <p>Marca: ${armacao.marca}</p>
        <p>Modelo: ${armacao.modelo}</p>
        <p>Material: ${armacao.material}</p>
        <p>Tipo: ${armacao.tipo}</p>
        <p>Descrição: ${armacao.descricao}</p>
        <p>Preço: R$ ${armacao.preco}</p>
        <button onclick="abrirModal('modal-editar-armacao')">Editar</button>
        <button onclick="abrirModal('modal-deletar-armacao')">Deletar</button>
    `;
    return div;
}

//FUNÇÕES DE RENDERIZAÇÃO DE LENTES

function renderizarLentes(lentes) {
    const container = document.getElementById("lista-lentes");
    container.innerHTML = "";
    
    if (lentes.length === 0) {
        container.innerHTML = "<p>Nenhuma Lente cadastrada.</p>";
        return;
    }

    lentes.forEach(lente => {
        const cardLente = CardLente(lente);
        container.appendChild(cardLente);
    });
}

function CardLente(lente) {
    const div = document.createElement("div");
    div.classList.add("card-lente");

    div.innerHTML = `
        <h3>${lente.nome}</h3>
        <p>Tipo: ${lente.tipo}</p>
        <p>Marca: ${lente.marca}</p>
        <p>Modelo: ${lente.modelo}</p>
        <p>Material: ${lente.material}</p>
        <p>Descrição: ${lente.descricao}</p>
        <p>Preço: R$ ${lente.preco}</p>
        <button onclick="abrirModal('modal-editar-lente')">Editar</button>
        <button onclick="abrirModal('modal-deletar-lente')">Deletar</button>
    `;
    return div;
}