package com.Gabriel.API_Banco.model.enums;


public enum StatusCotacao {

    SOLICITADA,     // usuário criou

    NEGOCIANDO,     // loja respondeu

    APROVADA,       // usuário aprovou

    REJEITADA,      // usuário rejeitou

    CANCELADA,      // qualquer lado cancelou

    AGUARDANDO_SINAL, // esperando pagamento

    RESERVADA,      // sinal pago

    FINALIZADA      // produto retirado
}
