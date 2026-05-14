import { configurarHeader } from "../components/header.js";
import { montarCarrosselCotacoes } from "../components/CarrosselCotacoes.js";
import { getUsuarioLogado } from "../core/auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const usuario = getUsuarioLogado();

    if (!usuario) {
        alert("Você precisa estar logado para acessar o painel da loja");
        window.location.href = "Login.html";
        return;
    }

    if (usuario.tipoUsuario !== "Vendedor") {
        alert("Você não tem permissão para acessar este painel");
        window.location.href = "PaginaPrincipal.html";
        return;
    }

    const loja = usuario.loja;
 
    if (!loja) {
        alert("Você não possui uma loja cadastrada");
        window.location.href = "CadastroLoja.html";
        return;
    }

    // Configurar header
    configurarHeader();


})