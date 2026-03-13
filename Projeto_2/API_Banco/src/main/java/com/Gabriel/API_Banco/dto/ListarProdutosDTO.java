package com.Gabriel.API_Banco.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListarProdutosDTO {

    private String nome;
    private Long idLente;
    private Long idArmacao;
    private Double grauDireito;
    private Double grauEsquerdo;
    private BigDecimal valor;
    private Integer prazoEntrega;
}