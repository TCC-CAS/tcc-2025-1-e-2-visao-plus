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
import { uploadFotoArmacao, uploadFotoLente } from "../core/imgs.js";
import { configurarHeader } from "../components/header.js";

/*********************************************************
 * MENSAGENS
 ********************************************************/
function mostrarMensagem(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.classList.remove("sucesso", "erro");
    elemento.classList.add("mostrar", tipo);

    setTimeout(() => {
        elemento.classList.remove("mostrar");
    }, 4000);
}

/*********************************************************
 * SERVIÇOS DE PRODUTOS
 ********************************************************/
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

    document.getElementById("form-adicionar-armacao")
        .addEventListener("submit", (e) => adicionarProduto("armacao", e));

    document.getElementById("form-adicionar-lente")
        .addEventListener("submit", (e) => adicionarProduto("lente", e));

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
        <img src="${produto.fotoUrl || "imgs/default-product.png"}" alt="Foto ${tipo}" class="produto">
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

async function adicionarProduto(tipo, e) {


    e.preventDefault();

    const get = (campo) => document.getElementById(`${campo}-${tipo}`);

    const dados = {
        idLoja: loja.id,
        nome: get("nome").value,
        tipo: get("tipo").value,
        marca: get("marca").value,
        modelo: get("modelo").value,
        material: get("material").value,
        descricao: get("descricao").value,
        preco: Number(get("preco").value)
    };

    try {

        const produtoCriado = await produtoService[tipo].salvar(dados);

        await carregarArmacoes();
        await carregarLentes();

        fecharModal(`modal-adicionar-${tipo}`);

        mostrarMensagem(
            msgProdutosLoja,
            "Produto adicionado com sucesso!",
            "sucesso"
        );
        document.getElementById(`form-adicionar-${tipo}`).reset();

    } catch (error) {

        console.error(error);

        mostrarMensagem(
            msgProdutosLoja,
            "Erro ao adicionar produto!",
            "erro"
        );
    }
}

async function deletarProduto(tipo, id) {
    const service = produtoService[tipo];

    await service.deletar(id);
    await carregarArmacoes();
    await carregarLentes();
}

async function abrirModalEditarProduto(tipo, id) {
    abrirModal(`modal-editar-${tipo}`);

    const textarea = document.getElementById(`descricao-${tipo}-edit`);
    const contador = document.getElementById(`contador-${tipo}-edit`);

    textarea.oninput = () => {
        const tamanho = textarea.value.length;

        contador.textContent = tamanho + " / 500";

        if (tamanho > 450) {
            contador.classList.add("contadorNOK");
            contador.classList.remove("contadorOk");
        } else {
            contador.classList.add("contadorOk");
            contador.classList.remove("contadorNOK");
        }
    };

    const produto = state[produtoService[tipo].stateKey].find(p => p.id === id);

    if (!produto) {
        console.error("Produto não encontrado", id);
        return;
    }

    const form = document.getElementById(`form-editar-${tipo}`);


    document.getElementById(`form-foto-${tipo}-edit`).dataset.produtoId = id;

    const get = (campo) => document.getElementById(`${campo}-${tipo}-edit`);
    document.getElementById(`preview-foto-${tipo}-edit`).src = produto.fotoUrl || "imgs/default-product.png";
    get("nome").value = produto.nome;
    get("tipo").value = produto.tipo;
    get("marca").value = produto.marca;
    get("modelo").value = produto.modelo;
    get("material").value = produto.material;
    get("descricao").value = produto.descricao;
    get("preco").value = produto.preco;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const dadosAtualizados = {
            fotoUrl: get("foto").src,
            nome: get("nome").value,
            tipo: get("tipo").value,
            marca: get("marca").value,
            modelo: get("modelo").value,
            material: get("material").value,
            descricao: get("descricao").value,
            preco: Number(get("preco").value)
        };

        try {
            await produtoService[tipo].atualizar(id, dadosAtualizados);
            await carregarArmacoes();
            await carregarLentes();
            fecharModal(`modal-editar-${tipo}`);
            mostrarMensagem(msgProdutosLoja, "Produto atualizado com sucesso!", "sucesso");
        } catch (error) {
            console.error(error);
            mostrarMensagem(msgProdutosLoja, "Erro ao atualizar produto!", "erro");
        }
    };
}

function configurarPreviewImagem(inputId, previewId) {

    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    input.addEventListener("change", () => {

        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });
}

async function configurarUploadImagem(formId, inputId, previewId, uploadFunction) {

    const form = document.getElementById(formId);
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const produtoId = form.dataset.produtoId;

        if (!produtoId) {
            alert("Produto ainda não foi criado");
            return;
        }

        const file = input.files[0];
        if (!file) {
            mostrarMensagem(msgProdutosLoja, "Selecione uma imagem!", "erro");
            return;
        }

        try {

            const urlImagem = await uploadFunction(produtoId, file);

            preview.src = urlImagem;

            await carregarArmacoes();
            await carregarLentes();
            mostrarMensagem(msgProdutosLoja, "Produto atualizado com sucesso!", "sucesso");

        } catch (error) {
            console.error(error);
            mostrarMensagem(msgProdutosLoja, "Erro ao atualizar produto!", "erro");
        }

    });

}


function configurarFotos() {

    // ARMAÇÃO CRIAR
    configurarPreviewImagem(
        "foto-armacao-criar",
        "preview-foto-armacao"
    );

    configurarUploadImagem(
        "form-foto-armacao",
        "foto-armacao-criar",
        "preview-foto-armacao",
        uploadFotoArmacao
    );

    // ARMAÇÃO EDITAR
    configurarPreviewImagem(
        "foto-armacao-edit",
        "preview-foto-armacao-edit"
    );

    configurarUploadImagem(
        "form-foto-armacao-edit",
        "foto-armacao-edit",
        "preview-foto-armacao-edit",
        uploadFotoArmacao
    );

    // LENTE CRIAR
    configurarPreviewImagem(
        "foto-lente-criar",
        "preview-foto-lente"
    );

    configurarUploadImagem(
        "form-foto-lente",
        "foto-lente-criar",
        "preview-foto-lente",
        uploadFotoLente
    );

    // LENTE EDITAR
    configurarPreviewImagem(
        "foto-lente-edit",
        "preview-foto-lente-edit"
    );

    configurarUploadImagem(
        "form-foto-lente-edit",
        "foto-lente-edit",
        "preview-foto-lente-edit",
        uploadFotoLente
    );
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
        configurarFotos();
        carregarArmacoes();
        carregarLentes();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}
