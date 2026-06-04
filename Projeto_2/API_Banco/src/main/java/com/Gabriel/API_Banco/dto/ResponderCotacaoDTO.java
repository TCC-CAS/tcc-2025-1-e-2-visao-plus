package com.Gabriel.API_Banco.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ResponderCotacaoDTO {

    private BigDecimal valorFinal;
    private Integer prazoEntrega;
    private String observacaoLoja;
}
