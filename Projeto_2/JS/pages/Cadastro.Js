document.addEventListener("DOMContentLoaded", () => {

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

    // Função para mostrar o card por 4 segundos
    function mostrarRegrasCard() {
        regrasCard.classList.add("mostrar");

        setTimeout(() => {
            regrasCard.classList.remove("mostrar");
        }, 4000);
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

    function validarEmail(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }

    function validarNomeUsuario(nome) {
        const regexNome = /^[a-zA-Z\s]+$/;
        return regexNome.test(nome);
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
            erroSenhaDiv.textContent = "A senha não atende aos requisitos.";
            mostrarRegrasCard();
            return;
        } else {
            erroSenhaDiv.textContent = "";
        }

        if (senha !== confirmarSenha) {
            erroSenhaDiv.textContent = "As senhas não conferem!";
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