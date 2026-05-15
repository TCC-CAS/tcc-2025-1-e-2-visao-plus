import {configurarHeader} from "../components/header.js";

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

state.configuracao = {
    fontePrimaria: "",
    fonteSecundaria: "",
    corPrimaria: "",
    corSecundaria: "",
    corFundo: "",
    layoutPagina: "",
    mostrarPreco: true,
    mostrarMarca: true,
    produtosLinha: 3
};

/*************************************************
 * INICIALIZAÇÃO
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
    initPaginaAdmin();
});

async function initPaginaAdmin() {
    try {
        configurarHeader();
        carregarUsuarioLogado();
        carregarLojaDoUsuario();
        renderizarDadosLoja();

        await carregarArmacoes();
        await carregarLentes();
        await carregarConfiguracoesLoja();
        configurarEventos();
        atualizarCards();
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
    document.getElementById("DescricaoLoja").textContent = state.loja.descricao;
    document.getElementById("EmailLoja").textContent = state.loja.email;
    document.getElementById("EnderecoLoja").textContent = state.loja.endereco;
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
        ${state.configuracao.mostrarMarca ? `<p>Marca: ${armacao.marca}</p>` : ""}
        <p>Modelo: ${armacao.modelo}</p>
        <p>Material: ${armacao.material}</p>
        <p>Tipo: ${armacao.tipo}</p>
        <p>Descrição: ${armacao.descricao}</p>
        ${state.configuracao.mostrarPreco ? `<p>Preço: R$ ${armacao.preco}</p>` : ""}
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
        ${state.configuracao.mostrarMarca ? `<p>Marca: ${lente.marca}</p>` : ""}
        <p>Modelo: ${lente.modelo}</p>
        <p>Material: ${lente.material}</p>
        <p>Descrição: ${lente.descricao}</p>
        ${state.configuracao.mostrarPreco ? `<p>Preço: R$ ${lente.preco}</p>` : ""}
    `;

    return div;
}

/*************************************************
 * CONFIGURAÇÕES DA LOJA
 *************************************************/
function aplicarLayoutPagina() {
    const preview = document.querySelector(".pre-visualizacao");

    preview.classList.remove(
        "layout-padrao",
        "layout-centralizado",
        "layout-fullwidth",
        "layout-grid"
    );

    preview.classList.add(`layout-${state.configuracao.layoutPagina}`);
}

function aplicarLayoutProdutos() {
    const armacoes = document.querySelector(".armacao-section");
    const lentes = document.querySelector(".lente-section");

    armacoes.classList.remove(
        "produtos-horizontal",
        "produtos-grid",
        "produtos-lista"
    );

    lentes.classList.remove(
        "produtos-horizontal",
        "produtos-grid",
        "produtos-lista"
    );

    armacoes.classList.add(`produtos-${state.configuracao.layoutProdutos}`);
    lentes.classList.add(`produtos-${state.configuracao.layoutProdutos}`);
}

function aplicarProdutosPorLinha() {
    const preview = document.querySelector(".pre-visualizacao");

    preview.style.setProperty(
        "--produtos-linha",
        state.configuracao.produtosLinha || 3
    );
}

function atualizarCards() {
    renderizarArmacoes(state.armacoes);
    renderizarLentes(state.lentes);
}

async function carregarConfiguracoesLoja() {
    const response = await fetch(`${API}/configuracao/buscar/${state.lojaId}`);

    if (!response.ok) {
        throw new Error("Erro ao carregar configurações da loja");
    }

    state.configuracao = await response.json();
    preencherInputsConfiguracao();
    aplicarConfiguracaoPreview();
    atualizarCards();
}

function preencherInputsConfiguracao() {
    document.getElementById("fontePrimaria").value = state.configuracao.fontePrimaria;
    document.getElementById("fonteSecundaria").value = state.configuracao.fonteSecundaria;
    document.getElementById("corPrimaria").value = state.configuracao.corPrimaria;
    document.getElementById("corSecundaria").value = state.configuracao.corSecundaria;
    document.getElementById("corFundo").value = state.configuracao.corFundo;
    document.getElementById("layoutPagina").value = state.configuracao.layoutPagina;
    document.getElementById("mostrarPreco").checked = !!state.configuracao.mostrarPreco;
    document.getElementById("mostrarMarca").checked = !!state.configuracao.mostrarMarca;
    document.getElementById("produtosPorLinha").value = state.configuracao.produtosLinha || 3;
    atualizarCards();
}

function montarConfiguracaoDTO() {
    return {
        fontePrimaria: document.getElementById("fontePrimaria").value,
        fonteSecundaria: document.getElementById("fonteSecundaria").value,
        corPrimaria: document.getElementById("corPrimaria").value,
        corSecundaria: document.getElementById("corSecundaria").value,
        corFundo: document.getElementById("corFundo").value,
        layoutPagina: document.getElementById("layoutPagina").value,
        mostrarPreco: document.getElementById("mostrarPreco").checked,
        mostrarMarca: document.getElementById("mostrarMarca").checked,
        produtosLinha: Number(document.getElementById("produtosPorLinha").value)

    };
}

async function salvarConfiguracoes() {
    const dto = montarConfiguracaoDTO();

    const response = await fetch(
        `${API}/configuracao/editar/${state.lojaId}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao salvar configurações");
    }

    state.configuracao = dto;
    aplicarConfiguracaoPreview();
    atualizarCards();

    alert("Configurações salvas com sucesso!");
}

function resetarConfiguracoes() {
    const padrao = {
        fontePrimaria: "Arial",
        fonteSecundaria: "Helvetica",
        corPrimaria: "#000000",
        corSecundaria: "#ffffff",
        layoutPagina: "padrao",
        mostrarPreco: true,
        mostrarMarca: true
    };

    state.configuracao = padrao;
    preencherInputsConfiguracao();
    aplicarConfiguracaoPreview();
}

function aplicarConfiguracaoPreview() {
    atualizarCards();
    const preview = document.querySelector(".pre-visualizacao");

    preview.style.setProperty("--cor-primaria", state.configuracao.corPrimaria);
    preview.style.setProperty("--cor-secundaria", state.configuracao.corSecundaria);
    preview.style.setProperty("--cor-fundo", state.configuracao.corFundo);

    preview.style.setProperty("--fonte-primaria", state.configuracao.fontePrimaria);
    preview.style.setProperty("--fonte-secundaria", state.configuracao.fonteSecundaria);

    aplicarLayoutPagina();
    aplicarLayoutProdutos();
    aplicarProdutosPorLinha();

    // Dados da loja
    document.getElementById("NomeLoja").textContent = state.loja.nome;
    document.getElementById("DescricaoLoja").textContent = state.loja.descricao;
    document.getElementById("EmailLoja").textContent = state.loja.email;
    document.getElementById("EnderecoLoja").textContent = state.loja.endereco;
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
    document
        .getElementById("salvarConfiguracoes")
        .addEventListener("click", salvarConfiguracoes);

    document
        .getElementById("resetarConfiguracoes")
        .addEventListener("click", resetarConfiguracoes);

    // Preview ao vivo
    document.querySelectorAll(".config-input").forEach(input => {
        input.addEventListener("change", () => {
            state.configuracao = montarConfiguracaoDTO();
            aplicarConfiguracaoPreview();
            aplicarConfiguracaoPreview();
            atualizarCards();
        });
    });
}





