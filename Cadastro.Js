document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#cadastroForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.querySelector("#nome").value;
        const email = document.querySelector("#email").value;
        const senha = document.querySelector("#senha").value;
        const confirmarSenha = document.querySelector("#confirmarSenha").value;


        //Validações de nome e email
        if (!nome || !email) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Validações de senha
        if (senha.length < 8) {
            alert("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        const regexMaiuscula = /[A-Z]/;
        const regexMinuscula = /[a-z]/;
        const regexNumero = /[0-9]/;
        const regexEspecial = /[!@#$%^&*(),.?\":{}|<>]/;
        const regexProibido = /[<>]/;

        if (
            !regexMaiuscula.test(senha) ||
            !regexMinuscula.test(senha) ||
            !regexNumero.test(senha) ||
            !regexEspecial.test(senha)
        ) {
            alert("A senha deve ter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial!");
            return;
        }

        if (regexProibido.test(senha)) {
            alert("A senha contém caracteres proibidos!");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não conferem!");
            return;
        }

        // Criar objeto usuário
        const usuario = {
            nome: nome,
            email: email,
            senha: senha,
            tipo_usuario: "Comum"
        };


        // Enviar dados para a API
        try {
            const response = await fetch("http://localhost:8080/usuarios/registrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar usuário");
            }

            const mensagem = await response.text();
            alert(mensagem);

            form.reset();

        } catch (error) {
            console.error(error);
            alert("Erro ao conectar com a API");
        }
    });
});
