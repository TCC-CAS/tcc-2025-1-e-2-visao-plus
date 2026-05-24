const API_BASE = "http://localhost:8080";

const form = document.getElementById("cadastroLojaForm");
const btnBuscarCnpj = document.getElementById("btnBuscarCnpj");
const btnSubmit = form.querySelector("button[type='submit']");
const msgCadastroLoja = document.getElementById("msgCadastroLoja");

const inputCnpj = document.getElementById("cnpj");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const inputCep = document.getElementById("cep");
const inputEndereco = document.getElementById("endereco");
const inputDescricao = document.getElementById("descricao");

let processando = false;
let buscandoCnpj = false;

function mostrarMensagem(elemento, texto, tipo) {
    if (!elemento) {
        alert(texto);
        return;
    }

    elemento.textContent = texto;
    elemento.classList.remove("sucesso", "erro");
    elemento.classList.add("mostrar", tipo);

    setTimeout(() => {
        elemento.classList.remove("mostrar");
    }, 4000);
}

function limparNumero(valor) {
    return valor.replace(/\D/g, "");
}

function getUsuarioLogado() {
    return JSON.parse(localStorage.getItem("usuarioLogado"));
}

btnBuscarCnpj.addEventListener("click", async () => {
    if (buscandoCnpj) return;

    const cnpj = limparNumero(inputCnpj.value);

    if (cnpj.length !== 14) {
        mostrarMensagem(msgCadastroLoja, "Digite um CNPJ válido com 14 números.", "erro");
        return;
    }

    try {
        buscandoCnpj = true;
        btnBuscarCnpj.disabled = true;
        btnBuscarCnpj.classList.add("carregando");
        btnBuscarCnpj.textContent = "Buscando...";

        const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);

        if (!resposta.ok) {
            throw new Error("CNPJ não encontrado.");
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

        mostrarMensagem(
            msgCadastroLoja,
            "Dados do CNPJ preenchidos com sucesso!",
            "sucesso"
        );

    } catch (erro) {
        console.error(erro);
        mostrarMensagem(
            msgCadastroLoja,
            erro.message || "Não foi possível buscar o CNPJ. Preencha manualmente.",
            "erro"
        );

    } finally {
        buscandoCnpj = false;
        btnBuscarCnpj.disabled = false;
        btnBuscarCnpj.classList.remove("carregando");
        btnBuscarCnpj.textContent = "Buscar dados do CNPJ";
    }
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (processando) return;

    const usuario = getUsuarioLogado();

    if (!usuario || !usuario.id) {
        mostrarMensagem(
            msgCadastroLoja,
            "Você precisa estar logado para solicitar abertura de loja.",
            "erro"
        );

        setTimeout(() => {
            window.location.href = "Login.html";
        }, 2000);

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

    if (!solicitacao.nome || !solicitacao.cnpj || !solicitacao.cep || !solicitacao.endereco) {
        mostrarMensagem(
            msgCadastroLoja,
            "Preencha os campos obrigatórios da loja.",
            "erro"
        );
        return;
    }

    if (solicitacao.cnpj.length !== 14) {
        mostrarMensagem(
            msgCadastroLoja,
            "CNPJ inválido. Informe 14 números.",
            "erro"
        );
        return;
    }

    try {
        processando = true;
        btnSubmit.classList.add("carregando");
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Enviando...";

        const resposta = await fetch(`${API_BASE}/solicitacoes-loja`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(solicitacao)
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            mostrarMensagem(
                msgCadastroLoja,
                erroTexto || "Erro ao enviar solicitação de loja.",
                "erro"
            );
            return;
        }

        mostrarMensagem(
            msgCadastroLoja,
            "Solicitação enviada com sucesso! Aguarde aprovação do administrador.",
            "sucesso"
        );

        setTimeout(() => {
            window.location.href = "PaginaPerfil.html";
        }, 2500);

    } catch (erro) {
        console.error(erro);
        mostrarMensagem(
            msgCadastroLoja,
            "Erro ao conectar com o servidor.",
            "erro"
        );

    } finally {
        processando = false;
        btnSubmit.classList.remove("carregando");
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Enviar solicitação";
    }
});