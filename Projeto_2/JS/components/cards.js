// components/cards.js

export function criarCardUsuario(usuario, { onEditar, onDeletar }) {
    const div = document.createElement("div");
    div.classList.add("card-usuario");

    div.innerHTML = `
        <h2>${usuario.nome}</h2>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Tipo:</strong> ${usuario.tipo_usuario}</p>
        <button class="editar">Editar</button>
        <button class="deletar">Deletar</button>
    `;

    div.querySelector(".editar")
        .addEventListener("click", () => onEditar(usuario));

    div.querySelector(".deletar")
        .addEventListener("click", () => onDeletar(usuario.id));

    return div;
}

export function criarCardLoja(loja, { onEditar, onDeletar }) {
    const div = document.createElement("div");
    div.classList.add("card-loja");

    div.innerHTML = `
        <h2>${loja.nome}</h2>
        <p><strong>Email:</strong> ${loja.email}</p>
        <p><strong>Endereço:</strong> ${loja.endereco}</p>
        <p><strong>CNPJ:</strong> ${loja.cnpj}</p>
        <button class="editar">Editar</button>
        <button class="deletar">Deletar</button>
    `;

    div.querySelector(".editar")
        .addEventListener("click", () => onEditar(loja));

    div.querySelector(".deletar")
        .addEventListener("click", () => onDeletar(loja.id));

    return div;
}