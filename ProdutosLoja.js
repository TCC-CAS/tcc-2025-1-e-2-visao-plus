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

//FUNÇÕES DE CONFIGURAÇÃO DE EVENTOS

function configurarEventos() {

    // Abrir modais
    document.getElementById("btn-adicionar-armacao")
        .addEventListener("click", () => abrirModal("modal-adicionar-armação"));

    document.getElementById("btn-adicionar-lente")
        .addEventListener("click", () => abrirModal("modal-adicionar-lente"));

    // Fechar modais
    document.getElementById("fechar-modal-armação")
        .addEventListener("click", () => fecharModal("modal-adicionar-armação"));

    document.getElementById("fechar-modal-editar-armação")
        .addEventListener("click", () => fecharModal("modal-editar-armação"));

    document.getElementById("fechar-modal-lente")
        .addEventListener("click", () => fecharModal("modal-adicionar-lente"));

    document.getElementById("fechar-modal-editar-lente")
        .addEventListener("click", () => fecharModal("modal-editar-lente"));

    // Forms
    document.getElementById("form-adicionar-armação")
        .addEventListener("submit", adicionarArmacao);

    document.getElementById("form-editar-armação")
        .addEventListener("submit", salvarEdicaoArmacao);

    document.getElementById("form-adicionar-lente")
        .addEventListener("submit", adicionarLente);

    document.getElementById("form-editar-lente")
        .addEventListener("submit", salvarEdicaoLente);
}

//FUNÇÕES DE ADIÇÃO DE ARMAÇÕES

async function adicionarArmacao(event) {
    event.preventDefault();

    const armacao = {
        nome: nomeArmacao.value,
        tipo: tipoArmacao.value,
        marca: marcaArmacao.value,
        modelo: modeloArmacao.value,
        material: materialArmacao.value,
        descricao: descricaoArmacao.value,
        preco: precoArmacao.value
    };

    try {
        await fetch(`${API_BASE_URL}/armacoes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(armacao)
        });

        fecharModal("modal-adicionar-armação");
        carregarArmacoes();
        event.target.reset();

    } catch (error) {
        console.error("Erro ao adicionar armação", error);
    }
}


//FUNÇÕES DE EDIÇÃO DE ARMAÇÕES

let armacaoEmEdicaoId = null;

async function abrirModalEditarArmacao(id) {
    armacaoEmEdicaoId = id;

    const response = await fetch(`${API_BASE_URL}/armacoes/${id}`);
    const armacao = await response.json();

    nomeArmacaoEdit.value = armacao.nome;
    tipoArmacaoEdit.value = armacao.tipo;
    marcaArmacaoEdit.value = armacao.marca;
    modeloArmacaoEdit.value = armacao.modelo;
    materialArmacaoEdit.value = armacao.material;
    descricaoArmacaoEdit.value = armacao.descricao;
    precoArmacaoEdit.value = armacao.preco;

    abrirModal("modal-editar-armação");
}

async function salvarEdicaoArmacao(event) {
    event.preventDefault();

    const armacaoAtualizada = {
        nome: nomeArmacaoEdit.value,
        tipo: tipoArmacaoEdit.value,
        marca: marcaArmacaoEdit.value,
        modelo: modeloArmacaoEdit.value,
        material: materialArmacaoEdit.value,
        descricao: descricaoArmacaoEdit.value,
        preco: precoArmacaoEdit.value
    };

    await fetch(`${API_BASE_URL}/armacoes/${armacaoEmEdicaoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(armacaoAtualizada)
    });

    fecharModal("modal-editar-armação");
    carregarArmacoes();
}
