package com.Gabriel.API_Banco.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mensagens_cotacao")
public class MensagemCotacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_cotacao", nullable = false)
    private Cotacao cotacao;

    @ManyToOne
    @JoinColumn(name = "id_remetente", nullable = false)
    private Usuario remetente;

    @Column(nullable = false, length = 1000)
    private String texto;

    @Column(nullable = false)
    private LocalDateTime enviadoEm;

    @PrePersist
    public void prePersist() {
        this.enviadoEm = LocalDateTime.now();
    }

    // getters e setters
}