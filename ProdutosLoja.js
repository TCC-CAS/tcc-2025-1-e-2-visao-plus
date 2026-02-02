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
        renderizarNomeLoja();

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

function renderizarNomeLoja() {
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
    document.getElementById("btn-adicionar-armacao")
        .addEventListener("click", () =>
            abrirModal("modal-adicionar-armação")
        );

    document.getElementById("btn-adicionar-lente")
        .addEventListener("click", () =>
            abrirModal("modal-adicionar-lente")
        );

    document.getElementById("")

    document.getElementById("form-adicionar-armacao")
        .addEventListener("submit", adicionarArmacao);

    document.getElementById("form-adicionar-lente")
        .addEventListener("submit", adicionarLente);

    document.getElementById("fechar-modal-armação")
        .addEventListener("click", () =>
            fecharModal("modal-adicionar-armação")
        );

    document.getElementById("fechar-modal-lente")
        .addEventListener("click", () =>
            fecharModal("modal-adicionar-lente")
        );

    document.getElementById("")

    document.getElementById("form-editar-armação")
        .addEventListener("submit", salvarEdicaoArmacao);

    document.getElementById("fechar-modal-editar-armação")
        .addEventListener("click", () =>
            fecharModal("modal-editar-armação")
        );

    document.getElementById("form-editar-lente")
        .addEventListener("submit", salvarEdicaoLente);

    document.getElementById("fechar-modal-editar-lente")
        .addEventListener("click", () =>
            fecharModal("modal-editar-lente")
        );
}

/*************************************************
 * CRUD ARMAÇÕES
 *************************************************/
let armacaoEmEdicaoId = null;

async function adicionarArmacao(event) {
    event.preventDefault();

    const armacao = {
        nome: nomeArmacao.value,
        tipo: tipoArmacao.value,
        marca: marcaArmacao.value,
        modelo: modeloArmacao.value,
        material: materialArmacao.value,
        descricao: descricaoArmacao.value,
        preco: precoArmacao.value,
        idLoja: state.lojaId
    };

    console.log(armacao);

    await fetch(`${API}/armacao/criarArmacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(armacao)
    });

    fecharModal("modal-adicionar-armação");
    carregarArmacoes();
    document.getElementById("form-adicionar-armacao").reset();
}

async function deletarArmacao(id) {
    await fetch(`${API}/armacao/deletarArmacao/${id}`, {
        method: "DELETE"
    });
    carregarArmacoes();
}

function abrirModalEditarArmacao(id) {
    const armacao = state.armacoes.find(a => a.id === id);
    if (!armacao) return;

    armacaoEmEdicaoId = id;

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

    const armacao = {
        nome: nomeArmacaoEdit.value,
        tipo: tipoArmacaoEdit.value,
        marca: marcaArmacaoEdit.value,
        modelo: modeloArmacaoEdit.value,
        material: materialArmacaoEdit.value,
        descricao: descricaoArmacaoEdit.value,
        preco: precoArmacaoEdit.value,
        idLoja: state.lojaId
    };

    await fetch(`${API}/armacao/editarArmacao/${armacaoEmEdicaoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(armacao)
    });

    fecharModal("modal-editar-armação");
    carregarArmacoes();
    armacaoEmEdicaoId = null;
}

/*************************************************
 * CRUD LENTES
 *************************************************/
let lenteEmEdicaoId = null;

async function adicionarLente(event) {
    event.preventDefault();

    const lente = {
        nome: nomeLente.value,
        tipo: tipoLente.value,
        marca: marcaLente.value,
        modelo: modeloLente.value,
        material: materialLente.value,
        descricao: descricaoLente.value,
        preco: precoLente.value,
        idLoja: state.lojaId
    };

    await fetch(`${API}/lentes/criarLente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lente)
    });

    fecharModal("modal-adicionar-lente");
    carregarLentes();
    document.getElementById("form-adicionar-lente").reset();
}

async function deletarLente(id) {
    await fetch(`${API}/lentes/deletarLente/${id}`, {
        method: "DELETE"
    });
    carregarLentes();
}

function abrirModalEditarLente(id) {
    const lente = state.lentes.find(l => l.id === id);
    if (!lente) return;

    lenteEmEdicaoId = id;

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

    const lente = {
        nome: nomeLenteEdit.value,
        tipo: tipoLenteEdit.value,
        marca: marcaLenteEdit.value,
        modelo: modeloLenteEdit.value,
        material: materialLenteEdit.value,
        descricao: descricaoLenteEdit.value,
        preco: precoLenteEdit.value,
        idLoja: state.lojaId
    };

    await fetch(`${API}/lentes/editarLente/${lenteEmEdicaoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lente)
    });

    fecharModal("modal-editar-lente");
    carregarLentes();
    lenteEmEdicaoId = null;
}



