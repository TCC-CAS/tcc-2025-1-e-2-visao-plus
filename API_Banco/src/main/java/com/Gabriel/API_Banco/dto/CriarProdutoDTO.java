package com.Gabriel.API_Banco.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CriarProdutoDTO {
    private Long idLoja;
    private String nome;
    private BigDecimal valor;
}