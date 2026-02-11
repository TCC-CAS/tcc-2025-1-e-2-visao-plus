import { configurarHeader } from "../components/header.js";
import { getUsuarioLogado } from "../core/auth.js";
import { getLojaAtual } from "../core/loja.js";


function esconderTodosOsBlocos() {
    // Seções
    document.getElementById("secao-cotacoes").style.display = "none";
    document.getElementById("secao-admin").style.display = "none";
}


function configurarTela() {

    // Primeiro, escondemos tudo
    esconderTodosOsBlocos();

    // Tentamos descobrir se tem alguém logado
    const usuario = getUsuarioLogado();

    console.log("Usuário logado:", usuario);

    // Agora decide pelo tipo
    if (usuario.tipoUsuario === "Comum") {

        document.getElementById("secao-cotacoes").style.display = "block";

    } else if (usuario.tipoUsuario === "Vendedor") {

        document.getElementById("secao-cotacoes").style.display = "block";

    } else if (usuario.tipoUsuario === "Admin") {

        document.getElementById("secao-admin").style.display = "block";
        document.getElementById("secao-cotacoes").style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    configurarHeader();
    configurarTela();
});







