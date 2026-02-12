// js/components/header.js



import { getUsuarioLogado, logout } from "../core/auth.js";
import { getLojaAtual } from "../core/loja.js";



export function configurarHeader() {
    const header = document.getElementById("app-header");
    if (!header) return;

    const usuario = getUsuarioLogado();
    //console.log("Usuário logado no header:", usuario);
    const pagina = window.location.pathname.split("/").pop();
    //console.log("Página atual:", pagina);

    header.innerHTML = `
        <header>
            <div class="logo">
                <h1>VisionPlus+</h1>
            </div>

            ${usuario ? montarMenuUsuario(usuario) : montarMenuVisitante()}
        </header>
    `;

    configurarEventosHeader();
    chamarEstilização();
}

function chamarEstilização() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/components/Header.css";
    document.head.appendChild(link);
}

function montarMenuVisitante() {
    return `
        <div id="menu-visitante">
            <a href="Login.html">Login</a>
            <a href="Cadastro.html">Cadastrar</a>
        </div>
    `;
}

function montarMenuUsuario(usuario) {
    return `
        <div id="menu-usuario">

            ${montarPerfil()}

            ${usuario.tipoUsuario === "Comum" ? montarCarrinho() : ""}

            ${usuario.tipoUsuario === "Vendedor" ? montarCarrinho() + montarMenuVendedor() : ""}

            ${usuario.tipoUsuario === "Admin" ? montarCarrinho() + montarMenuVendedor() + montarMenuAdmin() : ""}

        </div>
    `;
}

function montarPerfil() {
    return `
        <div id="menu-principal" class="profile-menu">
                <a href="PaginaPrincipal.html">
                    <img src="pngfind.com-address-icon-png-807569.png" class="iconhome" alt="Ícone">
                </a>
        </div>

        <div id="menu-perfil" class="profile-menu">
            <img src="9742847.png" class="iconuser">
            <div class="dropdown">
                <a href="PaginaPerfil.html">Perfil</a>
                <a href="#" id="btn-logout">Sair</a>
            </div>
        </div>
    `;
}

function montarCarrinho() {
    return `
        <div id="menu-carrinho" class="cart-menu">
            <img src="231-2317482_white-shopping-cart-png-download-buy-icon-white.png" class="icon">
        </div>
    `;
}

function montarMenuVendedor() {
    return `
        <div id="menu-vendedor" class="profile-menu">
            <img src="store1.png" class="iconstore">
                <div class="dropdown">
                    <a href="ProdutosLoja.html">Meus Produtos</a>
                    <a href="AdminLoja.html">Administração Loja</a>
                    <a href="PaginaLoja.html">Minha Loja</a>
                </div>
        </div>
    `;
}

function montarMenuAdmin() {
    return `
        <div id="menu-admin" class="profile-menu">
                <img src="pngadmin.png" class="iconadmin">
                <div class="dropdown">
                    <a href="#">Painel Admin</a>
                    <a href="#">Usuários</a>
                </div>
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