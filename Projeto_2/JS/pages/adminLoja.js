import { configurarHeader } from "../components/header.js";
import { montarVitrineLoja } from "../components/VitrineLoja.js";

/*************************************************
 * CONFIGURAÇÕES GERAIS
 *************************************************/
const API = "https://tccvisionplus-production.up.railway.app";

/*************************************************
 * ESTADO GLOBAL DA PÁGINA
 *************************************************/
const state = {
    usuario: null,
    loja: null,
    lojaId: null,
    armacoes: [],
    lentes: []
};

state.configuracao = {
    bannerUrl: "",
    textoDestaque: "",
    mostrarBanner: false,

    fontePrimaria: "Arial",
    fonteSecundaria: "Helvetica",

    corPrimaria: "#156783",
    corSecundaria: "#b5d7df",
    corFundo: "#f5f7fa",

    layoutPagina: "padrao",
    layoutProdutos: "grid",

    mostrarPreco: true,
    mostrarMarca: true,
    produtosLinha: 4
};
/*************************************************
 * INICIALIZAÇÃO
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
    initPaginaAdmin();
});

async function initPaginaAdmin() {
    try {
        configurarHeader();

        carregarUsuarioLogado();
        carregarLojaDoUsuario();
        renderizarDadosLoja();

        await carregarConfiguracoesLoja();
        await carregarArmacoes();
        await carregarLentes();

        configurarEventos();
        bloquearCamposPorPlano();

        await aplicarConfiguracaoPreview();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/*************************************************
 * USUÁRIO E LOJA
 *************************************************/
function carregarUsuarioLogado() {
    const usuarioString = localStorage.getItem("usuarioLogado");

    if (!usuarioString) {
        throw new Error("Usuário não está logado");
    }

    state.usuario = JSON.parse(usuarioString);
    ("USUÁRIO LOGADO:", state.usuario);
}

function carregarLojaDoUsuario() {
    if (!state.usuario?.loja) {
        throw new Error("Usuário não possui loja");
    }

    state.loja = state.usuario.loja;
    state.lojaId = state.loja.id;

    if (!state.lojaId) {
        throw new Error("ID da loja inválido");
    }

    ("OBJETO LOJA:", state.loja);
}

function obterPlanoLoja() {
    return (state.loja?.plano || "FREE").trim().toUpperCase();
}


function renderizarDadosLoja() {
    const plano = obterPlanoLoja();

    const nomeLojaTopo = document.getElementById("nomeLoja");
    if (nomeLojaTopo) {
        nomeLojaTopo.textContent = state.loja.nome || "Minha loja";
    }

    const planoAtual = document.getElementById("planoAtualLoja");
    if (planoAtual) {
        planoAtual.textContent = plano;
        planoAtual.className = `badge-plano plano-${plano.toLowerCase()}`;
    }

    const nomePreview = document.getElementById("NomeLoja");
    if (nomePreview) {
        nomePreview.textContent = state.loja.nome || "";
    }

    const descricaoPreview = document.getElementById("DescricaoLoja");
    if (descricaoPreview) {
        descricaoPreview.textContent = state.loja.descricao || "";
    }

    const emailPreview = document.getElementById("EmailLoja");
    if (emailPreview) {
        emailPreview.textContent = state.loja.email || "";
    }

    const enderecoPreview = document.getElementById("EnderecoLoja");
    if (enderecoPreview) {
        enderecoPreview.textContent = state.loja.endereco || "";
    }
}


/*************************************************
 * CARREGAMENTO DE ARMAÇÕES
 *************************************************/
async function carregarArmacoes() {
    const response = await fetch(
        `${API}/armacao/listarArmacoes/${state.lojaId}`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar armações");
    }

    state.armacoes = await response.json();
}

/*************************************************
 * CARREGAMENTO DE LENTES
 *************************************************/
async function carregarLentes() {
    const response = await fetch(
        `${API}/lentes/listarLentes/${state.lojaId}`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar lentes");
    }

    state.lentes = await response.json();
}



/*************************************************
 * CONFIGURAÇÕES DA LOJA
 *************************************************/


function atualizarCards() {
    aplicarConfiguracaoPreview();
}

async function carregarConfiguracoesLoja() {
    const response = await fetch(`${API}/configuracao/buscar/${state.lojaId}`);

    if (!response.ok) {
        throw new Error("Erro ao carregar configurações da loja");
    }

    state.configuracao = await response.json();
    preencherInputsConfiguracao();
}

