import { API } from "./api.js";

// Envia proposta (loja) — endpoint específico com valor + prazo
export async function enviarProposta(idCotacao, idLojaLogada, valorFinal, prazoEntrega, observacaoLoja) {
    const response = await fetch(`${API}/cotacoes/${idCotacao}/responder?idLojaLogada=${idLojaLogada}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valorFinal, prazoEntrega, observacaoLoja })
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}