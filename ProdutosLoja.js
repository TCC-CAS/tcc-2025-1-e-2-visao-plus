const API = "http://localhost:8080"; // ajusta se precisar

document.addEventListener("DOMContentLoaded", () => {
    initPaginaAdmin();
});

async function setNomeLoja() {
    try {
        const response = await fetch(`${API}/lojas/buscarLoja`);
        if (!response.ok) throw new Error("Erro ao buscar loja");

        const loja = await response.json();
        const Nomeloja = loja.nome;

        document.getElementById("nomeLoja").textContent = Nomeloja;
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
    const container = document.getElementById("armacao-lista");
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
        <button onclick="abrirModalEditarArmacao(${armacao.id})">Editar</button>
        <button onclick="deletarArmacao(${armacao.id})">Deletar</button>
    `;
    return div;
}

//FUNÇÕES DE RENDERIZAÇÃO DE LENTES

function renderizarLentes(lentes) {
    const container = document.getElementById("lente-lista");
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
        <button onclick="abrirModalEditarLente(${lente.id})">Editar</button>
        <button onclick="deletarLente(${lente.id})">Deletar</button>
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
        await fetch(`${API}/armacoes/criarArmacao`, {
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

    const response = await fetch(`${API}/armacoes/${id}`);
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

    await fetch(`${API}/armacoes/editarArmacao/${armacaoEmEdicaoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(armacaoAtualizada)
    });

    fecharModal("modal-editar-armação");
    carregarArmacoes();
}


//FUNÇÕES DE ADIÇÃO DE LENTES

async function adicionarLente(event) {
    event.preventDefault();

    const lente = {
        nome: nomeLente.value,
        tipo: tipoLente.value,
        marca: marcaLente.value,
        modelo: modeloLente.value,
        material: materialLente.value,
        descricao: descricaoLente.value,
        preco: precoLente.value
    };

    try {
        await fetch(`${API}/lentes/criarLente`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lente)
        });

        fecharModal("modal-adicionar-lente");
        carregarLentes();
        event.target.reset();

    } catch (error) {
        console.error("Erro ao adicionar lente", error);
    }
}

//FUNÇÕES DE EDIÇÃO DE LENTES

let lenteEmEdicaoId = null;

async function abrirModalEditarLente(id) {
    lenteEmEdicaoId = id;

    const response = await fetch(`${API}/lentes/${id}`);
    const lente = await response.json();

    nomeLenteEdit.value = lente.nome;
    tipoLenteEdit.value = lente.tipo;
    marcaLenteEdit.value = lente.marca;
    modeloLenteEdit.value = lente.modelo;
    materialLenteEdit.value = lente.material;
    descricaoLenteEdit.value = lente.descricao;
    precoLenteEdit.value = lente.preco;

    abrirModal("modal-editar-lente");
}


async function salvarEdicaoLente(event) {
    event.preventDefault();

    const lenteAtualizada = {
        nome: nomeLenteEdit.value,
        tipo: tipoLenteEdit.value,
        marca: marcaLenteEdit.value,
        modelo: modeloLenteEdit.value,
        material: materialLenteEdit.value,
        descricao: descricaoLenteEdit.value,
        preco: precoLenteEdit.value
    };

    await fetch(`${API}/lentes/editarLente/${lenteEmEdicaoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lenteAtualizada)
    });

    fecharModal("modal-editar-lente");
    carregarLentes();
}

//FUNÇÕES DE DELEÇÃO DE ARMAÇÕES

async function deletarArmacao(id) {
    try {
        await fetch(`${API}/armacoes/deletarArmacao/${id}`, {
            method: "DELETE"
        });
        carregarArmacoes();
    } catch (error) {
        console.error("Erro ao deletar armação", error);
    }
}

//FUNÇÕES DE DELEÇÃO DE LENTES

async function deletarLente(id) {
    try {
        await fetch(`${API}/lentes/deletarLente/${id}`, {
            method: "DELETE"
        });
        carregarLentes();
    } catch (error) {
        console.error("Erro ao deletar lente", error);
    }
}

function initPaginaAdmin() {
    setNomeLoja(); // depois você pode buscar isso do backend
    carregarArmacoes();
    carregarLentes();
    configurarEventos();
}
