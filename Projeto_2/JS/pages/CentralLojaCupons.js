import { getUsuarioLogado } from "../core/auth.js";
import {
    listarCuponsDaLoja,
    resumoCuponsDaLoja,
    ativarCupomPublico,
    desativarCupom,
    enviarCupomParaUsuarios
} from "../core/cupons.js";

let lojaAtual = null;
let cuponsAtuais = [];

document.addEventListener("DOMContentLoaded", () => {
    const usuario = getUsuarioLogado();

    if (!usuario || !usuario.loja) return;

    lojaAtual = usuario.loja;

    document.addEventListener("painelCentralAlterado", async (event) => {
        if (event.detail?.painel === "cupons") {
            await carregarCuponsCentral();
        }
    });

    document.addEventListener("click", async (event) => {
        const cardCupom = event.target.closest("[data-cupom-id]");

        if (!cardCupom) return;

        const idCupom = Number(cardCupom.dataset.cupomId);

        if (event.target.classList.contains("btn-ativar-cupom")) {
            await ativarGlobal(idCupom);
        }

        if (event.target.classList.contains("btn-desativar-cupom")) {
            await desativar(idCupom);
        }

        if (event.target.classList.contains("btn-enviar-cupom")) {
            abrirEnvioUsuarios(idCupom);
        }
    });
});

async function carregarCuponsCentral() {
    const usuario = getUsuarioLogado();
    const loja = lojaAtual || usuario?.loja;

    if (!loja) return;

    const root = document.querySelector("#conteudo-dinamico #secao-cupons-central");

    if (!root) return;

    const plano = loja.plano || "FREE";

    const bloqueio = root.querySelector("#bloqueio-cupons-plano");
    const conteudo = root.querySelector("#conteudo-cupons-central");

    if (plano === "FREE") {
        bloqueio?.classList.remove("hidden");
        conteudo?.classList.add("hidden");
        return;
    }

    bloqueio?.classList.add("hidden");
    conteudo?.classList.remove("hidden");

    await carregarResumo(loja.id, root);
    await carregarLista(loja.id, root);
}

async function carregarResumo(idLoja, root) {
    try {
        const resumo = await resumoCuponsDaLoja(idLoja);

        setTexto(root, "cupom-stat-total", resumo.total ?? 0);
        setTexto(root, "cupom-stat-ativos", resumo.ativos ?? 0);
        setTexto(root, "cupom-stat-resgatados", resumo.resgatados ?? 0);
        setTexto(root, "cupom-stat-usados", resumo.usados ?? 0);
    } catch (error) {
        console.error("Erro ao carregar resumo de cupons:", error);
    }
}

async function carregarLista(idLoja, root) {
    const container = root.querySelector("#lista-cupons-central");

    if (!container) return;

    container.innerHTML = "<p>Carregando cupons...</p>";

    try {
        cuponsAtuais = await listarCuponsDaLoja(idLoja);

        if (!cuponsAtuais || cuponsAtuais.length === 0) {
            container.innerHTML = `
                <div class="cupons-vazio">
                    <strong>Nenhum cupom criado ainda.</strong>
                    <p>Crie seus cupons na página de gerenciamento.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        cuponsAtuais.forEach(cupom => {
            container.appendChild(criarCardCupomCentral(cupom));
        });

    } catch (error) {
        console.error("Erro ao carregar cupons:", error);
        container.innerHTML = "<p>Erro ao carregar cupons da loja.</p>";
    }
}

function criarCardCupomCentral(cupom) {
    const card = document.createElement("article");
    card.className = "card-cupom-central";
    card.dataset.cupomId = cupom.id;

    const ativo = cupom.ativo === true;
    const publico = cupom.publico === true;
    const vencido = new Date(cupom.dataValidade) < new Date();

    const mostrarAtivar = !ativo && !vencido;
    const mostrarDesativar = ativo;

    card.innerHTML = `
        <div class="cupom-central-info">
            <div class="cupom-central-header">
                <strong>${cupom.codigo}</strong>
                <span class="tag-cupom ${vencido ? "vencido" : ativo ? "ativo" : "inativo"}">
                    ${vencido ? "Vencido" : ativo ? "Ativo" : "Inativo"}
                </span>
            </div>

            <p>${cupom.descricao || "Sem descrição cadastrada."}</p>

            <small>
                ${formatarDesconto(cupom)} • 
                ${cupom.quantidadeResgatada || 0}/${cupom.quantidadeTotal || "∞"} resgates •
                validade: ${formatarData(cupom.dataValidade)}
            </small>

            <small>
                Visibilidade: ${publico ? "Público geral" : "Privado / Envio direto"}
            </small>
        </div>

        <div class="cupom-central-acoes">
            ${
                mostrarAtivar
                    ? `<button class="btn-ativar-cupom">Ativar global</button>`
                    : ""
            }

            <button class="btn-enviar-cupom" ${vencido ? "disabled" : ""}>
                Enviar usuários
            </button>

            ${
                mostrarDesativar
                    ? `<button class="btn-desativar-cupom">Desativar</button>`
                    : ""
            }
        </div>
    `;

    return card;
}

async function ativarGlobal(idCupom) {
    try {
        await ativarCupomPublico(idCupom);
        alert("Cupom ativado para o público geral!");
        await carregarCuponsCentral();
    } catch (error) {
        alert(error.message);
    }
}

async function desativar(idCupom) {
    try {
        await desativarCupom(idCupom);
        alert("Cupom desativado!");
        await carregarCuponsCentral();
    } catch (error) {
        alert(error.message);
    }
}

function abrirEnvioUsuarios(idCupom) {
    const emailsTexto = prompt("Digite os e-mails separados por vírgula:");

    if (!emailsTexto) return;

    const emails = emailsTexto
        .split(",")
        .map(email => email.trim())
        .filter(email => email.length > 0);

    if (emails.length === 0) {
        alert("Informe ao menos um e-mail.");
        return;
    }

    enviarCupomParaUsuarios(idCupom, emails)
        .then(() => {
            alert("Cupom enviado/liberado para os usuários informados!");
            return carregarCuponsCentral();
        })
        .catch(error => alert(error.message));
}

function formatarDesconto(cupom) {
    const valor = Number(cupom.valorDesconto);

    if (cupom.tipoDesconto === "PORCENTAGEM") {
        return `${valor.toString().replace(".", ",")}% OFF`;
    }

    return `R$ ${valor.toFixed(2).replace(".", ",")} OFF`;
}

function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-BR");
}

function setTexto(root, id, texto) {
    const elemento = root.querySelector(`#${id}`);

    if (elemento) {
        elemento.textContent = texto;
    }
}