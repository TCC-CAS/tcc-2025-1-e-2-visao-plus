import { configurarHeader } from "../components/header.js";
import { getUsuarioLogado } from "../core/auth.js";

const usuario = getUsuarioLogado;
const loja = usuario.loja;

const Pagina = document.getElementById("MinhaLoja");

Pagina.addEventListener("click", () => {
        window.location.href = `PaginaLoja.html?id=${loja.id}`;
    });


document.addEventListener("DOMContentLoaded", () => {
    configurarHeader();
    // Outras inicializações específicas da página podem ser feitas aqui
});