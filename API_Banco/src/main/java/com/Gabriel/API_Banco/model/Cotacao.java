package com.Gabriel.API_Banco.model;
import java.math.BigDecimal;
import java.time.LocalDate;

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
    @Column(name = "produto")
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @Column(name = "usuario")
    private Usuario usuario;

    @Column(name = "valor_base")
    private BigDecimal valorBase;   // copiado do produto

    @Column(name = "valor_final")
    private BigDecimal valorFinal;  // definido pelo vendedor

    @Column(name = "data_criacao")
    private LocalDate dataCriacao;

    @ManyToOne
    @JoinColumn(name = "id_loja")
    private Loja loja;

    @Column(name = "data_aprovacao")
    private LocalDate dataAprovacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_cotacao")
    private StatusCotacao status;
}

enum StatusCotacao {
    SOLICITADA,
    EM_ANALISE,
    APROVADA,
    REJEITADA
}
