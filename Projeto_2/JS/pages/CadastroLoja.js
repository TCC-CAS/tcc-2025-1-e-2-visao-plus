const API_BASE = "http://localhost:8080";

const form = document.getElementById("cadastroLojaForm");
const btnBuscarCnpj = document.getElementById("btnBuscarCnpj");

const inputCnpj = document.getElementById("cnpj");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const inputCep = document.getElementById("cep");
const inputEndereco = document.getElementById("endereco");
const inputDescricao = document.getElementById("descricao");

function limparNumero(valor) {
    return valor.replace(/\D/g, "");
}

function getUsuarioLogado() {
    return JSON.parse(localStorage.getItem("usuarioLogado"));
}

btnBuscarCnpj.addEventListener("click", async () => {
    const cnpj = limparNumero(inputCnpj.value);

    if (cnpj.length !== 14) {
        alert("Digite um CNPJ válido com 14 números.");
        return;
    }

    try {
        const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);

        if (!resposta.ok) {
            throw new Error("CNPJ não encontrado");
        }

        const dados = await resposta.json();

        inputNome.value = dados.nome_fantasia || dados.razao_social || "";
        inputEmail.value = dados.email || "";
        inputCep.value = dados.cep || "";

        const endereco = [
            dados.descricao_tipo_de_logradouro,
            dados.logradouro,
            dados.numero,
            dados.bairro,
            dados.municipio,
            dados.uf
        ].filter(Boolean).join(", ");

        inputEndereco.value = endereco;

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível buscar os dados do CNPJ. Preencha manualmente.");
    }
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = getUsuarioLogado();

    if (!usuario || !usuario.id) {
        alert("Você precisa estar logado para solicitar abertura de loja.");
        window.location.href = "Login.html";
        return;
    }

    const solicitacao = {
        idUsuario: usuario.id,
        nome: inputNome.value.trim(),
        email: inputEmail.value.trim(),
        cnpj: limparNumero(inputCnpj.value),
        cep: limparNumero(inputCep.value),
        endereco: inputEndereco.value.trim(),
        descricao: inputDescricao.value.trim()
    };

    try {
        const resposta = await fetch(`${API_BASE}/solicitacoes-loja`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(solicitacao)
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(erroTexto);
        }

        alert("Solicitação enviada com sucesso! Aguarde aprovação do administrador.");
        window.location.href = "PaginaPerfil.html";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao enviar solicitação de loja.");
    }
});