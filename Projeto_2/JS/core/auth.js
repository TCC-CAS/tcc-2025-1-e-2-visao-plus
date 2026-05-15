// js/core/auth.js

/**
 * Retorna o usuário logado ou null
 */
export function getUsuarioLogado() {
    const usuarioString = localStorage.getItem("usuarioLogado");
    return usuarioString ? JSON.parse(usuarioString) : null;
}

/**
 * Salva o usuário logado no localStorage
 */
export function setUsuarioLogado(usuario) {
    if (!usuario) return;
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
}

/**
 * Remove o usuário logado e redireciona (logout)
 */
export function logout(redirecionar = true) {
    localStorage.removeItem("usuarioLogado");

    if (redirecionar) {
        window.location.href = "Login.html";
    }
}

/**
 * Verifica se existe usuário logado
 */
export function isLogado() {
    return !!getUsuarioLogado();
}

/**
 * Retorna o tipo do usuário logado (ADMIN, VENDEDOR, COMUM)
 */
export function getTipoUsuario() {
    const usuario = getUsuarioLogado();
    return usuario?.tipo_usuario || null;
}
