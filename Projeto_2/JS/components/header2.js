// js/components/header2.js

import { getUsuarioLogado, logout } from "../core/auth.js";
import { getLojaAtual } from "../core/loja.js";



export function configurarHeader() {
    const header = document.getElementById("app-header");
    if (!header) return;

    header.innerHTML = `
        <header>
            <div class="logo">
                <h1>VisionPlus+</h1>
            </div>

            ${montarMenu2()}
        </header>
    `;

    configurarEventosHeader();
    chamarEstilização();
}

function chamarEstilização() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/components/Header2.css";
    document.head.appendChild(link);
}

function montarMenu2() {
    return `
        <div id="menu-visitante" class="menu-visitante">
                <a href="PaginaPrincipal.html">
                    <img src="imgs/pngfind.com-address-icon-png-807569.png" class="iconhome" alt="Ícone">
                </a>
        </div>
    `;
}


function configurarEventosHeader() {
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", logout);
    }
}

window.addEventListener("scroll", () => {
    const headerElement = document.querySelector("header");

    if (window.scrollY > 50) {
        headerElement.classList.add("shrink");
    } else {
        headerElement.classList.remove("shrink");
    }
});