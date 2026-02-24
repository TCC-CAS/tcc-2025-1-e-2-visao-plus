package com.Gabriel.API_Banco.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tabela_lente")
public class Lente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lente")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_loja", nullable = false)
    private Loja loja;

    @Column(name = "nome_lente")
    private String nome;

    @Column(name = "tipo_lente")
    private String tipo;

    @Column(name = "marca_lente")
    private String marca;

    @Column(name = "modelo_lente")
    private String modelo;

    @Column(name = "material_lente")
    private String material;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "preco_lente")
    private Double preco;
}



