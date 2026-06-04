import { configurarHeader } from "../components/header2.js";
import { API } from "../core/api.js";

document.addEventListener("DOMContentLoaded", () => {

    configurarHeader();

    const form = document.querySelector("#loginForm");
    const msgLogin = document.querySelector("#msgLogin");
    const botaoSubmit = form.querySelector("button[type='submit']");

    function mostrarMensagem(elemento, texto, tipo) {
        elemento.textContent = texto;
        elemento.classList.remove("sucesso", "erro");
        elemento.classList.add("mostrar", tipo);

        setTimeout(() => {
            elemento.classList.remove("mostrar");
        }, 4000);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.querySelector("#nome").value.trim();
        const email = document.querySelector("#email").value.trim();

        if (!nome || !email) {
            mostrarMensagem(
                msgLogin,
                "Preencha todos os campos.",
                "erro"
            );
            return;
        }

        const dadosRecuperacao = {
            nome,
            email
        };

        try {
            botaoSubmit.classList.add("carregando");
            botaoSubmit.disabled = true;
            botaoSubmit.textContent = "Enviando...";

            const response = await fetch(`${API}/usuarios/recuperarSenha`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosRecuperacao)
            });

            if (!response.ok) {
                const mensagemErro = await response.text();

                mostrarMensagem(
                    msgLogin,
                    mensagemErro || "Erro ao recuperar senha.",
                    "erro"
                );

                return;
            }

            const mensagemSucesso = await response.text();

            mostrarMensagem(
                msgLogin,
                mensagemSucesso || "Senha temporária enviada para seu e-mail!",
                "sucesso"
            );

            setTimeout(() => {
                window.location.href = "Login.html";
            }, 3000);

        } catch (error) {
            console.error(error);

            mostrarMensagem(
                msgLogin,
                "Erro ao conectar com o servidor.",
                "erro"
            );

        } finally {
            botaoSubmit.classList.remove("carregando");
            botaoSubmit.disabled = false;
            botaoSubmit.textContent = "Recuperar Senha";
        }
    });
});