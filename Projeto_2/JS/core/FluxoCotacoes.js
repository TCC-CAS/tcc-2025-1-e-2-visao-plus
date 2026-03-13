import { API } from "./api.js";

export async function responderCotacao(idCotacao, idLojaLogada) {

    const valorFinal = document.getElementById("valorFinal").value;
    const prazoEntrega = document.getElementById("prazoEntrega").value;
    const observacaoLoja = document.getElementById("observacaoLoja").value;

    const dto = {
        valorFinal: parseFloat(valorFinal),
        prazoEntrega: parseInt(prazoEntrega),
        observacaoLoja: observacaoLoja
    };

    const response = await fetch(
        `${API}/cotacoes/cotacoes/${idCotacao}/responder?idLojaLogada=${idLojaLogada}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        }
    );

    if (!response.ok) {
        const erro = await response.text();
        alert("Erro ao responder cotação: " + erro);
        return;
    }

    const cotacaoAtualizada = await response.json();

    console.log("Cotação atualizada:", cotacaoAtualizada);

    alert("Resposta enviada!");
}