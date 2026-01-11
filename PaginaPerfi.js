// Tenta buscar o usuário salvo no navegador
function obterUsuarioLogado() {

    // Pega o valor salvo com a chave "usuarioLogado"
    const usuarioString = localStorage.getItem("usuarioLogado");

    // Se não existir nada salvo, retorna null
    if (!usuarioString) {
        return null;
    }

    // Converte de texto (JSON) para objeto JS
    return JSON.parse(usuarioString);
}

function esconderTodosOsBlocos() {

    // Usuário logado
    document.getElementById("menu-usuario").style.display = "none";

    // Tipos
    document.getElementById("menu-carrinho").style.display = "none";
    document.getElementById("menu-vendedor").style.display = "none";
    document.getElementById("menu-admin").style.display = "none";

    // Seções
    document.getElementById("secao-usuario").style.display = "none";
    document.getElementById("secao-loja").style.display = "none";
    document.getElementById("secao-cotacoes").style.display = "none";
    document.getElementById("secao-admin").style.display = "none";
    document.getElementById("secao-pedir_loja").style.display = "none";
}

async function buscarLojaDoUsuario(usuario) {
    try {
        const response = await fetch("http://localhost:8080/lojas/buscarLoja", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario.id)
        });

        if (!response.ok) {
            return null; // usuário não tem loja
        }

        return await response.json();

    } catch (error) {
        console.error("Erro ao buscar loja:", error);
        return null;
    }
}



async function configurarTela() {
    esconderTodosOsBlocos();

    const usuario = obterUsuarioLogado();
    if (!usuario) {
        document.getElementById("main-content").style.display = "none";
        return;
    }

    console.log("Usuário logado:", usuario);

    // BUSCA A LOJA NO BACKEND
    const loja = await buscarLojaDoUsuario(usuario);

    // injeta a loja no objeto do usuário
    usuario.loja = loja;

    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    document.getElementById("menu-usuario").style.display = "flex";

    if (usuario.tipoUsuario === "Comum") {
        document.getElementById("secao-usuario").style.display = "flex";
        document.getElementById("menu-carrinho").style.display = "flex";
        document.getElementById("secao-cotacoes").style.display = "block";
        document.getElementById("secao-pedir_loja").style.display = "block";

    } else if (usuario.tipoUsuario === "Vendedor") {
        document.getElementById("menu-vendedor").style.display = "flex";
        document.getElementById("menu-carrinho").style.display = "flex";
        document.getElementById("secao-loja").style.display = "block";
        document.getElementById("secao-usuario").style.display = "flex";

    } else if (usuario.tipoUsuario === "Admin") {
        document.getElementById("secao-usuario").style.display = "flex";
        document.getElementById("secao-admin").style.display = "block";
        document.getElementById("secao-loja").style.display = "block";
        document.getElementById("menu-admin").style.display = "flex";
    }

    preencherInformacoesUsuario();
    preencherInformacoesLoja();
}


function preencherInformacoesUsuario() {
    const usuario = obterUsuarioLogado();
    if (usuario) {
        document.getElementById("nomeUsuario").textContent = usuario.nome;
        document.getElementById("emailUsuario").textContent = usuario.email;
        document.getElementById("tipoUsuario").textContent = usuario.tipoUsuario;
    }
}

function preencherInformacoesLoja() {
    const usuario = obterUsuarioLogado();
    if (usuario && usuario.loja) {
        document.getElementById("nomeLoja").textContent = usuario.loja.nome;
        document.getElementById("emailLoja").textContent = usuario.loja.email;
        document.getElementById("cnpjLoja").textContent = usuario.loja.cnpj;
        document.getElementById("enderecoLoja").textContent = usuario.loja.endereco;
        document.getElementById("cepLoja").textContent = usuario.loja.cep;
    }
}

function logout() {
    // Remove o usuário logado do armazenamento local
    localStorage.removeItem("usuarioLogado");

    configurarTela();
}


document.addEventListener("DOMContentLoaded", () => {
    configurarTela();
});