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

    @Column(name = "nome")
    private String nome;

    @Column(name = "email")
    private String email;

    @Column(name = "cnpj")
    private String cnpj;

    @Column(name = "cep")
    private String cep;

    @Column(name= "endereco")
    private String endereco;

    @Column(name = "descricao")
    private String descricao;

    @OneToMany(mappedBy = "loja", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Produto> produtos;

    @Column(name = "url_foto")
    private String fotoUrl;


}