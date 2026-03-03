import { API } from "../core/api.js";
import { getUsuarioLogado } from "../core/auth.js";

//====================================ELEMENTOS FOTO PERFIL========================================//

const form = document.getElementById("form-foto-perfil");
const inputFoto = document.getElementById("inputFoto");
const imgFoto = document.getElementById("fotoPerfil");

export function salvarFotoPerfil() {

    if (!form) return; // evita erro se não existir na página

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = getUsuarioLogado();
        const usuarioId = usuario.id;

        const file = inputFoto.files[0];

        if (!file) {
            alert("Selecione uma imagem!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                `${API}/usuarios/setarFotoPerfil/${usuarioId}`,
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao enviar imagem");
            }

            const imageUrl = await response.text();

            // Atualiza imagem na tela
            imgFoto.src = imageUrl;

            //Atualiza localStorage
            usuario.fotoUrl = imageUrl;
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            alert("Foto atualizada com sucesso!");

        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar foto");
        }
    });
}


export function carregarFotoUsuario(usuario) {
    console.log("FotoUrl recebida:", usuario.fotoUrl);
    if (!imgFoto) return;

    if (usuario?.fotoUrl && usuario.fotoUrl.trim() !== "") {
        imgFoto.src = usuario.fotoUrl;
        console.log("FotoUrl recebida:", usuario.fotoUrl);
    } else {
        imgFoto.src = "imgs/9742847.png";
    }
}

//====================================ELEMENTOS FOTO LOJA========================================//

const formLoja = document.getElementById("form-foto-loja");
const inputFotoLoja = document.getElementById("inputFotoLoja");
const imgFotoLoja = document.getElementById("fotoLoja");

export function salvarFotoLoja() {

    if (!formLoja) return; // evita erro se não existir na página

    formLoja.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = getUsuarioLogado();
        const usuarioId = usuario.id;

        const file = inputFotoLoja.files[0];

        if (!file) {
            alert("Selecione uma imagem!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                `${API}/usuarios/setarFotoPerfil/${usuarioId}`,
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao enviar imagem");
            }

            const imageUrl = await response.text();

            // Atualiza imagem na tela
            imgFotoLoja.src = imageUrl;

            //Atualiza localStorage
            usuario.loja.fotoUrl = imageUrl;
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            alert("Foto atualizada com sucesso!");

        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar foto");
        }
    });
}

export function carregarFotoLoja(usuario) {

    console.log("FotoUrl Loja recebida:", usuario.loja.fotoUrl);
    if (!imgFotoLoja) return;

    if (usuario?.loja?.fotoUrl && usuario.loja.fotoUrl.trim() !== "") {
        imgFotoLoja.src = usuario.loja.fotoUrl;
        console.log("FotoUrl Loja recebida:", usuario.loja.fotoUrl);
    } else {
        imgFotoLoja.src = "imgs/9742847.png";
    }
}
    if (!form) return; // evita erro se não existir na página

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = getUsuarioLogado();
        const usuarioId = usuario.id;

        const file = inputFoto.files[0];

        if (!file) {
            alert("Selecione uma imagem!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                `${API}/usuarios/setarFotoPerfil/${usuarioId}`,
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao enviar imagem");
            }

            const imageUrl = await response.text();

            // Atualiza imagem na tela
            imgFoto.src = imageUrl;

            //Atualiza localStorage
            usuario.fotoUrl = imageUrl;
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            alert("Foto atualizada com sucesso!");

        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar foto");
        }
    });
}

export function carregarFotoLoja(usuario) {

    console.log("FotoUrl Loja recebida:", usuario.loja.fotoUrl);
}