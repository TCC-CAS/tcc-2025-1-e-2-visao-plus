import { configurarHeader } from "../components/header2.js";
import { API } from "../core/api.js";

const nome = document.getElementById("nome");
const email = document.getElementById("email");

async function testaNome(nome) {
    const existe = await fetch(`${API}/usuarios/existe-nome`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nome)
        }
    );
}

async function testaEmail(email) {
    const existe = await fetch(`${API}/usuarios/existe-email`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(email)
        }
    );
}

async function EnviaEmail(usuario) {

    await fetch(`${API}/usuarios/recuperarSenha`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(respostaCotacao)
        }
    );

}

const form = document.getElementById("loginForm");

form.addEventListener("")








/****************************************************
 * INICIALIZADOR
 ***************************************************/
document.addEventListener("DOMContentLoaded", () => {
    configurarHeader();
});