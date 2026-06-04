import { apiFetch } from "./api.js";

export function listarCuponsDaLoja(idLoja) {
    return apiFetch(`/cupons/loja/${idLoja}`);
}

export function resumoCuponsDaLoja(idLoja) {
    return apiFetch(`/cupons/loja/${idLoja}/resumo`);
}

export function criarCupom(dados) {
    return apiFetch("/cupons", {
        method: "POST",
        body: JSON.stringify(dados)
    });
}

export function editarCupom(idCupom, dados) {
    return apiFetch(`/cupons/${idCupom}`, {
        method: "PUT",
        body: JSON.stringify(dados)
    });
}

export function ativarCupomPublico(idCupom) {
    return apiFetch(`/cupons/${idCupom}/ativar-publico`, {
        method: "PATCH"
    });
}

export function desativarCupom(idCupom) {
    return apiFetch(`/cupons/${idCupom}/desativar`, {
        method: "PATCH"
    });
}

export function deletarCupom(idCupom) {
    return apiFetch(`/cupons/${idCupom}`, {
        method: "DELETE"
    });
}

export function enviarCupomParaUsuarios(idCupom, emails) {
    return apiFetch(`/cupons/${idCupom}/enviar-usuarios`, {
        method: "POST",
        body: JSON.stringify({ emails })
    });
}

export function listarCuponsPublicosDaLoja(idLoja) {
    return apiFetch(`/cupons/loja/${idLoja}/publicos`);
}

export function listarCuponsGlobais() {
    return apiFetch("/cupons/globais");
}

export function resgatarCupom(idCupom, idUsuario) {
    return apiFetch(`/cupons/${idCupom}/resgatar?idUsuario=${idUsuario}`, {
        method: "POST"
    });
}

export function listarCuponsDoUsuario(idUsuario) {
    return apiFetch(`/cupons/usuario/${idUsuario}`);
}

export function aplicarCupomNaCotacao(idCotacao, idUsuario, idCupomUsuario) {
    return apiFetch(`/cupons/cotacoes/${idCotacao}/aplicar`, {
        method: "POST",
        body: JSON.stringify({
            idUsuario,
            idCupomUsuario
        })
    });
}