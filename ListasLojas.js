document.addEventListener("DOMContentLoaded", carregarLojas);

async function carregarLojas() {
    try {
        const response = await fetch("http://localhost:8080/lojas/listarLojas");
        if (!response.ok) throw new Error("Erro ao buscar lojas");

        const lojas = await response.json();
        renderizarLojas(lojas);
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar lojas");
    }
}

function renderizarLojas(lojas) {
    const container = document.getElementById("lista-lojas");
    container.innerHTML = "";

    if (lojas.length === 0) {
        container.innerHTML = "<p>Nenhuma loja cadastrada.</p>";
        return;
    }

    lojas.forEach(loja => {
        const card = criarCardLoja(loja);
        container.appendChild(card);
    });
}

function criarCardLoja(loja) {
    const div = document.createElement("div");
    div.classList.add("card-loja");

    div.innerHTML = `
        <h2>${loja.nome}</h2>
        <p><strong>${loja.email}</strong></p>
        <p><strong>${loja.endereco}</strong></p>
    `;

    return div;
}