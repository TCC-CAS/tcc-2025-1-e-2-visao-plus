document.addEventListener("DOMContentLoaded", carregarUsuarios);

async function carregarUsuarios() {
    try {
        const response = await fetch("http://localhost:8080/usuarios/listarUsuarios");
        if (!response.ok) throw new Error("Erro ao buscar usuario");

        const usuarios = await response.json();
        renderizarUsuarios(usuarios)
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar usuarios");
    }
}

function renderizarUsuarios(usuarios) {
    const container = document.getElementById("admin-usuarios");
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
        <p><strong>Email: </strong>${usuario.email}</p>
        <p><strong>Tipo de Usuário: </strong>${usuario.tipo_usuario}</p>
        <button class="btn-detalhes">Deletar</button><button class="btn-detalhes">Editar</button> 
    `;

    return div;
}