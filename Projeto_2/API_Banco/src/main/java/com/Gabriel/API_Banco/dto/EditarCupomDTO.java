package com.Gabriel.API_Banco.dto;

import com.Gabriel.API_Banco.model.enums.TipoDesconto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EditarCupomDTO {
    private String codigo;
    private String descricao;
    private TipoDesconto tipoDesconto;
    private BigDecimal valorDesconto;
    private LocalDateTime dataInicio;
    private LocalDateTime dataValidade;
    private Integer quantidadeTotal;
}
