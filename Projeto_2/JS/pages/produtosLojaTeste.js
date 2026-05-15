/*************************************************
 * IMPORTS (lego que a gente vai usar)
 *************************************************/
import { getUsuarioLogado } from "../core/auth.js";
import { getLojaDoUsuario } from "../core/loja.js";
import {
    listarArmacoesPorLoja,
    listarLentesPorLoja,
    salvarArmacao,
    salvarLente
} from "../core/produtos.js";

import { configurarHeader } from "../components/header.js";
import { abrirModal, fecharModal } from "../components/modals.js";

/*************************************************
 * ESTADO DA PÁGINA
 *************************************************/
let usuario = null;
let loja = null;

/*************************************************
 * INICIALIZAÇÃO DA PÁGINA
 *************************************************/
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1 - usuário
        usuario = getUsuarioLogado();
        console.log("Usuário logado:", usuario);

        // 2️ - loja
        loja = await getLojaDoUsuario(usuario);
        if (!loja) {
            alert("Nenhuma loja associada ao usuário. Acesse o painel de administração para criar uma loja.");
            return;
        } console.log("Loja do usuário:", loja);

        // 3️ - header
        configurarHeader(usuario);

        // 4️ - nome da loja
        document.getElementById("nomeLoja").textContent = loja.nome;

        // 5️ - produtos
        carregarProdutos();

        // 6️ - eventos
        configurarEventos();

    } catch (erro) {
        alert(erro.message);
        console.error(erro);
    }
});

/*************************************************
 * PRODUTOS
 *************************************************/
async function carregarProdutos() {
    const armacoes = await listarArmacoesPorLoja(loja.id);
    const lentes = await listarLentesPorLoja(loja.id);

    renderizarArmacoes(armacoes);
    renderizarLentes(lentes);
}

/*************************************************
 * RENDERIZAÇÃO
 *************************************************/
function renderizarArmacoes(lista) {
    const container = document.getElementById("armacao-lista");
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p>Nenhuma armação cadastrada.</p>";
        return;
    }

    lista.forEach(armacao => {
        const card = document.createElement("div");
        card.className = "card-armacao";
        card.innerHTML = `
        <h4>${armacao.nome}</h4>
        <p>Marca: ${armacao.marca}</p>
        <p>Modelo: ${armacao.modelo}</p>
        <p>Material: ${armacao.material}</p>
        <p>Tipo: ${armacao.tipo}</p>
        <p>Descrição: ${armacao.descricao}</p>
        <p>Preço: R$ ${armacao.preco}</p>
        <button onclick="abrirModalEditarArmacao(${armacao.id})" class="btn-editar" id="btn-editar-armação-${armacao.id}">Editar</button>
        <button onclick="deletarArmacao(${armacao.id})" class="btn-deletar">Deletar</button>
        `;
        container.appendChild(card);
    });
}

function renderizarLentes(lista) {
    const container = document.getElementById("lente-lista");
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p>Nenhuma lente cadastrada.</p>";
        return;
    }

    lista.forEach(lente => {
        const card = document.createElement("div");
        card.className = "card-lente";
        card.innerHTML = `
        <h4>${lente.nome}</h4>
        <p>Tipo: ${lente.tipo}</p>
        <p>Marca: ${lente.marca}</p>
        <p>Modelo: ${lente.modelo}</p>
        <p>Material: ${lente.material}</p>
        <p>Descrição: ${lente.descricao}</p>
        <p>Preço: R$ ${lente.preco}</p>
        <button class="btn-editar" id="btn-editar-lente-${lente.id}">Editar</button>
        <button class="btn-deletar">Deletar</button>
        `;
        container.appendChild(card);
    });
}

/*************************************************
 * EVENTOS
 *************************************************/
function configurarEventos() {

    // Abrir modais
    document
        .getElementById("btn-adicionar-armacao")
        .addEventListener("click", () =>
            abrirModal("modal-adicionar-armação")
        );

    document
        .getElementById("btn-editar-lente-${lente.id}")
        .addEventListener("click", () =>
            abrirModal("modal-editar-lente-${lente.id}")
        );

    document
        .getElementById("btn-editar-armação-${armacao.id}")
        .addEventListener("click", () => abrirModal("modal-editar-armação-${armacao.id}"));

    document
        .getElementById("btn-editar-lente-${lente.id}")
        .addEventListener("click", () => abrirModal("modal-editar-lente-${lente.id}"));

    // Fechar modais
    document
        .getElementById("fechar-modal-armação")
        .addEventListener("click", () =>
            fecharModal("modal-adicionar-armação")
        );

    document
        .getElementById("fechar-modal-lente")
        .addEventListener("click", () =>
            fecharModal("modal-adicionar-lente")
        );

    document.getElementById("fechar-modal-editar-armação")
        .addEventListener("click", () =>
            fecharModal("modal-editar-armação")
        );

    document.getElementById("fechar-modal-editar-lente")
        .addEventListener("click", () =>
            fecharModal("modal-editar-lente")
        );

    // Submit Armação
    document
        .getElementById("form-adicionar-armacao")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            const dados = {
                nome: nomeArmacao.value,
                tipo: tipoArmacao.value,
                marca: marcaArmacao.value,
                modelo: modeloArmacao.value,
                material: materialArmacao.value,
                descricao: descricaoArmacao.value,
                preco: precoArmacao.value,
                idLoja: loja.id
            };

            await salvarArmacao(dados);
            fecharModal("modal-adicionar-armação");
            carregarProdutos();
        });

    // Submit Lente
    document
        .getElementById("form-adicionar-lente")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            const dados = {
                nome: nomeLente.value,
                tipo: tipoLente.value,
                marca: marcaLente.value,
                modelo: modeloLente.value,
                material: materialLente.value,
                descricao: descricaoLente.value,
                preco: precoLente.value,
                idLoja: loja.id
            };


            await salvarLente(dados);
            fecharModal("modal-adicionar-lente");
            carregarProdutos();
        });
}
