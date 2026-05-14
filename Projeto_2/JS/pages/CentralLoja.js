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



})