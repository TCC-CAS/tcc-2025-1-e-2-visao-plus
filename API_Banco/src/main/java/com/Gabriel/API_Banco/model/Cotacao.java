package com.Gabriel.API_Banco.model;
import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;



@Entity
public class Cotacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Produto produto;

    @ManyToOne
    private Usuario usuario;

    private BigDecimal valorBase;   // copiado do produto
    private BigDecimal valorFinal;  // definido pelo vendedor

    private LocalDate dataCriacao;
    private LocalDate dataAprovacao;

    @Enumerated(EnumType.STRING)
    private StatusCotacao status;
}

enum StatusCotacao {
    SOLICITADA,
    EM_ANALISE,
    APROVADA,
    REJEITADA
}
