/*************************************************
 * CONFIGURAÇÕES GERAIS
 *************************************************/
const API = "http://localhost:8080";

/*************************************************
 * ESTADO GLOBAL DA PÁGINA
 *************************************************/
const state = {
    usuario: null,
    loja: null,
    lojaId: null,
    armacoes: [],
    lentes: []
};

/*************************************************
 * INICIALIZAÇÃO
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
    initPaginaAdmin();
});

async function initPaginaAdmin() {
    try {
        carregarUsuarioLogado();
        carregarLojaDoUsuario();
        renderizarDadosLoja();

        await carregarArmacoes();
        await carregarLentes();

        configurarEventos();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/*************************************************
 * USUÁRIO E LOJA
 *************************************************/
function carregarUsuarioLogado() {
    const usuarioString = localStorage.getItem("usuarioLogado");

    if (!usuarioString) {
        throw new Error("Usuário não está logado");
    }

    state.usuario = JSON.parse(usuarioString);
    console.log("USUÁRIO LOGADO:", state.usuario);
}

function carregarLojaDoUsuario() {
    if (!state.usuario?.loja) {
        throw new Error("Usuário não possui loja");
    }

    state.loja = state.usuario.loja;
    state.lojaId = state.loja.id;

    if (!state.lojaId) {
        throw new Error("ID da loja inválido");
    }

    console.log("OBJETO LOJA:", state.loja);
}

function renderizarDadosLoja() {
    document.getElementById("nomeLoja").textContent = state.loja.nome;
}

/*************************************************
 * CARREGAMENTO DE ARMAÇÕES
 *************************************************/
async function carregarArmacoes() {
    const response = await fetch(
        `${API}/armacao/listarArmacoes/${state.lojaId}`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar armações");
    }

    state.armacoes = await response.json();
    renderizarArmacoes(state.armacoes);
}

function renderizarArmacoes(armacoes) {
    const container = document.getElementById("armacao-lista");
    container.innerHTML = "";

    if (armacoes.length === 0) {
        container.innerHTML = "<p>Nenhuma armação cadastrada.</p>";
        return;
    }

    armacoes.forEach(armacao => {
        container.appendChild(CardArmacao(armacao));
    });
}

function CardArmacao(armacao) {
    const div = document.createElement("div");
    div.classList.add("card-armacao");

    div.innerHTML = `
        <h4>${armacao.nome}</h4>
        <p>Marca: ${armacao.marca}</p>
        <p>Modelo: ${armacao.modelo}</p>
        <p>Material: ${armacao.material}</p>
        <p>Tipo: ${armacao.tipo}</p>
        <p>Descrição: ${armacao.descricao}</p>
        <p>Preço: R$ ${armacao.preco}</p>
        <button onclick="abrirModalEditarArmacao(${armacao.id})" class="btn-editar">Editar</button>
        <button onclick="deletarArmacao(${armacao.id})" class="btn-deletar">Deletar</button>
    `;

    return div;
}

/*************************************************
 * CARREGAMENTO DE LENTES
 *************************************************/
async function carregarLentes() {
    const response = await fetch(
        `${API}/lentes/listarLentes/${state.lojaId}`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar lentes");
    }

    state.lentes = await response.json();
    renderizarLentes(state.lentes);
}

function renderizarLentes(lentes) {
    const container = document.getElementById("lente-lista");
    container.innerHTML = "";

    if (lentes.length === 0) {
        container.innerHTML = "<p>Nenhuma lente cadastrada.</p>";
        return;
    }

    lentes.forEach(lente => {
        container.appendChild(CardLente(lente));
    });
}

function CardLente(lente) {
    const div = document.createElement("div");
    div.classList.add("card-lente");

    div.innerHTML = `
        <h4>${lente.nome}</h4>
        <p>Tipo: ${lente.tipo}</p>
        <p>Marca: ${lente.marca}</p>
        <p>Modelo: ${lente.modelo}</p>
        <p>Material: ${lente.material}</p>
        <p>Descrição: ${lente.descricao}</p>
        <p>Preço: R$ ${lente.preco}</p>
        <button onclick="abrirModalEditarLente(${lente.id})" class="btn-editar">Editar</button>
        <button onclick="deletarLente(${lente.id})" class="btn-deletar">Deletar</button>
    `;

    return div;
}

/*************************************************
 * MODAIS
 *************************************************/
function abrirModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function fecharModal(id) {
    document.getElementById(id).classList.add("hidden");
}

/*************************************************
 * EVENTOS
 *************************************************/
function configurarEventos() {
    
}





