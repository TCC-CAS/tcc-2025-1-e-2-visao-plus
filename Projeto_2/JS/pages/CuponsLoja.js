import { configurarHeader } from "../components/header.js";
import { getUsuarioLogado } from "../core/auth.js";
import {
    listarCuponsDaLoja,
    criarCupom,
    editarCupom,
    ativarCupomPublico,
    desativarCupom,
    deletarCupom,
    enviarCupomParaUsuarios
} from "../core/cupons.js";

let usuarioLogado = null;
let lojaAtual = null;
let cupons = [];

document.addEventListener("DOMContentLoaded", async () => {
    configurarHeader();

    usuarioLogado = getUsuarioLogado();

    if (!usuarioLogado || !usuarioLogado.loja) {
        alert("Você precisa estar logado como loja.");
        window.location.href = "Login.html";
        return;
    }

    lojaAtual = usuarioLogado.loja;

    configurarEventos();

    const btnMinhaLoja = document.getElementById("MinhaLoja");
    if (btnMinhaLoja) {
        btnMinhaLoja.addEventListener("click", () => {
            window.location.href = `PaginaLoja.html?id=${lojaAtual.id}`;
        });
    }

    if ((lojaAtual.plano || "FREE") === "FREE") {
        document.getElementById("bloqueio-cupons-pagina")?.classList.remove("hidden");
        document.getElementById("resumo-cupons-loja")?.classList.add("hidden");
        document.getElementById("lista-cupons-loja")?.classList.add("hidden");
        document.getElementById("btn-abrir-modal-cupom")?.classList.add("hidden");
        return;
    }

    await carregarCupons();
});

function configurarEventos() {
    document.getElementById("btn-abrir-modal-cupom")?.addEventListener("click", abrirModalCriacao);

    document.getElementById("btn-fechar-modal-cupom")?.addEventListener("click", fecharModalCupom);
    document.getElementById("btn-cancelar-modal-cupom")?.addEventListener("click", fecharModalCupom);

    document.getElementById("btn-fechar-modal-envio")?.addEventListener("click", fecharModalEnvio);
    document.getElementById("btn-cancelar-envio-cupom")?.addEventListener("click", fecharModalEnvio);
    document.getElementById("btn-confirmar-envio-cupom")?.addEventListener("click", confirmarEnvioUsuarios);

    document.getElementById("form-cupom")?.addEventListener("submit", salvarCupom);

    document.getElementById("cupom-tipo")?.addEventListener("change", atualizarMascaraValor);
    document.getElementById("cupom-valor")?.addEventListener("input", mascararValorCupom);

    document.addEventListener("click", async (event) => {
        const botao = event.target;
        const card = botao.closest("[data-cupom-id]");

        if (!card) return;

        const idCupom = Number(card.dataset.cupomId);

        if (botao.classList.contains("btn-editar")) {
            const cupom = cupons.find(c => c.id === idCupom);
            abrirModalEdicao(cupom);
        }

        if (botao.classList.contains("btn-ativar")) {
            await executarAcao(() => ativarCupomPublico(idCupom), "Cupom ativado globalmente!");
        }

        if (botao.classList.contains("btn-desativar")) {
            await executarAcao(() => desativarCupom(idCupom), "Cupom desativado!");
        }

        if (botao.classList.contains("btn-excluir")) {
            if (confirm("Deseja excluir este cupom? Ele não aparecerá mais para a loja.")) {
                await executarAcao(() => deletarCupom(idCupom), "Cupom excluído!");
            }
        }

        if (botao.classList.contains("btn-enviar")) {
            abrirModalEnvio(idCupom);
        }
    });
}

