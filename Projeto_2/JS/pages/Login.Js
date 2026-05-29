import { configurarHeader } from "../components/header2.js";
import { iniciarRotacaoGifs } from "../components/authVisual.js";

document.addEventListener("DOMContentLoaded", () => {

    configurarHeader();
    iniciarRotacaoGifs();

    const form = document.querySelector("#loginForm");
    const msgLogin = document.querySelector("#msgLogin");
    const btnSubmit = form.querySelector("button[type='submit']");

    let processando = false;
    let loginSucesso = false;

    function mostrarMensagem(elemento, texto, tipo) {
        elemento.textContent = texto;
        elemento.classList.remove("sucesso", "erro");
        elemento.classList.add("mostrar", tipo);

        setTimeout(() => {
            elemento.classList.remove("mostrar");
        }, 4000);
    }

    function redirecionarPorTipo(usuarioBackend) {
        if (usuarioBackend.tipoUsuario === "Comum") {
            window.location.href = "PaginaPrincipal.html";
            return;
        }

        if (usuarioBackend.tipoUsuario === "Vendedor") {
            window.location.href = "CentralLoja.html";
            return;
        }

        if (usuarioBackend.tipoUsuario === "Admin") {
            window.location.href = "PaginaPerfil.html";
            return;
        }

        window.location.href = "PaginaPrincipal.html";
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (processando) return;

        const nome = document.querySelector("#nome").value.trim();
        const email = document.querySelector("#email").value.trim();
        const senha = document.querySelector("#senha").value;

        if (!nome || !email || !senha) {
            mostrarMensagem(msgLogin, "Preencha todos os campos.", "erro");
            return;
        }

        const usuarioLogin = { nome, email, senha };

        try {
            processando = true;
            loginSucesso = false;

            btnSubmit.classList.add("carregando");
            btnSubmit.disabled = true;
            btnSubmit.textContent = "Entrando...";

            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuarioLogin)
            });

            if (!response.ok) {
                const mensagemErro = await response.text();
                mostrarMensagem(msgLogin, mensagemErro || "Dados de login inválidos.", "erro");
                return;
            }

            const usuarioBackend = await response.json();

            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioBackend));

            loginSucesso = true;

            btnSubmit.textContent = "Redirecionando...";

            mostrarMensagem(
                msgLogin,
                "Login bem-sucedido! Redirecionando...",
                "sucesso"
            );

            setTimeout(() => {
                redirecionarPorTipo(usuarioBackend);
            }, 1500);

        } catch (error) {
            console.error(error);

            mostrarMensagem(
                msgLogin,
                "Erro ao conectar com o servidor.",
                "erro"
            );

        } finally {
            if (!loginSucesso) {
                processando = false;
                btnSubmit.classList.remove("carregando");
                btnSubmit.disabled = false;
                btnSubmit.textContent = "Login";
            }
        }
    });
});