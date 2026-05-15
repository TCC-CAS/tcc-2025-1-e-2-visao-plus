package com.Gabriel.API_Banco.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CriarProdutoDTO {

    private String nome;
    private Long idLente;
    private Long idArmacao;
    private Double grauDireito;
    private Double grauEsquerdo;
    private Long idUsuario;
    private Long idLoja;
    private BigDecimal valor;
    private Integer prazoEntrega;


}