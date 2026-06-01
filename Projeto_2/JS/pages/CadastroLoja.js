const API_BASE = "http://localhost:8080";

const msgCadastroLoja = document.getElementById("msgCadastroLoja");

const btnAbrirModalCnpj = document.getElementById("btnAbrirModalCnpj");
const modalCnpj = document.getElementById("modalCnpj");
const modalDadosLoja = document.getElementById("modalDadosLoja");

const btnFecharModalCnpj = document.getElementById("btnFecharModalCnpj");
const btnFecharModalDados = document.getElementById("btnFecharModalDados");

const formCnpj = document.getElementById("formCnpj");
const formLoja = document.getElementById("cadastroLojaForm");

const inputCnpj = document.getElementById("cnpj");
const checkHumano = document.getElementById("checkHumano");

const inputRazaoSocial = document.getElementById("razaoSocial");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const inputCep = document.getElementById("cep");
const inputLogradouro = document.getElementById("logradouro");
const inputNumero = document.getElementById("numero");
const inputBairro = document.getElementById("bairro");
const inputCidade = document.getElementById("cidade");
const inputUf = document.getElementById("uf");
const inputComplemento = document.getElementById("complemento");
const inputDescricao = document.getElementById("descricao");
const inputLatitude = document.getElementById("latitude");
const inputLongitude = document.getElementById("longitude");

const btnBuscarCnpj = document.getElementById("btnBuscarCnpj");
const btnEnviarSolicitacao = document.getElementById("btnEnviarSolicitacao");

let buscandoCnpj = false;
let buscandoCep = false;
let enviandoSolicitacao = false;
let cnpjValidado = "";



function abrirModal(modal) {
    modal.classList.add("aberto");
}

function fecharModal(modal) {
    modal.classList.remove("aberto");
}

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
    return String(valor || "").replace(/\D/g, "");
}

function getUsuarioLogado() {
    try {
        return JSON.parse(localStorage.getItem("usuarioLogado"));
    } catch (erro) {
        return null;
    }
}

function montarEnderecoCompleto() {
    const partes = [
        inputLogradouro.value.trim(),
        inputNumero.value.trim(),
        inputBairro.value.trim(),
        inputCidade.value.trim(),
        inputUf.value.trim()
    ];

    return partes.filter(Boolean).join(", ");
}

function bloquearBotao(botao, texto) {
    botao.disabled = true;
    botao.classList.add("carregando");
    botao.dataset.textoOriginal = botao.textContent;
    botao.textContent = texto;
}

function desbloquearBotao(botao) {
    botao.disabled = false;
    botao.classList.remove("carregando");
    botao.textContent = botao.dataset.textoOriginal || botao.textContent;
}

