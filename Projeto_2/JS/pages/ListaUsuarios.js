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
        <button class="btn-detalhes deletar">Deletar</button>
        <button class="btn-detalhes editar">Editar</button> 
    `;

    div.querySelector(".editar").addEventListener("click", () => {
        abrirModalEditarUsuario(usuario);
    });

    div.querySelector(".deletar").addEventListener("click", () => {
        deletarUsuario(usuario.id);
    });

    return div;
}

function abrirModalEditarUsuario(usuario) {
    document.getElementById("admin-id-usuario").value = usuario.id;
    document.getElementById("admin-nome-usuario").value = usuario.nome;
    document.getElementById("admin-email-usuario").value = usuario.email;
    document.getElementById("admin-tipo-usuario").value = usuario.tipo_usuario;

    document
        .getElementById("modal-editar-usuario-admin")
        .classList.remove("hidden");
}

document.getElementById("fechar-modal-admin").addEventListener("click", () => {
    document
        .getElementById("modal-editar-usuario-admin")
        .classList.add("hidden");
});

document
    .getElementById("form-editar-usuario-admin")
    .addEventListener("submit", salvarUsuarioAdmin);

async function salvarUsuarioAdmin(e) {
    e.preventDefault();

    const dados = {
        id: document.getElementById("admin-id-usuario").value,
        nome: document.getElementById("admin-nome-usuario").value,
        email: document.getElementById("admin-email-usuario").value,
        tipoUsuario: document.getElementById("admin-tipo-usuario").value
    };

    const response = await fetch("http://localhost:8080/usuarios/editarUsuario", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    if (response.ok) {
        alert("Usuário atualizado!");
        document.getElementById("modal-editar-usuario-admin").classList.add("hidden");
        carregarUsuarios(); // recarrega lista
    } else {
        alert("Erro ao editar usuário");
    }
}

async function deletarUsuario(id) {
    const confirmacao = confirm("Tem certeza que deseja deletar este usuário?");
    if (!confirmacao) return;

    const response = await fetch(
        `http://localhost:8080/usuarios/deletarUsuario/${id}`,
        { method: "DELETE" }
    );

    if (response.ok) {
        alert("Usuário deletado!");
        carregarUsuarios();
    } else {
        alert("Erro ao deletar usuário");
    }
}