function preencherInputsConfiguracao() {
    document.getElementById("fontePrimaria").value = state.configuracao.fontePrimaria || "Arial";
    document.getElementById("fonteSecundaria").value = state.configuracao.fonteSecundaria || "Helvetica";

    document.getElementById("corPrimaria").value = state.configuracao.corPrimaria || "#156783";
    document.getElementById("corSecundaria").value = state.configuracao.corSecundaria || "#b5d7df";
    document.getElementById("corFundo").value = state.configuracao.corFundo || "#f5f7fa";

    document.getElementById("layoutPagina").value = state.configuracao.layoutPagina || "padrao";
    document.getElementById("layoutProdutos").value = state.configuracao.layoutProdutos || "grid";

    document.getElementById("mostrarPreco").checked = !!state.configuracao.mostrarPreco;
    document.getElementById("mostrarMarca").checked = !!state.configuracao.mostrarMarca;

    document.getElementById("produtosPorLinha").value = state.configuracao.produtosLinha || 4;

    document.getElementById("bannerUrl").value = state.configuracao.bannerUrl || "";
    document.getElementById("mostrarBanner").checked = !!state.configuracao.mostrarBanner;

    document.getElementById("textoDestaque").value = state.configuracao.textoDestaque || "";
}

function montarConfiguracaoDTO() {
    return {
        fontePrimaria: document.getElementById("fontePrimaria").value,
        fonteSecundaria: document.getElementById("fonteSecundaria").value,

        corPrimaria: document.getElementById("corPrimaria").value,
        corSecundaria: document.getElementById("corSecundaria").value,
        corFundo: document.getElementById("corFundo").value,

        layoutPagina: document.getElementById("layoutPagina").value,
        layoutProdutos: document.getElementById("layoutProdutos").value,

        mostrarPreco: document.getElementById("mostrarPreco").checked,
        mostrarMarca: document.getElementById("mostrarMarca").checked,

        produtosLinha: Number(document.getElementById("produtosPorLinha").value),

        bannerUrl: document.getElementById("bannerUrl").value.trim(),
        mostrarBanner: document.getElementById("mostrarBanner").checked,

        textoDestaque: document.getElementById("textoDestaque").value.trim()
    };
}

