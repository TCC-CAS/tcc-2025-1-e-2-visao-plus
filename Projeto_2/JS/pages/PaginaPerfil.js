import { getUsuarioLogado } from "../core/auth.js";
import { listarUsuarios, deletarUsuario, editarDadosUsuario } from "../core/usuario.js";
import { listarLojas, editarDadosLoja, deletarLoja } from "../core/loja.js";
import { abrirModal, fecharModal } from "../components/modals.js";
import { esconderBlocos, mostrarBlocos } from "../components/visibility.js";
import { criarCardUsuario } from "../components/cards.js";
import { criarCardLoja } from "../components/cards.js";
import { configurarHeader } from "../components/header.js";
import { getLojaDoUsuario } from "../core/loja.js";
import { carregarFotoUsuario, salvarFotoPerfil, carregarFotoLoja, salvarFotoLoja } from "../core/imgs.js";
import {
    listarCotacoesPorUsuario,
    criarCardCotacao,
    chamarEstilizacao,
    initScrollCotacoes
} from "../core/cotacoes.js";

import { abrirModalCotacaoConsumidor } from "../components/ModalCotacaoConsumidor.js";
import { buscarSolicitacaoLojaPorUsuario } from "../core/solicitacaoLoja.js";

//===================================INICIALIZAÇÃO DE VARIÁVEIS PRINCIPAIS=====================================================//

let usuario = null;
let loja = null;

//===================================CONFIGURAÇÃO DA VISUALIZAÇÃO=====================================================//

async function configurarTela() {
    if (!usuario) return;

    esconderBlocos([
        "secao-usuario",
        "secao-loja",
        "secao-cotacoes-consumidor",
        "secao-cotacoes-vendedor",
        "secao-admin",
        "secao-pedir_loja"
    ]);

    if (usuario.tipoUsuario === "Admin") {
        mostrarBlocos([
            "secao-admin",
            "secao-usuario",
            "secao-loja"
        ]);

        await carregarUsuarios();
        await carregarLojas();
        return;
    }

    if (usuario.tipoUsuario === "Vendedor") {
        mostrarBlocos([
            "secao-loja",
            "secao-usuario",
            "secao-cotacoes-vendedor"
        ]);
        return;
    }

    if (usuario.tipoUsuario === "Comum") {
        mostrarBlocos([
            "secao-usuario",
            "secao-pedir_loja",
            "secao-cotacoes-consumidor"
        ]);
    }
}

//===================================DADOS LOJA E USUÁRIO=====================================================//

function preencherInformacoesUsuario() {

    if (usuario) {
        document.getElementById("nomeUsuario").textContent = usuario.nome;
        document.getElementById("emailUsuario").textContent = usuario.email;
        document.getElementById("tipoUsuario").textContent = usuario.tipoUsuario;
    }
}

function preencherInformacoesLoja() {

    if (usuario && loja) {
        document.getElementById("nomeLoja").textContent = loja.nome;
        document.getElementById("emailLoja").textContent = loja.email;
        document.getElementById("cnpjLoja").textContent = loja.cnpj;
        document.getElementById("enderecoLoja").textContent = loja.endereco;
        document.getElementById("cepLoja").textContent = loja.cep;
    }
}

async function carregarSolicitacaoLojaDoUsuario() {
    if (!usuario || usuario.tipoUsuario !== "Comum") return;

    const boxSemSolicitacao = document.getElementById("box-sem-solicitacao");
    const boxSolicitacaoPendente = document.getElementById("box-solicitacao-pendente");

    if (!boxSemSolicitacao || !boxSolicitacaoPendente) return;

    const solicitacao = await buscarSolicitacaoLojaPorUsuario(usuario.id);

    if (!solicitacao) {
        boxSemSolicitacao.classList.remove("hidden");
        boxSolicitacaoPendente.classList.add("hidden");
        return;
    }

    boxSemSolicitacao.classList.add("hidden");
    boxSolicitacaoPendente.classList.remove("hidden");

    document.getElementById("minha-solicitacao-nome").textContent = solicitacao.nome || "-";
    document.getElementById("minha-solicitacao-cnpj").textContent = solicitacao.cnpj || "-";
    document.getElementById("minha-solicitacao-email").textContent = solicitacao.email || "-";
    document.getElementById("minha-solicitacao-cep").textContent = solicitacao.cep || "-";
    document.getElementById("minha-solicitacao-endereco").textContent = solicitacao.endereco || "-";
}

