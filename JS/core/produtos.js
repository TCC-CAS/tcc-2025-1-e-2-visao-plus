// js/core/produtos.js
import { apiFetch } from "./api.js";

/* =========================
   BUSCAS
========================= */

export async function buscarLentesPorLoja(lojaId) {
    return await apiFetch(`/lentes/loja/${lojaId}`);
}

export async function buscarArmacoesPorLoja(lojaId) {
    return await apiFetch(`/armacoes/loja/${lojaId}`);
}

export async function buscarLentePorId(id) {
    return await apiFetch(`/lentes/${id}`);
}

export async function buscarArmacaoPorId(id) {
    return await apiFetch(`/armacoes/${id}`);
}

/* =========================
   CRIAÇÃO
========================= */

export async function criarLente(dadosLente) {
    return await apiFetch("/lentes", {
        method: "POST",
        body: JSON.stringify(dadosLente)
    });
}

export async function criarArmacao(dadosArmacao) {
    return await apiFetch("/armacoes", {
        method: "POST",
        body: JSON.stringify(dadosArmacao)
    });
}

/* =========================
   ATUALIZAÇÃO
========================= */

export async function atualizarLente(id, dadosAtualizados) {
    return await apiFetch(`/lentes/${id}`, {
        method: "PUT",
        body: JSON.stringify(dadosAtualizados)
    });
}

export async function atualizarArmacao(id, dadosAtualizados) {
    return await apiFetch(`/armacoes/${id}`, {
        method: "PUT",
        body: JSON.stringify(dadosAtualizados)
    });
}

/* =========================
   DELEÇÃO
========================= */

export async function deletarLente(id) {
    return await apiFetch(`/lentes/${id}`, {
        method: "DELETE"
    });
}

export async function deletarArmacao(id) {
    return await apiFetch(`/armacoes/${id}`, {
        method: "DELETE"
    });
}