async function carregarCupons() {
    const container = document.getElementById("lista-cupons-loja");

    if (!container) return;

    container.innerHTML = "<p>Carregando cupons...</p>";

    try {
        cupons = await listarCuponsDaLoja(lojaAtual.id);

        atualizarResumoPagina();

        if (!cupons || cupons.length === 0) {
            container.innerHTML = `
                <div class="cupons-vazio">
                    <strong>Nenhum cupom cadastrado ainda.</strong>
                    <p>Crie sua primeira campanha promocional para aparecer na página da loja.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        cupons.forEach(cupom => {
            container.appendChild(criarCardCupom(cupom));
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Erro ao carregar cupons.</p>";
    }
}

function atualizarResumoPagina() {
    const total = cupons.length;
    const ativos = cupons.filter(c => c.ativo === true).length;
    const resgates = cupons.reduce((acc, c) => acc + Number(c.quantidadeResgatada || 0), 0);

    setTexto("cupom-page-total", total);
    setTexto("cupom-page-ativos", ativos);
    setTexto("cupom-page-resgates", resgates);
}

function criarCardCupom(cupom) {
    const card = document.createElement("article");
    card.className = "card-cupom-loja";
    card.dataset.cupomId = cupom.id;

    const vencido = new Date(cupom.dataValidade) < new Date();
    const ativo = cupom.ativo === true;
    const publico = cupom.publico === true;

    const classeTag = vencido ? "vencido" : ativo ? "ativo" : "inativo";
    const textoTag = vencido ? "Vencido" : ativo ? "Ativo" : "Inativo";

    card.innerHTML = `
        <div class="cupom-card-topo">
            <div class="cupom-codigo-box">
                <strong>${cupom.codigo}</strong>
                <p>${cupom.descricao || "Sem descrição cadastrada."}</p>
            </div>

            <span class="tag-cupom ${classeTag}">${textoTag}</span>
        </div>

        <div class="cupom-destaque">
            <span>Desconto configurado</span>
            <strong>${formatarDesconto(cupom)}</strong>
        </div>

        <div class="cupom-card-dados">
            <span><b>Validade</b> ${formatarDataHora(cupom.dataValidade)}</span>
            <span><b>Resgates</b> ${cupom.quantidadeResgatada || 0}/${cupom.quantidadeTotal || "∞"}</span>
            <span><b>Usados</b> ${cupom.quantidadeUsada || 0}</span>
            <span><b>Visibilidade</b> ${publico ? "Público geral" : "Privado / Envio direto"}</span>
        </div>

        <div class="cupom-card-acoes">
            <button class="btn-editar">Editar</button>
            <button class="btn-ativar" ${vencido ? "disabled" : ""}>Ativar global</button>
            <button class="btn-enviar" ${vencido ? "disabled" : ""}>Enviar usuários</button>
            <button class="btn-desativar">Desativar</button>
            <button class="btn-excluir">Excluir</button>
        </div>
    `;

    return card;
}

async function salvarCupom(event) {
    event.preventDefault();

    const idCupom = document.getElementById("cupom-id").value;
    const tipo = document.getElementById("cupom-tipo").value;
    const valorTexto = document.getElementById("cupom-valor").value;
    const valorConvertido = converterNumeroPtBr(valorTexto);

    if (tipo === "PORCENTAGEM" && valorConvertido > 100) {
        alert("Cupom em porcentagem não pode passar de 100%.");
        return;
    }

    const dados = {
        idLoja: lojaAtual.id,
        codigo: document.getElementById("cupom-codigo").value.trim().toUpperCase(),
        descricao: document.getElementById("cupom-descricao").value.trim(),
        tipoDesconto: tipo,
        valorDesconto: valorConvertido,
        dataValidade: document.getElementById("cupom-validade").value,
        quantidadeTotal: document.getElementById("cupom-quantidade").value
            ? Number(document.getElementById("cupom-quantidade").value)
            : null
    };

    try {
        if (idCupom) {
            await editarCupom(idCupom, dados);
            alert("Cupom atualizado!");
        } else {
            await criarCupom(dados);
            alert("Cupom criado!");
        }

        fecharModalCupom();
        await carregarCupons();

    } catch (error) {
        alert(error.message);
    }
}

function abrirModalCriacao() {
    document.getElementById("titulo-modal-cupom").textContent = "Criar cupom";
    document.getElementById("form-cupom").reset();
    document.getElementById("cupom-id").value = "";
    document.getElementById("cupom-tipo").value = "PORCENTAGEM";
    atualizarMascaraValor();
    abrirModal("modal-cupom");
}

function abrirModalEdicao(cupom) {
    if (!cupom) return;

    document.getElementById("titulo-modal-cupom").textContent = "Editar cupom";

    document.getElementById("cupom-id").value = cupom.id;
    document.getElementById("cupom-codigo").value = cupom.codigo;
    document.getElementById("cupom-descricao").value = cupom.descricao || "";
    document.getElementById("cupom-tipo").value = cupom.tipoDesconto;
    document.getElementById("cupom-valor").value = formatarNumeroPtBr(cupom.valorDesconto);
    document.getElementById("cupom-validade").value = converterParaInputDateTime(cupom.dataValidade);
    document.getElementById("cupom-quantidade").value = cupom.quantidadeTotal || "";

    atualizarMascaraValor();
    abrirModal("modal-cupom");
}

function abrirModalEnvio(idCupom) {
    document.getElementById("envio-cupom-id").value = idCupom;
    document.getElementById("emails-cupom-envio").value = "";
    abrirModal("modal-enviar-cupom");
}

async function confirmarEnvioUsuarios() {
    const idCupom = Number(document.getElementById("envio-cupom-id").value);
    const textoEmails = document.getElementById("emails-cupom-envio").value;

    const emails = textoEmails
        .split(",")
        .map(email => email.trim())
        .filter(email => email.length > 0);

    if (emails.length === 0) {
        alert("Informe pelo menos um e-mail.");
        return;
    }

    await executarAcao(
        () => enviarCupomParaUsuarios(idCupom, emails),
        "Cupom enviado para os usuários informados!"
    );

    fecharModalEnvio();
}

async function executarAcao(acao, mensagemSucesso) {
    try {
        await acao();
        alert(mensagemSucesso);
        await carregarCupons();
    } catch (error) {
        alert(error.message);
    }
}

function atualizarMascaraValor() {
    const tipo = document.getElementById("cupom-tipo").value;
    const label = document.getElementById("label-valor-cupom");
    const prefixo = document.getElementById("prefixo-valor-cupom");
    const sufixo = document.getElementById("sufixo-valor-cupom");
    const ajuda = document.getElementById("ajuda-valor-cupom");
    const input = document.getElementById("cupom-valor");

    if (tipo === "PORCENTAGEM") {
        label.textContent = "Percentual de desconto";
        prefixo.classList.add("hidden");
        sufixo.classList.remove("hidden");
        ajuda.textContent = "Digite o percentual com vírgula se precisar. Ex: 10,5%";
        input.placeholder = "Ex: 15,5";
    } else {
        label.textContent = "Valor do desconto";
        prefixo.classList.remove("hidden");
        sufixo.classList.add("hidden");
        ajuda.textContent = "Digite o valor em reais. Ex: 25,90";
        input.placeholder = "Ex: 25,90";
    }
}

function mascararValorCupom(event) {
    let valor = event.target.value;

    valor = valor.replace(/[^\d,\.]/g, "");
    valor = valor.replace(".", ",");

    const partes = valor.split(",");

    if (partes.length > 2) {
        valor = `${partes[0]},${partes.slice(1).join("")}`;
    }

    event.target.value = valor;
}

function abrirModal(id) {
    document.getElementById(id)?.classList.add("ativo");
}

function fecharModalCupom() {
    document.getElementById("modal-cupom")?.classList.remove("ativo");
}

function fecharModalEnvio() {
    document.getElementById("modal-enviar-cupom")?.classList.remove("ativo");
}

function converterNumeroPtBr(valor) {
    if (!valor) return 0;

    return Number(
        String(valor)
            .replace(/\./g, "")
            .replace(",", ".")
    );
}

function formatarNumeroPtBr(valor) {
    if (valor === null || valor === undefined) return "";

    return Number(valor).toString().replace(".", ",");
}

function formatarDesconto(cupom) {
    const valor = formatarNumeroPtBr(cupom.valorDesconto);

    if (cupom.tipoDesconto === "PORCENTAGEM") {
        return `${valor}% OFF`;
    }

    return `R$ ${Number(cupom.valorDesconto).toFixed(2).replace(".", ",")} OFF`;
}

function formatarDataHora(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function converterParaInputDateTime(data) {
    if (!data) return "";

    const d = new Date(data);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);

    return local.toISOString().slice(0, 16);
}

function setTexto(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
}