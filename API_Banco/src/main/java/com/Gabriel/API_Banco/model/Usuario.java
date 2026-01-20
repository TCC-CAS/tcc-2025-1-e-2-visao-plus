package com.Gabriel.API_Banco.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @OneToOne(mappedBy = "dono", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private Loja loja;

    @Column(name = "nome")
    private String nome;

    @Column(name = "email")
    private String email;

    @Column(name = "senha")
    private String senha;

    @Column(name = "tipo_usuario")
    private String tipoUsuario;

}
