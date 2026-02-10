// js/core/produtos.js

import { apiFetch } from "./api.js";

/**
 * Buscar todas as armações
 */
export async function buscarArmacoes() {
    return await apiFetch("/armacoes");
}

/**
 * Buscar todas as lentes
 */
export async function buscarLentes() {
    return await apiFetch("/lentes");
}

/**
 * Buscar armações com filtro
 */
export async function buscarArmacoesComFiltro(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return await apiFetch(`/armacoes?${params}`);
}

/**
 * Buscar lentes com filtro
 */
export async function buscarLentesComFiltro(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return await apiFetch(`/lentes?${params}`);
}

/**
 * Buscar produto por ID (genérico)
 */
export async function buscarProdutoPorId(tipo, id) {
    return await apiFetch(`/${tipo}/${id}`);
}
/**/