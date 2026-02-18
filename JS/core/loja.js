// js/core/loja.js

import { API } from "./api.js";

let lojaAtual = null;

/**
 * Busca a loja do usuário logado
 */
export async function getLojaDoUsuario(usuario) {
    if (!usuario?.loja?.id) return null;

    lojaAtual = usuario.loja;
    return lojaAtual;
}

/**
 * Retorna a loja já carregada (se existir)
 */
export function getLojaAtual() {
    return lojaAtual;
}

/**
 * Busca as configurações da loja
 */
export async function buscarConfiguracoesLoja(lojaId) {
    const response = await fetch(`${API}/configuracao/buscar/${lojaId}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar configurações da loja");
    }

    return await response.json();
}

/**
 * Salva as configurações da loja
 */
export async function salvarConfiguracoesLoja(lojaId, configuracao) {
    const response = await fetch(
        `${API}/configuracao/editar/${lojaId}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(configuracao)
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao salvar configurações da loja");
    }

    return true;
}

export async function listarLojas() {
    const response = await fetch(`${API}/lojas/listarLojas`);

    if (!response.ok) {
        throw new Error("Erro ao buscar lojas");
    }

    return await response.json();
}

exp
