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
}


function configurarTela() {

    // Primeiro, escondemos tudo
    esconderTodosOsBlocos();

    // Tentamos descobrir se tem alguém logado
    const usuario = obterUsuarioLogado();

    // CASO 1: ninguém logado
    if (usuario === null) {
        document.getElementById("main-content").style.display = "none";
        return;
    }

    console.log("Usuário logado:", usuario);

    // CASO 2: alguém logado
    document.getElementById("menu-usuario").style.display = "flex";

    // Agora decide pelo tipo
    if (usuario.tipoUsuario === "Comum") {

        document.getElementById("menu-carrinho").style.display = "flex";
        document.getElementById("secao-cotacoes").style.display = "block";

    } else if (usuario.tipoUsuario === "Vendedor") {

        document.getElementById("menu-vendedor").style.display = "flex";
        document.getElementById("menu-carrinho").style.display = "flex";
        document.getElementById("secao-cotacoes").style.display = "block";
        document.getElementById("secao-loja").style.display = "block";

    } else if (usuario.tipoUsuario === "Admin") {

        document.getElementById("secao-usuario").style.display = "flex";        
        document.getElementById("secao-admin").style.display = "block";        
        document.getElementById("secao-cotacoes").style.display = "block";        
        document.getElementById("secao-loja").style.display = "block";

        document.getElementById("menu-admin").style.display = "flex";
        document.getElementById("menu-vendedor").style.display = "flex";
        document.getElementById("menu-carrinho").style.display = "flex";
    }

    preencherInformacoesUsuario();
}

function preencherInformacoesUsuario() {
    const usuario = obterUsuarioLogado();
    if (usuario) {
        document.getElementById("nomeUsuario").textContent = usuario.nome;
        document.getElementById("emailUsuario").textContent = usuario.email;
        document.getElementById("tipoUsuario").textContent = usuario.tipoUsuario;
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