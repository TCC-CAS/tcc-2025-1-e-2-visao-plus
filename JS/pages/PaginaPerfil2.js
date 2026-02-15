import { getUsuarioLogado, logout } from "../core/auth.js";
import { listarUsuarios, deletarUsuario } from "../core/usuario.js";
import { listarLojas } from "../core/loja.js";
import { abrirModal, fecharModal } from "../components/modals.js";
import { esconderBlocos, mostrarBlocos } from "../components/visibility.js";
import { criarCardUsuario } from "../components/cards.js";
import { criarCardLoja } from "../components/cards.js";
import { configurarHeader } from "../components/header.js";


async function configurarTela() {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    esconderBlocos([
        "secao-usuario",
        "secao-loja",
        "secao-cotacoes",
        "secao-admin",
        "secao-pedir_loja"
    ]);

    if (usuario.tipoUsuario === "Admin") {
        mostrarBlocos(["secao-admin", "secao-usuario", "secao-loja", "secao-cotacoes", "secao-pedir_loja"]);
        await carregarUsuarios();
        await carregarLojas();
    }

    if (usuario.tipoUsuario === "Vendedor") {
        mostrarBlocos(["secao-loja", "secao-usuario", "secao-cotacoes"]);
    }

    if (usuario.tipoUsuario === "Comum") {
        mostrarBlocos(["secao-usuario", "secao-pedir_loja", "secao-cotacoes"]);
    }
}

async function configurarEventos() {
    

async function carregarUsuarios() {
    const usuarios = await listarUsuarios();
    const container = document.getElementById("admin-usuarios");
    container.innerHTML = "";

    usuarios.forEach(usuario => {
        const card = criarCardUsuario(usuario, {
            onEditar: (u) => abrirModal("modal-editar-usuario-admin"),
            onDeletar: deletarUsuario
        });

        container.appendChild(card);
    });
}

async function carregarLojas() {
    const lojas = await listarLojas();
    const container = document.getElementById("admin-lojas");
    container.innerHTML = "";

    lojas.forEach(loja => {
        const card = criarCardLoja(loja, {
            onEditar: (l) => abrirModal("modal-editar-loja-admin")
        });

        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", init);

async function init() {
    configurarHeader();
    configurarTela();
    configurarEventos();
    
}