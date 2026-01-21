package com.Gabriel.API_Banco.model;
import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Table(name = "tabela_produto")
@Entity
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto")
    private Long id;

    @Column(name = "nome_produto")
    private String nomeProduto;

    @ManyToOne
    @JoinColumn(name = "id_lente")
    private Lente lente;

    @ManyToOne
    @JoinColumn(name = "id_armacao")
    private Armacao armacao;

    @Column(name = "valor_Base")
    private BigDecimal valor;

    @Column(name = "prazo_entrega_dias")
    private Integer prazoEntregaDias;

    ManyToOne

}