async function salvarConfiguracoes() {
    let dto = montarConfiguracaoDTO();

    const configComBanner = await uploadBannerLoja();

    if (configComBanner) {
        state.configuracao = {
            ...state.configuracao,
            ...configComBanner
        };

        dto = {
            ...dto,
            bannerUrl: configComBanner.bannerUrl,
            mostrarBanner: true
        };

        document.getElementById("bannerUrl").value = configComBanner.bannerUrl || "";
        document.getElementById("mostrarBanner").checked = true;
    }

    ("DTO ENVIADO PARA O BACK:", dto);

    const response = await fetch(
        `${API}/configuracao/editar/${state.lojaId}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        }
    );

    if (!response.ok) {
        const erro = await response.text();
        console.error("ERRO AO SALVAR:", erro);
        throw new Error(erro || "Erro ao salvar configurações");
    }

    const configSalva = await response.json();

    ("CONFIGURAÇÃO RETORNADA PELO BACK:", configSalva);

    state.configuracao = configSalva;

    preencherInputsConfiguracao();
    bloquearCamposPorPlano();
    await aplicarConfiguracaoPreview();

    alert("Configurações salvas com sucesso!");
}

function resetarConfiguracoes() {
    state.configuracao = {
        bannerUrl: "",
        textoDestaque: "",
        mostrarBanner: false,

        fontePrimaria: "Arial",
        fonteSecundaria: "Helvetica",

        corPrimaria: "#156783",
        corSecundaria: "#b5d7df",
        corFundo: "#f5f7fa",

        layoutPagina: "padrao",
        layoutProdutos: "grid",

        mostrarPreco: true,
        mostrarMarca: true,
        produtosLinha: 4
    };

    preencherInputsConfiguracao();
    bloquearCamposPorPlano();
    aplicarConfiguracaoPreview();

    alert("Configurações salvas com sucesso!");
}

async function uploadBannerLoja() {
    const input = document.getElementById("bannerArquivo");

    if (!input || !input.files || input.files.length === 0) {
        return null;
    }

    const arquivo = input.files[0];

    const tiposPermitidos = ["image/png", "image/jpeg", "image/jpg"];
    const tamanhoMaximoMB = 10;
    const tamanhoMaximoBytes = tamanhoMaximoMB * 1024 * 1024;

    if (!tiposPermitidos.includes(arquivo.type)) {
        throw new Error("Formato inválido. Use PNG ou JPG.");
    }

    if (arquivo.size > tamanhoMaximoBytes) {
        throw new Error(`Imagem muito grande. Envie uma imagem com até ${tamanhoMaximoMB}MB.`);
    }

    const formData = new FormData();
    formData.append("file", arquivo);

    const response = await fetch(`${API}/configuracao/${state.lojaId}/banner`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro || "Erro ao enviar banner.");
    }

    return await response.json();
}

async function aplicarConfiguracaoPreview() {
    const preview = document.getElementById("previewPublico");

    if (!preview) return;

    await montarVitrineLoja({
        containerId: "previewPublico",
        loja: state.loja,
        configuracao: state.configuracao,
        lentes: state.lentes,
        armacoes: state.armacoes,
        modo: "preview",
        permitirCotacao: false, 
        onCotarProduto: null,
        onAbrirProduto: null
    });
}



/*************************************************
* PLANOS
*************************************************/

function bloquearCamposPorPlano() {
    const plano = obterPlanoLoja();

    const camposPlus = [
        "layoutProdutos",
        "produtosPorLinha",
        "mostrarPreco",
        "bannerUrl",
        "mostrarBanner"
    ];

    const camposPro = [
        "layoutPagina",
        "textoDestaque"
    ];

    const plusLiberado = plano === "PLUS" || plano === "PRO";
    const proLiberado = plano === "PRO";

    aplicarBloqueioCampos(camposPlus, !plusLiberado);
    aplicarBloqueioCampos(camposPro, !proLiberado);

    marcarSecaoBloqueada(".recurso-plus", !plusLiberado);
    marcarSecaoBloqueada(".recurso-pro", !proLiberado);

    if (plano === "FREE") {
        state.configuracao.mostrarPreco = true;
        state.configuracao.mostrarBanner = false;
        state.configuracao.bannerUrl = "";
        state.configuracao.textoDestaque = "";
        state.configuracao.layoutPagina = "padrao";
        state.configuracao.layoutProdutos = "grid";
        state.configuracao.produtosLinha = 4;

        document.getElementById("mostrarPreco").checked = true;
        document.getElementById("mostrarBanner").checked = false;
    }
}

function aplicarBloqueioCampos(ids, bloquear) {
    ids.forEach(id => {
        const elemento = document.getElementById(id);

        if (!elemento) return;

        elemento.disabled = bloquear;

        const campo = elemento.closest(".campo-config");

        if (campo) {
            campo.classList.toggle("campo-bloqueado", bloquear);
        }
    });
}

function marcarSecaoBloqueada(seletor, bloquear) {
    document.querySelectorAll(seletor).forEach(secao => {
        secao.classList.toggle("secao-bloqueada", bloquear);
    });
}

/*************************************************
 * MODAIS
 *************************************************/
function abrirModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function fecharModal(id) {
    document.getElementById(id).classList.add("hidden");
}

/*************************************************
 * EVENTOS
 *************************************************/
function configurarEventos() {
    document
    .getElementById("salvarConfiguracoes")
    .addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            await salvarConfiguracoes();
        } catch (error) {
            console.error("Erro ao salvar configurações:", error);
            alert(error.message || "Erro ao salvar configurações.");
        }
    });

    document
        .getElementById("resetarConfiguracoes")
        .addEventListener("click", resetarConfiguracoes);

    document.querySelectorAll(".config-input").forEach(input => {
        input.addEventListener("input", atualizarPreviewAoVivo);
        input.addEventListener("change", atualizarPreviewAoVivo);
    });
}

function atualizarPreviewAoVivo() {
    state.configuracao = montarConfiguracaoDTO();

    const plano = obterPlanoLoja();

    if (plano === "FREE") {
        state.configuracao.layoutPagina = "padrao";
        state.configuracao.layoutProdutos = "grid";
        state.configuracao.produtosLinha = 4;
        state.configuracao.mostrarPreco = true;
        state.configuracao.mostrarBanner = false;
        state.configuracao.bannerUrl = "";
        state.configuracao.textoDestaque = "";
    }

    if (plano === "PLUS") {
        state.configuracao.layoutPagina = "banner";
        state.configuracao.textoDestaque = "";
    }

    preencherInputsConfiguracao();
    bloquearCamposPorPlano();
    aplicarConfiguracaoPreview();
}





