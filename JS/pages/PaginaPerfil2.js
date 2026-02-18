import { getUsuarioLogado} from "../core/auth.js";
import { listarUsuarios, deletarUsuario } from "../core/usuario.js";
import { listarLojas } from "../core/loja.js";
import { abrirModal, fecharModal } from "../components/modals.js";
import { esconderBlocos, mostrarBlocos } from "../components/visibility.js";
import { criarCardUsuario } from "../components/cards.js";
import { criarCardLoja } from "../components/cards.js";
import { configurarHeader } from "../components/header.js";
import { buscarDadosUsuario, editarDadosUsuario } from "../core/usuario.js";
import { getLojaDoUsuario, editarDadosLoja } from "../core/loja.js";

const usuario = getUsuarioLogado();
console.log("Usuário logado:", buscarDadosUsuario());
console.log("Loja do usuário:", getLojaDoUsuario(usuario));

async function configurarTela() {
    
    if (!usuario) return;

    esconderBlocos([
        "secao-usuario",
        "secao-loja",
        "secao-cotacoes",
        "secao-admin",
        "secao-pedir_loja"
    ]);

    if (usuario.tipoUsuario === "Admin") {
        mostrarBlocos(["secao-admin", "secao-usuario", "secao-loja", "secao-cotacoes", "secao-pedir_loja"]);
        await carregarUsuarios();
        await carregarLojas();
    }

    if (usuario.tipoUsuario === "Vendedor") {
        mostrarBlocos(["secao-loja", "secao-usuario", "secao-cotacoes"]);
    }

    if (usuario.tipoUsuario === "Comum") {
        mostrarBlocos(["secao-usuario", "secao-pedir_loja", "secao-cotacoes"]);
    }
}

function preencherInformacoesUsuario() {

    if (usuario) {
        document.getElementById("nomeUsuario").textContent = usuario.nome;
        document.getElementById("emailUsuario").textContent = usuario.email;
        document.getElementById("tipoUsuario").textContent = usuario.tipoUsuario;
    }
}

function preencherInformacoesLoja() {
    
    if (usuario && usuario.loja) {
        document.getElementById("nomeLoja").textContent = usuario.loja.nome;
        document.getElementById("emailLoja").textContent = usuario.loja.email;
        document.getElementById("cnpjLoja").textContent = usuario.loja.cnpj;
        document.getElementById("enderecoLoja").textContent = usuario.loja.endereco;
        document.getElementById("cepLoja").textContent = usuario.loja.cep;
    }
}

async function configurarEventos() {
    //Eventos de abertura de modais
    document.getElementById("editar-perfil").addEventListener("click", () => abrirModal("modal-editar-perfil"));
    document.getElementById("editar-loja").addEventListener("click", () => abrirModal("modal-editar-loja"));


    //Eventos de fechamento de modais
    document.getElementById("fechar-modal-perfil").addEventListener("click", () => fecharModal("modal-editar-perfil"));
    document.getElementById("fechar-modal-admin").addEventListener("click", () => fecharModal("modal-editar-usuario-admin"));
    document.getElementById("fechar-modal-loja-admin").addEventListener("click", () => fecharModal("modal-editar-loja-admin"));


    //Evento de edição de perfil e loja
    document.getElementById("edit-nome-usuario").value = usuario.nome;
    document.getElementById("edit-email-usuario").value = usuario.email;
    document.getElementById("edit-nome-loja").value = usuario.loja?.nome || "";
    document.getElementById("edit-email-loja").value = usuario.loja?.email || "";
    document.getElementById("edit-cnpj-loja").value = usuario.loja?.cnpj || "";
    document.getElementById("edit-cep-loja").value = usuario.loja?.cep || "";
    document.getElementById("edit-endereco-loja").value = usuario.loja?.endereco || "";
    
    //Eventos de submit dos formulários
    document.getElementById("form-editar-perfil").addEventListener("submit", salvarPerfil);
    document.getElementById("form-editar-loja").addEventListener("submit", salvarLoja);
    }

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
    document.getElementById("modal-editar-perfil").classList.add("hidden");
    preencherInformacoesUsuario();
}

function montarDtoLoja() {
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

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    const dadosLoja = {
        id: usuario.loja.id,
        nome: document.getElementById("edit-nome-loja").value,
        email: document.getElementById("edit-email-loja").value,
        cnpj: document.getElementById("edit-cnpj-loja").value,
        cep: document.getElementById("edit-cep-loja").value,
        endereco: document.getElementById("edit-endereco-loja").value
    };

    console.log("DTO Loja:", dadosLoja);

    const lojaAtualizada = await editarDadosLoja(dadosLoja);

    if (lojaAtualizada) {
        usuario.loja = lojaAtualizada;
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        alert("Loja atualizada com sucesso!");
        document.getElementById("modal-editar-loja").classList.add("hidden");
        preencherInformacoesLoja();
    } else {
        alert("Erro ao atualizar loja");
    }
}


async function carregarUsuarios() {
    const usuarios = await listarUsuarios();
    const container = document.getElementById("admin-usuarios");
    container.innerHTML = "";

    usuarios.forEach(usuario => {
        const card = criarCardUsuario(usuario, {
            onEditar: (u) => abrirModal("modal-editar-usuario-admin"),
            onDeletar: (id) => {
                if (confirm("Tem certeza que deseja deletar este usuário?")) {
                    deletarUsuario(id)                        .then(() => {
                            alert("Usuário deletado com sucesso!");
                            carregarUsuarios(); // Recarrega a lista de usuários após deleção
                        })
                        .catch(err => {
                            console.error("Erro ao deletar usuário:", err);
                            alert("Ocorreu um erro ao deletar o usuário. Tente novamente.");
                        }); 
                }
            }
        });

        container.appendChild(card);
    });
}

async function carregarLojas() {
    const lojas = await listarLojas();
    const container = document.getElementById("admin-lojas");
    container.innerHTML = "";

    lojas.forEach(loja => {
        const card = criarCardLoja(loja, {
            onEditar: (l) => abrirModal("modal-editar-loja-admin"),
            onDeletar: (id) => console.log("Deletar loja com ID:", id) // Implementar função de deletar loja
        });

        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", init);

async function init() {
    configurarHeader();
    configurarTela();
    configurarEventos();
    preencherInformacoesLoja();
    preencherInformacoesUsuario();
}