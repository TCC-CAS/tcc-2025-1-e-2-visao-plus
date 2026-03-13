import { responderCotacao } from "../core/FluxoCotacoes.js";

function chamarEstilizacao() {

    if (document.getElementById("css-modal-cotacao")) return;

    const link = document.createElement("link");
    link.id = "css-modal-cotacao";
    link.rel = "stylesheet";
    link.href = "css/components/ModalCotacaoResposta.css";

    document.head.appendChild(link);
}

export function abrirModalCotacao(cotacao) {
    
    console.log(cotacao);
    chamarEstilizacao();
    const modal = document.createElement("div");
    modal.classList.add("modal-cotacao");

    modal.innerHTML = `
        <div class="modal-cotacao-content">

            <h3>Responder Cotação</h3>

            <div class="cotacao-info">
                <p><strong>Produto:</strong> ${cotacao.produto.nome}</p>
                <p><strong>Grau:</strong> OD ${cotacao.produto.grauDireito} | OE ${cotacao.produto.grauEsquerdo}</p>
                <p><strong>Valor Base:</strong> R$ ${cotacao.produto.valor}</p>
            </div>

            <input 
                id="valorFinal"
                type="number"
                step="0.01"
                min="0"
                placeholder="Valor final"
            />

            <input 
                id="prazoEntrega" 
                type="number" 
                placeholder="Prazo em dias"
            />

            <textarea
                id="observacaoLoja"
                placeholder="Observação da loja"
            ></textarea>

            <div class="modal-cotacao-botoes">

                <button id="btnEnviarResposta">
                    Enviar resposta
                </button>

                <button id="btnFecharModal">
                    Fechar
                </button>

            </div>

        </div>
        `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add("ativo");
    }, 10);

    // botão fechar
    modal.querySelector("#btnFecharModal").onclick = () => {

        modal.classList.remove("ativo");

        setTimeout(() => {
            modal.remove();
        }, 200);
    };

    // botão responder
    modal.querySelector("#btnEnviarResposta").onclick = async () => {

        const idLojaLogada = cotacao.loja.id;

        await responderCotacao(
            cotacao.idCotacao,
            idLojaLogada
        );

        modal.classList.remove("ativo");

        setTimeout(() => {
            modal.remove();
        }, 200);
    };
}