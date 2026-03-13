package com.Gabriel.API_Banco.dto;

import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.enums.StatusCotacao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListarCotacoesDTO {
    private Long idCotacao;
    private Long idUsuario;
    private Loja loja;
    private ListarProdutosDTO produto;
    private BigDecimal valorBase;
    private BigDecimal valorFinal;
    private Integer prazoEntrega;
    private LocalDate dataCriacao;
    private LocalDate dataResposta;
    private LocalDate dataAprovacao;
    private String obsCliente;
    private String obsLoja;
    private StatusCotacao status;
}
