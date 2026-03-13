import { validarEmail, validarNomeUsuario } from "../core/usuario.js";
import { configurarHeader } from "../components/header2.js";

document.addEventListener("DOMContentLoaded", () => {

    configurarHeader();

    const form = document.querySelector("#cadastroForm");

    const erroSenhaDiv = document.querySelector("#erroSenha");
    const regrasCard = document.querySelector("#regrasCard");
    const senhaInput = document.querySelector("#senha");
    const confirmarSenhaInput = document.querySelector("#confirmarSenha");

    const regraTamanho = document.querySelector("#regraTamanho");
    const regraMaiuscula = document.querySelector("#regraMaiuscula");
    const regraMinuscula = document.querySelector("#regraMinuscula");
    const regraNumero = document.querySelector("#regraNumero");
    const regraEspecial = document.querySelector("#regraEspecial");
    const regraProibido = document.querySelector("#regraProibido");

    const inputNome = document.querySelector("#nome");
    const inputEmail = document.querySelector("#email");
    const msgNome = document.querySelector("#msgNome");
    const msgEmail = document.querySelector("#msgEmail");
    const msgSenha = document.querySelector("#msgSenha");

    let timeoutNome;
    let timeoutEmail;
    let nomeDisponivel = false;
    let emailDisponivel = false;

    function mostrarMensagem(elemento, texto, tipo) {
        elemento.textContent = texto;
        elemento.classList.remove("sucesso", "erro");
        elemento.classList.add("mostrar", tipo);

        setTimeout(() => {
            elemento.classList.remove("mostrar");
        }, 7000);
    }


    inputNome.addEventListener("input", () => {
        clearTimeout(timeoutNome);

        timeoutNome = setTimeout(async () => {
            const nome = inputNome.value.trim();

            if (nome.length < 3) {
                msgNome.textContent = "";
                return;
            }

            const existe = await validarNomeUsuario(nome);

            if (existe) {
                mostrarMensagem(msgNome, "Nome já cadastrado", "erro");
                nomeDisponivel = false;
            } else {
                mostrarMensagem(msgNome, "Nome disponível", "sucesso");
                nomeDisponivel = true;
            }
        }, 600);
    });


    inputEmail.addEventListener("input", () => {
        clearTimeout(timeoutEmail);

        timeoutEmail = setTimeout(async () => {
            const email = inputEmail.value.trim();

            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
                msgEmail.textContent = "";
                return;
            }

            const existe = await validarEmail(email);

            if (existe) {
                mostrarMensagem(msgEmail, "Email já cadastrado", "erro");
                emailDisponivel = false;
            } else {
                mostrarMensagem(msgEmail, "Email disponível", "sucesso");
                emailDisponivel = true;
            }
        }, 600);
    });

    // Função para mostrar o card por 4 segundos
    function mostrarRegrasCard() {
        regrasCard.classList.add("mostrar");

        setTimeout(() => {
            regrasCard.classList.remove("mostrar");
        }, 7000);
    }

    function atualizarRegra(elemento, condicao) {
        if (condicao) {
            elemento.classList.remove("invalido");
            elemento.classList.add("valido");
        } else {
            elemento.classList.remove("valido");
            elemento.classList.add("invalido");
        }
    }

    // Função que valida a senha e retorna mensagem de erro
    function validarSenhaTempoReal() {

        const senha = senhaInput.value;

        const regexMaiuscula = /[A-Z]/;
        const regexMinuscula = /[a-z]/;
        const regexNumero = /[0-9]/;
        const regexEspecial = /[!@#$%^&*(),.?":{}|<>]/;
        const regexProibido = /[<>]/;

        const tamanhoValido = senha.length >= 8;
        const maiusculaValida = regexMaiuscula.test(senha);
        const minusculaValida = regexMinuscula.test(senha);
        const numeroValido = regexNumero.test(senha);
        const especialValido = regexEspecial.test(senha);
        const proibidoValido = !regexProibido.test(senha);

        atualizarRegra(regraTamanho, tamanhoValido);
        atualizarRegra(regraMaiuscula, maiusculaValida);
        atualizarRegra(regraMinuscula, minusculaValida);
        atualizarRegra(regraNumero, numeroValido);
        atualizarRegra(regraEspecial, especialValido);
        atualizarRegra(regraProibido, proibidoValido);

        const senhaEhValida =
            tamanhoValido &&
            maiusculaValida &&
            minusculaValida &&
            numeroValido &&
            especialValido &&
            proibidoValido;

        if (senha.length === 0) {
            senhaInput.classList.remove("senha-valida", "senha-invalida");
        } else if (senhaEhValida) {
            senhaInput.classList.remove("senha-invalida");
            senhaInput.classList.add("senha-valida");
        } else {
            senhaInput.classList.remove("senha-valida");
            senhaInput.classList.add("senha-invalida");
        }

        return senhaEhValida;
    }



    senhaInput.addEventListener("input", validarSenhaTempoReal);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.querySelector("#nome").value.trim();
        const email = document.querySelector("#email").value.trim();
        const senha = document.querySelector("#senha").value;
        const confirmarSenha = document.querySelector("#confirmarSenha").value;



        // Validação básica
        if (!nome || !email || !senha || !confirmarSenha) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // Validação da senha usando função
        const senhaValida = validarSenhaTempoReal();

        if (!senhaValida) {
            mostrarMensagem(msgSenha, "Senha não atende aos requisitos", "erro");
            mostrarRegrasCard();
            return;
        } else {
            mostrarMensagem(msgSenha, "Senha válida", "sucesso");
        }

        if (senha !== confirmarSenha) {
            mostrarMensagem(msgSenha, "As senhas não conferem!", "erro");
            return;
        }

        if (!nomeDisponivel || !emailDisponivel) {
            alert("Corrija os campos antes de continuar.");
            return;
        }

        // Criar objeto usuário
        const usuario = {
            nome: nome,
            email: email,
            senha: senha,
            tipoUsuario: "Comum"
        };

        // Enviar dados para API
        try {
            const response = await fetch("http://localhost:8080/usuarios/registrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                const mensagemErro = await response.text();
                throw new Error(mensagemErro);
            }

            const mensagem = await response.text();

            alert(mensagem); // aqui pode manter
            form.reset();
            window.location.href = "Login.html";

        } catch (error) {
            alert(error.message);
        }

    });
});