//===================================EVENTOS DE COMPONENTES=====================================================//

async function configurarEventos() {
    //Eventos de abertura de modais
    document.getElementById("editar-perfil").addEventListener("click", () => abrirModal("modal-editar-perfil"));
    document.getElementById("editar-loja").addEventListener("click", () => abrirModal("modal-editar-loja"));


    //Eventos de fechamento de modais
    document.getElementById("fechar-modal-perfil").addEventListener("click", () => fecharModal("modal-editar-perfil"));
    document.getElementById("fechar-modal-loja").addEventListener("click", () => fecharModal("modal-editar-loja"));
    document.getElementById("fechar-modal-admin").addEventListener("click", () => fecharModal("modal-editar-usuario-admin"));
    document.getElementById("fechar-modal-loja-admin").addEventListener("click", () => fecharModal("modal-editar-loja-admin"));

    const btnAbrirSenha = document.getElementById("abrir-modal-senha");
    const btnFecharSenha = document.getElementById("fechar-modal-senha");
    const btnVoltarPerfil = document.getElementById("voltar-modal-perfil");

    if (btnAbrirSenha) {
        btnAbrirSenha.addEventListener("click", () => {
            fecharModal("modal-editar-perfil");
            abrirModal("modal-editar-senha");
        });
    }

    if (btnFecharSenha) {
        btnFecharSenha.addEventListener("click", () => fecharModal("modal-editar-senha"));
    }

    if (btnVoltarPerfil) {
        btnVoltarPerfil.addEventListener("click", () => {
            fecharModal("modal-editar-senha");
            abrirModal("modal-editar-perfil");
        });
    }

    document.getElementById("form-editar-senha").addEventListener("submit", salvarSenha);


    //Evento de edição de perfil e loja
    document.getElementById("edit-nome-usuario").value = usuario.nome;
    document.getElementById("edit-email-usuario").value = usuario.email;

    if (loja) {
        document.getElementById("edit-nome-loja").value = loja.nome;
        document.getElementById("edit-email-loja").value = loja.email;
        document.getElementById("edit-cnpj-loja").value = loja.cnpj;
        document.getElementById("edit-cep-loja").value = loja.cep;
        document.getElementById("edit-endereco-loja").value = loja.endereco;
    }

    //Eventos de submit dos formulários
    document.getElementById("form-editar-perfil").addEventListener("submit", salvarPerfil);
    if (loja) {
        document.getElementById("form-editar-loja").addEventListener("submit", salvarLoja);
    }
}

function mostrarMensagemSenhaPerfil(texto, tipo) {
    const msg = document.getElementById("msgSenhaPerfil");

    msg.textContent = texto;
    msg.classList.remove("sucesso", "erro");
    msg.classList.add(tipo);
}

function validarNovaSenha(senha) {
    const temTamanho = senha.length >= 8;
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    const semProibido = !/[<>]/.test(senha);

    return temTamanho && temMaiuscula && temMinuscula && temNumero && temEspecial && semProibido;
}

