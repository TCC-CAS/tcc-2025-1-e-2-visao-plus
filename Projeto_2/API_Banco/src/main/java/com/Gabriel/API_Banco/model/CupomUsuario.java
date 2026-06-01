package com.Gabriel.API_Banco.model;

import com.Gabriel.API_Banco.model.enums.StatusCupomUsuario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(
        name = "tabela_cupom_usuario",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"id_cupom", "id_usuario"})
        }
)
public class CupomUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cupom_usuario")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_cupom", nullable = false)
    private Cupom cupom;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_cotacao")
    private Cotacao cotacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusCupomUsuario status = StatusCupomUsuario.RESGATADO;

    @Column(name = "resgatado_em")
    private LocalDateTime resgatadoEm = LocalDateTime.now();

    @Column(name = "usado_em")
    private LocalDateTime usadoEm;
}