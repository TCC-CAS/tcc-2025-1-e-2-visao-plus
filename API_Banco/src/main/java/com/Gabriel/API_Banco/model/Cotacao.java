package com.Gabriel.API_Banco.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.Gabriel.API_Banco.model.enums.StatusCotacao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Data
@Table(name = "tabela_cotacao")
public class Cotacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cotacao")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_produto")
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_loja")
    private Loja loja;

    @Column(name = "valor_base")
    private BigDecimal valorBase;

    @Column(name = "valor_final")
    private BigDecimal valorFinal;

    @Column(name = "prazo_entrega_confirmado")
    private Integer prazoEntregaConfirmado;

    @Column(name = "data_criacao")
    private LocalDate dataCriacao;

    @Column(name = "data_resposta")
    private LocalDate dataResposta;

    @Column(name = "data_aprovacao")
    private LocalDate dataAprovacao;

    @Column(name = "observacao_cliente")
    private String observacaoCliente;

    @Column(name = "observacao_loja")
    private String observacaoLoja;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_cotacao")
    private StatusCotacao status;
}

