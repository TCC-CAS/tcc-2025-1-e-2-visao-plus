import { getUsuarioLogado} from "../core/auth.js";
import { listarUsuarios, deletarUsuario, editarDadosUsuario } from "../core/usuario.js";
import { listarLojas, editarDadosLoja, deletarLoja } from "../core/loja.js";
import { abrirModal, fecharModal } from "../components/modals.js";
import { esconderBlocos, mostrarBlocos } from "../components/visibility.js";
import { criarCardUsuario } from "../components/cards.js";
import { criarCardLoja } from "../components/cards.js";
import { configurarHeader } from "../components/header.js";
import { buscarDadosUsuario, editarDadosUsuario } from "../core/usuario.js";
import { getLojaDoUsuario, editarDadosLoja } from "../core/loja.js";

//===================================INICIALIZAÇÃO DE VARIÁVEIS PRINCIPAIS=====================================================//

let usuario = null;
let loja = null;

//===================================CONFIGURAÇÃO DA VISUALIZAÇÃO=====================================================//

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


    //Evento de edição de perfil e loja
    document.getElementById("edit-nome-usuario").value = usuario.nome;
    document.getElementById("edit-email-usuario").value = usuario.email;
    document.getElementById("edit-nome-loja").value = loja.nome;
    document.getElementById("edit-email-loja").value = loja.email;
    document.getElementById("edit-cnpj-loja").value = loja.cnpj;
    document.getElementById("edit-cep-loja").value = loja.cep;
    document.getElementById("edit-endereco-loja").value = loja.endereco;    
    
    //Eventos de submit dos formulários
    document.getElementById("form-editar-perfil").addEventListener("submit", salvarPerfil);
    document.getElementById("form-editar-loja").addEventListener("submit", salvarLoja);
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
        await atualizarUsuario(usuarioAtualizado);
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
            onDeletar: (id) => {
                if (confirm("Tem certeza que deseja deletar esta loja?")) {
                    deletarLoja(id)
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
        await atualizarLoja(lojaAtualizada);
        alert("Loja atualizada com sucesso!");
        fecharModal("modal-editar-loja-admin");
        carregarLojas();
    } catch (err) {
        console.error("Erro ao atualizar loja:", err);
        alert("Erro ao atualizar loja");
    }
});


//===================================INICIALIZADOR=====================================================//

document.addEventListener("DOMContentLoaded", init);

async function init() {
    configurarHeader();

    usuario = await getUsuarioLogado();
    console.log("Usuário logado:", usuario);

    if (!usuario) return;

    loja = await getLojaDoUsuario(usuario);
    usuario.loja = loja;

    console.log("Loja do usuário:", loja);

    await configurarTela();
    configurarEventos();
    preencherInformacoesUsuario();
    preencherInformacoesLoja();
}