async function salvarSenha(e) {
    e.preventDefault();

    const senhaAtual = document.getElementById("senha-atual").value;
    const confirmarSenhaAtual = document.getElementById("confirmar-senha-atual").value;
    const novaSenha = document.getElementById("nova-senha").value;
    const confirmarNovaSenha = document.getElementById("confirmar-nova-senha").value;

    if (!senhaAtual || !confirmarSenhaAtual || !novaSenha || !confirmarNovaSenha) {
        mostrarMensagemSenhaPerfil("Preencha todos os campos.", "erro");
        return;
    }

    if (senhaAtual !== confirmarSenhaAtual) {
        mostrarMensagemSenhaPerfil("A confirmação da senha atual não confere.", "erro");
        return;
    }

    if (novaSenha !== confirmarNovaSenha) {
        mostrarMensagemSenhaPerfil("A confirmação da nova senha não confere.", "erro");
        return;
    }

    if (!validarNovaSenha(novaSenha)) {
        mostrarMensagemSenhaPerfil(
            "A nova senha deve ter 8 caracteres, maiúscula, minúscula, número e caractere especial.",
            "erro"
        );
        return;
    }

    const dto = {
        idUsuario: usuario.id,
        senhaAtual,
        novaSenha
    };

    try {
        const response = await fetch("https://tccvisionplus-production.up.railway.app/usuarios/alterarSenha", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (!response.ok) {
            const erro = await response.text();
            mostrarMensagemSenhaPerfil(erro || "Erro ao alterar senha.", "erro");
            return;
        }

        mostrarMensagemSenhaPerfil("Senha alterada com sucesso!", "sucesso");

        document.getElementById("form-editar-senha").reset();

        setTimeout(() => {
            fecharModal("modal-editar-senha");
            abrirModal("modal-editar-perfil");
        }, 1500);

    } catch (error) {
        console.error(error);
        mostrarMensagemSenhaPerfil("Erro ao conectar com o servidor.", "erro");
    }
}

//===================================EDIÇÃO DO USUÁRIO=====================================================//

function montarDtoUsuario() {
    return {
        id: usuario.id,
        nome: document.getElementById("edit-nome-usuario").value,
        email: document.getElementById("edit-email-usuario").value
    };
}

async function salvarPerfil(e) {
    e.preventDefault();

    const dadosUsuario = montarDtoUsuario();

    console.log("DTO Perfil:", dadosUsuario);

    const usuarioAtualizado = await editarDadosUsuario(dadosUsuario);

    if (!usuarioAtualizado) {
        alert("Erro ao atualizar perfil.");
        return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
    alert("Perfil atualizado com sucesso!");
    fecharModal("modal-editar-perfil");
    preencherInformacoesUsuario();
}

//===================================EDIÇÃO DA LOJA=====================================================//

function montarDtoLoja() {

    if (!loja) return null;

    return {
        id: usuario.loja.id,
        nome: document.getElementById("edit-nome-loja").value,
        email: document.getElementById("edit-email-loja").value,
        cnpj: document.getElementById("edit-cnpj-loja").value,
        cep: document.getElementById("edit-cep-loja").value,
        endereco: document.getElementById("edit-endereco-loja").value
    };
}

async function salvarLoja(e) {
    e.preventDefault();

    const dadosLoja = montarDtoLoja();

    console.log("DTO Loja:", dadosLoja);

    const lojaAtualizada = await editarDadosLoja(dadosLoja);

    if (lojaAtualizada) {

        usuario.loja = lojaAtualizada;
        loja = lojaAtualizada;

        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        localStorage.setItem("lojaAtual", JSON.stringify(lojaAtualizada));
        alert("Loja atualizada com sucesso!");
        fecharModal("modal-editar-loja");
        preencherInformacoesLoja();
    } else {
        alert("Erro ao atualizar loja");
    }
}
//===================================ADMIN DE USUÁRIOS=====================================================//

async function preencherFormularioEditarUsuarioAdmin(usuario) {
    document.getElementById("admin-id-usuario").value = usuario.id;
    document.getElementById("admin-nome-usuario").value = usuario.nome;
    document.getElementById("admin-email-usuario").value = usuario.email;
    document.getElementById("admin-tipo-usuario").value = usuario.tipoUsuario;
}

async function carregarUsuarios() {
    const usuarios = await listarUsuarios();
    const container = document.getElementById("admin-usuarios");
    container.innerHTML = "";

    usuarios.forEach(usuario => {
        const card = criarCardUsuario(usuario, {
            onEditar: (u) => {
                abrirModal("modal-editar-usuario-admin");
                preencherFormularioEditarUsuarioAdmin(u);
            },
            onDeletar: (id) => { deletarUsuario(id) }
        });

        container.appendChild(card);
    });
}

document
    .getElementById("form-editar-usuario-admin")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuarioAtualizado = {
            id: document.getElementById("admin-id-usuario").value,
            nome: document.getElementById("admin-nome-usuario").value,
            email: document.getElementById("admin-email-usuario").value,
            tipoUsuario: document.getElementById("admin-tipo-usuario").value
        };

        try {
            await editarDadosUsuario(usuarioAtualizado);
            alert("Usuário atualizado com sucesso!");
            fecharModal("modal-editar-usuario-admin");
            carregarUsuarios();
        } catch (err) {
            console.error("Erro ao atualizar usuário:", err);
            alert("Erro ao atualizar usuário");
        }
    });