async function buscarCoordenadasPorEndereco() {
    const enderecoCompleto = [
        inputLogradouro.value.trim(),
        inputNumero.value.trim(),
        inputBairro.value.trim(),
        inputCidade.value.trim(),
        inputUf.value.trim(),
        "Brasil"
    ].filter(Boolean).join(", ");

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(enderecoCompleto)}`;

    const resposta = await fetch(url, {
        headers: {
            "Accept": "application/json"
        }
    });

    if (!resposta.ok) {
        throw new Error("Erro ao buscar coordenadas pelo endereço.");
    }

    const dados = await resposta.json();

    if (!dados || dados.length === 0) {
        return null;
    }

    return {
        latitude: Number(dados[0].lat),
        longitude: Number(dados[0].lon)
    };
}

async function buscarCnpj(cnpj) {
    const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);

    if (!resposta.ok) {
        throw new Error("CNPJ não encontrado. Confira o número ou preencha manualmente.");
    }

    return resposta.json();
}

async function buscarCep(cep) {
    const resposta = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);

    if (!resposta.ok) {
        throw new Error("CEP não encontrado.");
    }

    return resposta.json();
}

function preencherDadosCnpj(dados) {
    inputRazaoSocial.value = dados.razao_social || "";
    inputNome.value = dados.nome_fantasia || dados.razao_social || "";
    inputEmail.value = dados.email || "";

    if (dados.cep) {
        inputCep.value = limparNumero(dados.cep);
    }

    if (dados.logradouro) {
        inputLogradouro.value = dados.logradouro;
    }

    if (dados.numero) {
        inputNumero.value = dados.numero;
    }

    if (dados.bairro) {
        inputBairro.value = dados.bairro;
    }

    if (dados.municipio) {
        inputCidade.value = dados.municipio;
    }

    if (dados.uf) {
        inputUf.value = dados.uf;
    }
}

async function preencherDadosCep(dados) {
    inputCep.value = limparNumero(dados.cep || inputCep.value);

    if (dados.street) inputLogradouro.value = dados.street;
    if (dados.neighborhood) inputBairro.value = dados.neighborhood;
    if (dados.city) inputCidade.value = dados.city;
    if (dados.state) inputUf.value = dados.state;

    const coordenadas = dados.location?.coordinates;

    if (coordenadas?.latitude && coordenadas?.longitude) {
        inputLatitude.value = coordenadas.latitude;
        inputLongitude.value = coordenadas.longitude;

        mostrarMensagem(
            msgCadastroLoja,
            "CEP validado com coordenadas.",
            "sucesso"
        );

        return;
    }

    try {
        const fallback = await buscarCoordenadasPorEndereco();

        if (fallback) {
            inputLatitude.value = fallback.latitude;
            inputLongitude.value = fallback.longitude;

            mostrarMensagem(
                msgCadastroLoja,
                "Coordenadas encontradas pelo endereço completo.",
                "sucesso"
            );

            return;
        }
    } catch (erro) {
        console.warn("Fallback de geocodificação falhou:", erro);
    }

    inputLatitude.value = "";
    inputLongitude.value = "";

    mostrarMensagem(
        msgCadastroLoja,
        "Endereço validado, mas sem coordenadas. O admin precisará revisar para aparecer no mapa.",
        "erro"
    );
}

btnAbrirModalCnpj.addEventListener("click", () => {
    abrirModal(modalCnpj);
});

btnFecharModalCnpj.addEventListener("click", () => {
    fecharModal(modalCnpj);
});

btnFecharModalDados.addEventListener("click", () => {
    fecharModal(modalDadosLoja);
});

modalCnpj.addEventListener("click", (event) => {
    if (event.target === modalCnpj) {
        fecharModal(modalCnpj);
    }
});

modalDadosLoja.addEventListener("click", (event) => {
    if (event.target === modalDadosLoja) {
        fecharModal(modalDadosLoja);
    }
});

formCnpj.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (buscandoCnpj) return;

    const cnpj = limparNumero(inputCnpj.value);

    if (cnpj.length !== 14) {
        mostrarMensagem(msgCadastroLoja, "Digite um CNPJ válido com 14 números.", "erro");
        return;
    }

    if (!checkHumano.checked) {
        mostrarMensagem(msgCadastroLoja, "Confirme que você é uma pessoa humana.", "erro");
        return;
    }

    try {
        buscandoCnpj = true;
        bloquearBotao(btnBuscarCnpj, "Buscando...");

        const dadosCnpj = await buscarCnpj(cnpj);

        cnpjValidado = cnpj;
        preencherDadosCnpj(dadosCnpj);

        fecharModal(modalCnpj);
        abrirModal(modalDadosLoja);

        mostrarMensagem(
            msgCadastroLoja,
            "CNPJ validado. Confira os dados da loja.",
            "sucesso"
        );

        const cepCnpj = limparNumero(inputCep.value);

        if (cepCnpj.length === 8) {
            try {
                buscandoCep = true;
                const dadosCep = await buscarCep(cepCnpj);
                preencherDadosCep(dadosCep);
            } catch (erroCep) {
                console.warn(erroCep);
                mostrarMensagem(
                    msgCadastroLoja,
                    "CNPJ encontrado, mas não foi possível validar o CEP automaticamente.",
                    "erro"
                );
            } finally {
                buscandoCep = false;
            }
        }

    } catch (erro) {
        console.error(erro);
        mostrarMensagem(
            msgCadastroLoja,
            erro.message || "Não foi possível buscar o CNPJ.",
            "erro"
        );

    } finally {
        buscandoCnpj = false;
        desbloquearBotao(btnBuscarCnpj);
    }
});

inputCep.addEventListener("blur", async () => {
    if (buscandoCep) return;

    const cep = limparNumero(inputCep.value);

    if (!cep) return;

    if (cep.length !== 8) {
        mostrarMensagem(msgCadastroLoja, "CEP inválido. Informe 8 números.", "erro");
        return;
    }

    try {
        buscandoCep = true;
        const dadosCep = await buscarCep(cep);
        preencherDadosCep(dadosCep);

    } catch (erro) {
        console.error(erro);
        mostrarMensagem(
            msgCadastroLoja,
            "Não foi possível buscar o CEP. Confira o número digitado.",
            "erro"
        );

    } finally {
        buscandoCep = false;
    }
});

formLoja.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (enviandoSolicitacao) return;

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

    const cnpj = cnpjValidado || limparNumero(inputCnpj.value);
    const cep = limparNumero(inputCep.value);

    const solicitacao = {
        idUsuario: usuario.id,
        razaoSocial: inputRazaoSocial.value.trim(),
        nome: inputNome.value.trim(),
        email: inputEmail.value.trim(),
        cnpj,
        cep,
        logradouro: inputLogradouro.value.trim(),
        numero: inputNumero.value.trim(),
        complemento: inputComplemento.value.trim(),
        bairro: inputBairro.value.trim(),
        cidade: inputCidade.value.trim(),
        uf: inputUf.value.trim().toUpperCase(),
        endereco: montarEnderecoCompleto(),
        descricao: inputDescricao.value.trim(),
        latitude: inputLatitude.value ? Number(inputLatitude.value) : null,
        longitude: inputLongitude.value ? Number(inputLongitude.value) : null
    };
    
    const camposObrigatoriosPreenchidos =
        solicitacao.razaoSocial &&
        solicitacao.nome &&
        solicitacao.email &&
        solicitacao.cnpj &&
        solicitacao.cep &&
        solicitacao.logradouro &&
        solicitacao.numero &&
        solicitacao.bairro &&
        solicitacao.cidade &&
        solicitacao.uf;

    if (!camposObrigatoriosPreenchidos) {
        mostrarMensagem(
            msgCadastroLoja,
            "Preencha todos os campos obrigatórios. Apenas descrição e complemento são opcionais.",
            "erro"
        );
        return;
    }

    if (solicitacao.cnpj.length !== 14) {
        mostrarMensagem(msgCadastroLoja, "CNPJ inválido. Informe 14 números.", "erro");
        return;
    }

    if (solicitacao.cep.length !== 8) {
        mostrarMensagem(msgCadastroLoja, "CEP inválido. Informe 8 números.", "erro");
        return;
    }

    if (!solicitacao.email.includes("@") || !solicitacao.email.includes(".")) {
        mostrarMensagem(msgCadastroLoja, "Informe um e-mail válido para a loja.", "erro");
        return;
    }

    try {
        enviandoSolicitacao = true;
        bloquearBotao(btnEnviarSolicitacao, "Enviando...");

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

        fecharModal(modalDadosLoja);

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
        enviandoSolicitacao = false;
        desbloquearBotao(btnEnviarSolicitacao);
    }
});