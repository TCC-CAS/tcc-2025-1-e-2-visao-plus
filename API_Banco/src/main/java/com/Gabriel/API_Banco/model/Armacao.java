package com.Gabriel.API_Banco.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tabela_armacao")
public class Armacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_armacao")
    private Long id;

    @Column(name = "nome_armacao")
    private String nome;

    @Column(name = "tipo_armacao")
    private String tipo;

    @Column(name = "marca_armacao")
    private String marca;

    @Column(name = "modelo_armacao")
    private String modelo;

    @Column(name = "material_armacao")
    private String material;

    @Column(name = "preco_armacao")
    private Double preco;
}
