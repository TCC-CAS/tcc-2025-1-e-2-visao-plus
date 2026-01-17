document.addEventListener("DOMContentLoaded", carregarUsuarios);

async function carregarUsuarios() {
    try {
        const response = await fetch("http://localhost:8080/lojas/listarUsuarios");
        if (!response.ok) throw new Error("Erro ao buscar lojas");

        const lojas = await response.json();
        renderizarUsuarios(usuarios)
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar lojas");
    }
}

function renderizarUsuarios(usuarios) {
    const container = document.getElementById("lista-usuarios");
    container.innerHTML = "";

    if (usuarios.length === 0) {
        container.innerHTML = "<p>Nenhum usuário cadastrado.</p>";
        return;
    }

    usuarios.forEach(usuario => {
        const card = criarCardUsuario(usuario);
        container.appendChild(card);
    });
}

function criarCardUsuario(usuario) {
    const div = document.createElement("div");
    div.classList.add("card-usuario");

    div.innerHTML = `
        <h2>${usuario.nome}</h2>
        <p><strong>${usuario.email}</strong></p>
        <p><strong>${usuario.tipoUsuario}</strong></p>
        <button class="btn-detalhes">Deletar</button><button class="btn-detalhes">Editar</button> 
    `;

    return div;
}