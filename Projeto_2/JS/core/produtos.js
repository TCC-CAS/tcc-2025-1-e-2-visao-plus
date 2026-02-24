// js/core/produtos.js
import { apiFetch } from "./api.js";

/* =========================
   BUSCAS
========================= */

export async function listarLentesPorLoja(lojaId) {
    return await apiFetch(`/lentes/listarLentes/${lojaId}`);
}

export async function listarArmacoesPorLoja(lojaId) {
    return await apiFetch(`/armacao/listarArmacoes/${lojaId}`);
}

export async function listarLentePorId(id) {
    return await apiFetch(`/lentes/${id}`);
}

export async function listarArmacaoPorId(id) {
    return await apiFetch(`/armacao/${id}`);
}

/* =========================
   CRIAÇÃO
========================= */

export async function salvarLente(dadosLente) {
    return await apiFetch("/lentes/criarLente", {
        method: "POST",
        body: JSON.stringify(dadosLente)
    });
}

export async function salvarArmacao(dadosArmacao) {
    return await apiFetch("/armacao/criarArmacao", {
        method: "POST",
        body: JSON.stringify(dadosArmacao)
    });
}

/* =========================
   ATUALIZAÇÃO
========================= */

export async function atualizarLente(id, dadosAtualizados) {
    return await apiFetch(`/lentes/editarLente/${id}`, {
        method: "PUT",
        body: JSON.stringify(dadosAtualizados)
    });
}

export async function atualizarArmacao(id, dadosAtualizados) {
    return await apiFetch(`/armacao/editarArmacao/${id}`, {
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
