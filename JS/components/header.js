// js/components/header.js

import { getUsuarioLogado, logout } from "../core/auth.js";
import { getLojaAtual } from "../core/loja.js";

export function configurarHeader() {
    const header = document.getElementById("app-header");
    if (!header) return;

    const usuario = getUsuarioLogado();
    const loja = getLojaAtual();

    header.innerHTML = `
        <nav class="header">
            <div class="logo">Ótica</div>

            <div class="menu">
                ${loja ? `<button id="btn-loja">Minha Loja</button>` : ""}
                ${usuario?.tipo_usuario === "ADMIN" ? `<button id="btn-admin">Admin</button>` : ""}
                <button id="btn-logout">Sair</button>
            </div>
        </nav>
    `;

    configurarEventosHeader();
}

function configurarEventosHeader() {
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", logout);
    }
}