//===================================ADMIN DE LOJAS=====================================================//

async function preencherFormularioEditarLojaAdmin(loja) {
    document.getElementById("admin-id-loja").value = loja.id;
    document.getElementById("admin-nome-loja").value = loja.nome;
    document.getElementById("admin-email-loja").value = loja.email;
    document.getElementById("admin-cnpj-loja").value = loja.cnpj;
    document.getElementById("admin-cep-loja").value = loja.cep;
    document.getElementById("admin-endereco-loja").value = loja.endereco;
}

async function carregarLojas() {
    const lojas = await listarLojas();
    const container = document.getElementById("lista-lojas");
    container.innerHTML = "";

    lojas.forEach(loja => {
        const card = criarCardLoja(loja, {
            onEditar: (l) => {
                abrirModal("modal-editar-loja-admin");
                preencherFormularioEditarLojaAdmin(l);
            },
            onDeletar: () => {
                if (confirm("Tem certeza que deseja deletar esta loja?")) {
                    deletarLoja(loja.id)
                        .then(() => {
                            alert("Loja deletada com sucesso!");
                            carregarLojas(); // Recarrega a lista de lojas após deleção
                        })
                        .catch(err => {
                            console.error("Erro ao deletar loja:", err);
                            alert("Ocorreu um erro ao deletar a loja. Tente novamente.");
                        });
                }
            }
        });

        container.appendChild(card);
    });
}

document
    .getElementById("form-editar-loja-admin")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const lojaAtualizada = {
            id: document.getElementById("admin-id-loja").value,
            nome: document.getElementById("admin-nome-loja").value,
            email: document.getElementById("admin-email-loja").value,
            cnpj: document.getElementById("admin-cnpj-loja").value,
            cep: document.getElementById("admin-cep-loja").value,
            endereco: document.getElementById("admin-endereco-loja").value
        };

        try {
            await editarDadosLoja(lojaAtualizada);
            alert("Loja atualizada com sucesso!");
            fecharModal("modal-editar-loja-admin");
            carregarLojas();
        } catch (err) {
            console.error("Erro ao atualizar loja:", err);
            alert("Erro ao atualizar loja");
        }
    });

//===================================COTAÇÕES=====================================================//

async function carregarCotacoesConsumidor(idUsuario) {
    const container = document.getElementById("lista-cotacoes");

    if (!container) return;

    container.innerHTML = "";

    if (!usuario || usuario.tipoUsuario !== "Comum") {
        return;
    }

    try {
        const cotacoes = await listarCotacoesPorUsuario(idUsuario);

        if (!cotacoes || cotacoes.length === 0) {
            container.innerHTML = "<p>Nenhuma cotação encontrada.</p>";
            return;
        }

        cotacoes.forEach(cotacao => {
            const card = criarCardCotacao(cotacao, () => {
                abrirModalCotacaoConsumidor(cotacao, (cotacaoAtualizada) => {
                    Object.assign(cotacao, cotacaoAtualizada);
                    carregarCotacoesConsumidor(usuario.id);
                });
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao carregar cotações do consumidor:", error);
        container.innerHTML = "<p>Erro ao carregar suas cotações.</p>";
    }
}


//===================================INICIALIZADOR=====================================================//

document.addEventListener("DOMContentLoaded", init);

async function init() {
    usuario = await getUsuarioLogado();

    if (!usuario) return;

    if (usuario.tipoUsuario === "Vendedor" || usuario.tipoUsuario === "Admin") {
        loja = await getLojaDoUsuario(usuario);
        usuario.loja = loja;

        carregarFotoLoja(usuario);
        salvarFotoLoja();
    }

    configurarHeader();

    await configurarTela();
    await carregarSolicitacaoLojaDoUsuario();

    configurarEventos();

    preencherInformacoesUsuario();
    preencherInformacoesLoja();

    carregarFotoUsuario(usuario);
    salvarFotoPerfil();

    if (usuario.tipoUsuario === "Comum") {
        chamarEstilizacao();
        initScrollCotacoes();
        await carregarCotacoesConsumidor(usuario.id);
    }
}