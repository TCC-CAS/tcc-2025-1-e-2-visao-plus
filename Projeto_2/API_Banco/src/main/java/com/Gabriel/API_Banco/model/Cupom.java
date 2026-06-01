package com.Gabriel.API_Banco.model;

import com.Gabriel.API_Banco.model.enums.TipoDesconto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "tabela_cupom")
public class Cupom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cupom")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_loja", nullable = false)
    private Loja loja;

    @Column(name = "codigo", nullable = false, length = 10)
    private String codigo;

    @Column(name = "descricao", length = 50)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_desconto", nullable = false)
    private TipoDesconto tipoDesconto;

    @Column(name = "valor_desconto", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorDesconto;

    @Column(name = "data_inicio")
    private LocalDateTime dataInicio;

    @Column(name = "data_validade", nullable = false)
    private LocalDateTime dataValidade;

    @Column(name = "ativo")
    private Boolean ativo = false;

    @Column(name = "publico")
    private Boolean publico = false;

    @Column(name = "deletado")
    private Boolean deletado = false;

    @Column(name = "quantidade_total")
    private Integer quantidadeTotal;

    @Column(name = "quantidade_resgatada")
    private Integer quantidadeResgatada = 0;

    @Column(name = "quantidade_usada")
    private Integer quantidadeUsada = 0;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();

    @OneToMany(mappedBy = "cupom")
    @JsonIgnore
    private List<CupomUsuario> resgates;
}