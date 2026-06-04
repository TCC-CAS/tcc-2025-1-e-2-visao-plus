import { getUsuarioLogado } from "../core/auth.js";
import {
    listarCuponsGlobais,
    listarCuponsPublicosDaLoja,
    listarCuponsDoUsuario,
    resgatarCupom
} from "../core/cupons.js";

const CSS_CUPONS_ID = "cupons-widget-css";
const CSS_CUPONS_PATH = "css/components/CuponsWidget.css";

function carregarCssCuponsWidget() {
    if (document.getElementById(CSS_CUPONS_ID)) return;

    const link = document.createElement("link");
    link.id = CSS_CUPONS_ID;
    link.rel = "stylesheet";
    link.href = CSS_CUPONS_PATH;

    document.head.appendChild(link);
}

export async function montarSecaoCupons({
    containerId,
    modo,
    idLoja = null,
    titulo = "Cupons disponíveis",
    subtitulo = "Resgate descontos por tempo limitado."
}) {
    carregarCssCuponsWidget();

    const container = document.getElementById(containerId);

    if (!container) return;

    container.classList.add("vp-cupons-widget");
    container.innerHTML = criarEstruturaBase(titulo, subtitulo, modo);

    const lista = container.querySelector(".vp-cupons-lista");

    try {
        let cupons = [];

        if (modo === "global") {
            cupons = await listarCuponsGlobais();
        }

        if (modo === "loja") {
            cupons = await listarCuponsPublicosDaLoja(idLoja);
        }

        if (modo === "perfil") {
            const usuario = getUsuarioLogado();

            if (!usuario) {
                lista.innerHTML = criarVazio("Faça login para visualizar seus cupons.");
                return;
            }

            cupons = await listarCuponsDoUsuario(usuario.id);
        }

        renderizarCupons(lista, cupons, modo);

    } catch (error) {
        console.error("Erro ao montar seção de cupons:", error);
        lista.innerHTML = criarVazio("Não foi possível carregar os cupons agora.");
    }
}

function criarEstruturaBase(titulo, subtitulo, modo) {
    const classeModo = modo === "perfil" ? "perfil" : "publico";

    return `
        <section class="vp-cupons-box ${classeModo}">
            <div class="vp-cupons-topo">
                <div>
                    <span class="vp-cupons-eyebrow">VisionPlus+ descontos</span>
                    <h2>${titulo}</h2>
                    <p>${subtitulo}</p>
                </div>
            </div>

            <div class="vp-cupons-lista">
                <p>Carregando cupons...</p>
            </div>
        </section>
    `;
}

function renderizarCupons(container, cupons, modo) {
    if (!cupons || cupons.length === 0) {
        container.innerHTML = criarVazio(
            modo === "perfil"
                ? "Você ainda não possui cupons resgatados."
                : "Nenhum cupom disponível no momento."
        );
        return;
    }

    container.innerHTML = "";

    cupons.forEach(item => {
        const cupom = modo === "perfil" ? item.cupom : item;
        const statusUsuario = modo === "perfil" ? item.status : null;

        container.appendChild(criarCardCupomUsuario(cupom, modo, statusUsuario));
    });
}

function criarCardCupomUsuario(cupom, modo, statusUsuario) {
    const card = document.createElement("article");
    card.className = "vp-cupom-card";

    const vencido = new Date(cupom.dataValidade) < new Date();
    const jaResgatado = statusUsuario === "RESGATADO";
    const jaUsado = statusUsuario === "USADO";

    card.innerHTML = `
        <div class="vp-cupom-icone">
            ${cupom.tipoDesconto === "PORCENTAGEM" ? "%" : "R$"}
        </div>

        <div class="vp-cupom-conteudo">
            <div class="vp-cupom-header">
                <strong>${cupom.codigo}</strong>
                <span class="vp-cupom-tag ${classeStatusCupom(vencido, statusUsuario)}">
                    ${textoStatusCupom(vencido, statusUsuario)}
                </span>
            </div>

            <p class="vp-cupom-descricao">
                ${cupom.descricao || "Cupom promocional da loja."}
            </p>

            <div class="vp-cupom-desconto">
                ${formatarDesconto(cupom)}
            </div>

            <small class="vp-cupom-validade">
                Tempo restante:
                <b data-contagem-cupom="${cupom.dataValidade}">
                    ${calcularTempoRestante(cupom.dataValidade)}
                </b>
            </small>
        </div>

        <div class="vp-cupom-footer">
            ${criarBotaoAcao(cupom, modo, vencido, statusUsuario)}
        </div>
    `;

    const botao = card.querySelector(".btn-resgatar-cupom-widget");

    if (botao) {
        botao.addEventListener("click", async () => {
            await resgatarCupomWidget(cupom.id, botao);
        });
    }

    iniciarContadorCard(card);

    return card;
}

