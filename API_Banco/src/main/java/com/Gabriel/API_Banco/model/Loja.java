package com.Gabriel.API_Banco.model;

import jakarta.persistence.*;
import lombok.Data;

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

}