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
        <button class="btn-detalhes deletar">Deletar</button>
        <button class="btn-detalhes editar">Editar</button>    
    `;

    div.querySelector(".editar").addEventListener("click", () => {
        abrirModalEditarLoja(loja);
    });

    div.querySelector(".deletar").addEventListener("click", () => {
        deletarLoja(loja.id);
    });

    return div;
}

function abrirModalEditarLoja(loja) {
    document.getElementById("admin-id-loja").value = loja.id;
    document.getElementById("admin-nome-loja").value = loja.nome;
    document.getElementById("admin-email-loja").value = loja.email;
    document.getElementById("admin-cnpj-loja").value = loja.cnpj;
    document.getElementById("admin-cep-loja").value = loja.cep;
    document.getElementById("admin-endereco-loja").value = loja.endereco;

    document
        .getElementById("modal-editar-loja-admin")
        .classList.remove("hidden");
}

document.getElementById("fechar-modal-loja-admin").addEventListener("click", () => {
    document
        .getElementById("modal-editar-loja-admin")
        .classList.add("hidden");
});

document
    .getElementById("form-editar-loja-admin")
    .addEventListener("submit", salvarLojaAdmin);

async function salvarLojaAdmin(e) {
    e.preventDefault();
