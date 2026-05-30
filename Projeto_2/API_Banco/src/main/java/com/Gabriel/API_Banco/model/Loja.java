package com.Gabriel.API_Banco.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "tabela_loja")
public class Loja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_loja")
    private Long id;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    @JsonBackReference
    private Usuario dono;

    @Column(name = "razao_social")
    private String razaoSocial;

    @Column(name = "nome")
    private String nome;

    @Column(name = "email")
    private String email;

    @Column(name = "cnpj", unique = true)
    private String cnpj;

    @Column(name = "cep")
    private String cep;

    @Column(name = "logradouro")
    private String logradouro;

    @Column(name = "numero")
    private String numero;

    @Column(name = "complemento")
    private String complemento;

    @Column(name = "bairro")
    private String bairro;

    @Column(name = "cidade")
    private String cidade;

    @Column(name = "uf")
    private String uf;

    @Column(name = "endereco")
    private String endereco;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "url_foto")
    private String fotoUrl;

    @OneToMany(mappedBy = "loja", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Produto> produtos;
}