const CSS_TEMA_ID = "vp-loja-tema-css";

export const CONFIG_LOJA_PADRAO = {
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

export function normalizarConfiguracaoLoja(config = {}) {
    return {
        ...CONFIG_LOJA_PADRAO,
        ...config
    };
}

export function aplicarTemaLoja({
    alvo = document.body,
    configuracao = {},
    plano = "FREE",
    classeBase = "vp-loja-theme"
}) {
    if (!alvo) return;

    const config = normalizarConfiguracaoLoja(configuracao);
    const planoNormalizado = String(plano || "FREE").toLowerCase();

    injetarCssTemaLoja();

    alvo.classList.add(classeBase);

    alvo.style.setProperty("--cor-primaria", config.corPrimaria || "#156783");
    alvo.style.setProperty("--cor-secundaria", config.corSecundaria || "#b5d7df");
    alvo.style.setProperty("--cor-fundo", config.corFundo || "#f5f7fa");

    alvo.style.setProperty("--fonte-primaria", config.fontePrimaria || "Arial");
    alvo.style.setProperty("--fonte-secundaria", config.fonteSecundaria || "Helvetica");

    alvo.style.setProperty("--produtos-linha", config.produtosLinha || 4);

    alvo.classList.remove(
        "plano-free",
        "plano-plus",
        "plano-pro",
        "layout-padrao",
        "layout-banner",
        "layout-vitrine",
        "produtos-grid",
        "produtos-lista",
        "produtos-horizontal"
    );

    alvo.classList.add(`plano-${planoNormalizado}`);
    alvo.classList.add(`layout-${config.layoutPagina || "padrao"}`);
    alvo.classList.add(`produtos-${config.layoutProdutos || "grid"}`);
}

export function aplicarBannerLoja({
    elementoHero,
    configuracao = {},
    plano = "FREE"
}) {
    if (!elementoHero) return;

    const config = normalizarConfiguracaoLoja(configuracao);
    const planoNormalizado = String(plano || "FREE").toUpperCase();

    const podeMostrarBanner =
        (planoNormalizado === "PLUS" || planoNormalizado === "PRO") &&
        config.mostrarBanner &&
        config.bannerUrl &&
        config.bannerUrl.trim() !== "";

    if (podeMostrarBanner) {
        elementoHero.style.backgroundImage = `url('${config.bannerUrl}')`;
        elementoHero.classList.add("com-banner");
    } else {
        elementoHero.style.backgroundImage = "none";
        elementoHero.classList.remove("com-banner");
    }
}

export function injetarCssTemaLoja() {
    if (document.getElementById(CSS_TEMA_ID)) return;

    const style = document.createElement("style");
    style.id = CSS_TEMA_ID;
    style.textContent = obterCssTemaLoja();

    document.head.appendChild(style);
}

function obterCssTemaLoja() {
    return `
        .vp-loja-theme {
            --cor-primaria: #156783;
            --cor-secundaria: #b5d7df;
            --cor-fundo: #f5f7fa;
            --fonte-primaria: Arial, Helvetica, sans-serif;
            --fonte-secundaria: Helvetica, Arial, sans-serif;
            --produtos-linha: 4;
        }

        .vp-loja-theme .vp-cupons-box {
            background: rgba(255,255,255,0.76);
            border: 1px solid color-mix(in srgb, var(--cor-primaria) 24%, transparent);
            border-radius: 18px;
            padding: 18px;
            box-shadow: 0 10px 24px rgba(0,0,0,0.06);
            font-family: var(--fonte-primaria);
        }

        .vp-loja-theme .vp-cupons-eyebrow {
            color: var(--cor-primaria);
            font-family: var(--fonte-secundaria);
            font-weight: 900;
            letter-spacing: 0.7px;
        }

        .vp-loja-theme .vp-cupons-topo h2 {
            color: var(--cor-primaria);
            font-family: var(--fonte-secundaria);
        }

        .vp-loja-theme .vp-cupons-topo p {
            color: #667085;
        }

        .vp-loja-theme .vp-cupom-card {
            background: white;
            border: 1px solid color-mix(in srgb, var(--cor-primaria) 20%, #ffffff);
            border-left: 5px solid var(--cor-primaria);
            border-radius: 15px;
            padding: 14px;
            box-shadow: 0 7px 18px rgba(0,0,0,0.05);
        }

        .vp-loja-theme .vp-cupom-lateral {
            background: var(--cor-primaria);
            color: white;
        }

        .vp-loja-theme .vp-cupom-header strong,
        .vp-loja-theme .vp-cupom-desconto {
            color: var(--cor-primaria);
            font-family: var(--fonte-secundaria);
        }

        .vp-loja-theme .btn-cupom-widget {
            background: var(--cor-primaria);
            color: white;
        }

        .vp-loja-theme .btn-cupom-widget:hover {
            filter: brightness(0.88);
        }

        .vp-loja-theme .vp-cupom-tag.ativo {
            background: color-mix(in srgb, var(--cor-secundaria) 55%, #ffffff);
            color: var(--cor-primaria);
        }

        .vp-loja-theme .vp-cupons-vazio {
            background: rgba(255,255,255,0.72);
            border: 1px dashed color-mix(in srgb, var(--cor-primaria) 28%, #ffffff);
            color: #667085;
        }
    `;
}