function textoStatusCupom(vencido, statusUsuario) {
    if (vencido) return "Vencido";

    if (statusUsuario === "USADO") return "Usado";
    if (statusUsuario === "RESGATADO") return "Resgatado";
    if (statusUsuario === "EXPIRADO") return "Expirado";
    if (statusUsuario === "CANCELADO") return "Cancelado";

    return "Disponível";
}

function classeStatusCupom(vencido, statusUsuario) {
    if (vencido) return "vencido";

    if (statusUsuario === "USADO") return "usado";
    if (statusUsuario === "RESGATADO") return "resgatado";
    if (statusUsuario === "EXPIRADO") return "vencido";

    return "ativo";
}

function criarBotaoAcao(cupom, modo, vencido, statusUsuario) {
    if (modo === "perfil") {
        return `<button class="btn-cupom-widget secundario" disabled>${textoStatusCupom(vencido, statusUsuario)}</button>`;
    }

    if (vencido) {
        return `<button class="btn-cupom-widget secundario" disabled>Vencido</button>`;
    }

    const usuario = getUsuarioLogado();

    if (!usuario) {
        return `<button class="btn-cupom-widget btn-resgatar-cupom-widget">Entrar para resgatar</button>`;
    }

    if (!usuarioPodeResgatarCupom(usuario)) {
        return `<button class="btn-cupom-widget secundario" disabled>Apenas consumidores</button>`;
    }

    return `<button class="btn-cupom-widget btn-resgatar-cupom-widget">Resgatar cupom</button>`;
}

function usuarioPodeResgatarCupom(usuario) {
    const tipo = String(usuario?.tipoUsuario || "").toLowerCase();

    return tipo === "comum" || tipo === "consumidor" || tipo === "cliente";
}

async function resgatarCupomWidget(idCupom, botao) {
    const usuario = getUsuarioLogado();

    if (!usuario) {
        alert("Faça login como consumidor para resgatar este cupom.");
        window.location.href = "Login.html";
        return;
    }

    if (!usuarioPodeResgatarCupom(usuario)) {
        alert("Somente usuários consumidores podem resgatar cupons.");
        return;
    }

    try {
        botao.disabled = true;
        botao.textContent = "Resgatando...";

        await resgatarCupom(idCupom, usuario.id);

        botao.textContent = "Resgatado";
        botao.classList.add("secundario");

        const card = botao.closest(".vp-cupom-card");
        const tag = card?.querySelector(".vp-cupom-tag");

        if (tag) {
            tag.textContent = "Resgatado";
            tag.className = "vp-cupom-tag resgatado";
        }

        alert("Cupom adicionado aos seus cupons!");

    } catch (error) {
        botao.disabled = false;
        botao.textContent = "Resgatar cupom";
        alert(error.message);
    }
}

function iniciarContadorCard(card) {
    const alvo = card.querySelector("[data-contagem-cupom]");

    if (!alvo) return;

    const validade = alvo.dataset.contagemCupom;

    const timer = setInterval(() => {
        const texto = calcularTempoRestante(validade);
        alvo.textContent = texto;

        if (texto === "Encerrado") {
            clearInterval(timer);
        }
    }, 1000);
}

function calcularTempoRestante(dataValidade) {
    const agora = new Date();
    const fim = new Date(dataValidade);
    const diff = fim - agora;

    if (diff <= 0) return "Encerrado";

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    if (dias > 0) {
        return `${dias}d ${horas}h ${minutos}m`;
    }

    return `${horas}h ${minutos}m ${segundos}s`;
}

function formatarDesconto(cupom) {
    const valor = Number(cupom.valorDesconto);

    if (cupom.tipoDesconto === "PORCENTAGEM") {
        return `${valor.toString().replace(".", ",")}% OFF`;
    }

    return `R$ ${valor.toFixed(2).replace(".", ",")} OFF`;
}

function criarVazio(texto) {
    return `
        <div class="vp-cupons-vazio">
            <strong>🎟️ ${texto}</strong>
        </div>
    `;
}