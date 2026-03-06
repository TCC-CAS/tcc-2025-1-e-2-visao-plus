/*************************************************
 * IMPORTS (lego que a gente vai usar)
 *************************************************/
import { getUsuarioLogado } from "../core/auth.js";
import {
    listarArmacoesPorLoja,
    listarLentesPorLoja,
    salvarArmacao,
    salvarLente,
    atualizarArmacao,
    atualizarLente,
    deletarArmacao,
    deletarLente
} from "../core/produtos.js";

import { configurarHeader } from "../components/header.js";

const produtoService = {
    armacao: {
        listar: listarArmacoesPorLoja,
        salvar: salvarArmacao,
        atualizar: atualizarArmacao,
        deletar: deletarArmacao,
        stateKey: "armacoes"
    },
    lente: {
        listar: listarLentesPorLoja,
        salvar: salvarLente,
        atualizar: atualizarLente,
        deletar: deletarLente,
        stateKey: "lentes"
    }
};


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
 * USUÁRIO E LOJA
*************************************************/

state.usuario = getUsuarioLogado();
const usuario = state.usuario;
const loja = usuario.loja;

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

    //botões de adicionar produtos
    document.getElementById("btn-adicionar-armacao")
        .addEventListener("click", () =>
            abrirModal("modal-adicionar-armacao")
        );

    document.getElementById("btn-adicionar-lente")
        .addEventListener("click", () =>
            abrirModal("modal-adicionar-lente")
        );



    //FORMS DE ADICIONAR PRODUTOS

    /*document.getElementById("form-adicionar-armacao")
        .addEventListener("submit", adicionarArmacao);

    document.getElementById("form-adicionar-lente")
        .addEventListener("submit", adicionarLente);*/

    //SPANS DE FECHAR MODAIS
    document.getElementById("fechar-modal-armacao")
        .addEventListener("click", () =>
            fecharModal("modal-adicionar-armacao")
        );

    document.getElementById("fechar-modal-lente")
        .addEventListener("click", () =>
            fecharModal("modal-adicionar-lente")
        );


    //FORMS DE EDIÇÃO DE PRODUTOS
    /*
    document.getElementById("form-editar-armacao")
        .addEventListener("submit", salvarEdicaoArmacao);*/

    document.getElementById("fechar-modal-editar-armacao")
        .addEventListener("click", () =>
            fecharModal("modal-editar-armacao")
        );
    
    /*
    document.getElementById("form-editar-lente")
        .addEventListener("submit", salvarEdicaoLente);*/

    document.getElementById("fechar-modal-editar-lente")
        .addEventListener("click", () =>
            fecharModal("modal-editar-lente")
        );


}

/*************************************************
 * CARREGAMENTO DE ARMAÇÕES E LENTES
*************************************************/
async function carregarArmacoes() {
    const armacoes = await listarArmacoesPorLoja(loja.id);
    state.armacoes = armacoes;
    await renderizarProdutos("armacao", armacoes);
}

async function carregarLentes() {
    const lentes = await listarLentesPorLoja(loja.id);
    state.lentes = lentes;
    await renderizarProdutos("lente", lentes);
}

/*************************************************
 * LISTA E CARDS DE PRODUTOS NA TELA
*************************************************/

async function renderizarProdutos(tipo, produtos) {
    const container = document.getElementById(`${tipo}-lista`);
    container.innerHTML = "";

    if (!produtos || produtos.length === 0) {
        container.innerHTML = "<p>Nenhum produto cadastrado.</p>";
        return;
    }

    produtos.forEach(produto => {
        container.appendChild(criarCardProduto(tipo, produto));
    });
}

function criarCardProduto(tipo, produto) {
    const div = document.createElement("div");
    div.classList.add(`card-${tipo}`);

    div.innerHTML = `
        <h4>${produto.nome}</h4>
        <p>Tipo: ${produto.tipo}</p>
        <p>Marca: ${produto.marca}</p>
        <p>Modelo: ${produto.modelo}</p>
        <p>Material: ${produto.material}</p>
        <p>Descrição: ${produto.descricao}</p>
        <p>Preço: R$ ${produto.preco}</p>
        <button class="btn-editar">Editar</button>
        <button class="btn-deletar">Deletar</button>
    `;

    const btnEditar = div.querySelector(".btn-editar");
    const btnDeletar = div.querySelector(".btn-deletar");

    btnEditar.addEventListener("click", () => abrirModalEditarProduto(tipo, produto.id));
    btnDeletar.addEventListener("click", () => deletarProduto(tipo, produto.id));

    return div;
}

/*************************************************
 * CRUD DE PRODUTOS NA TELA
*************************************************/

async function deletarProduto(tipo, id) {
    const service = produtoService[tipo];

    await service.deletar(id);
    await carregarProdutos(tipo);
}

async function abrirModalEditarProduto(tipo, id) {
    abrirModal(`modal-editar-${tipo}`);




}


/*************************************************
 * INICIALIZAÇÃO
*************************************************/
document.addEventListener("DOMContentLoaded", () => {
    initPaginaAdmin();
});

async function initPaginaAdmin() {
    try {
        configurarHeader();

        //await carregarArmacoes();
        //await carregarLentes();

        configurarEventos();
        carregarArmacoes();
        carregarLentes();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}
