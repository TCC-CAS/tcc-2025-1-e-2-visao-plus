package com.Gabriel.API_Banco.dto;

import lombok.Data;

@Data
public class CriarProdutoDTO {
    private Long idLoja;
    private String nome;
    private Double valor;
}