package com.Gabriel.API_Banco.repository;

import com.Gabriel.API_Banco.model.CupomUsuario;
import com.Gabriel.API_Banco.model.enums.StatusCupomUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CupomUsuarioRepositorio extends JpaRepository<CupomUsuario, Long> {

    boolean existsByCupomIdAndUsuarioId(Long cupomId, Long usuarioId);

    Optional<CupomUsuario> findByCupomIdAndUsuarioId(Long cupomId, Long usuarioId);

    List<CupomUsuario> findByUsuarioIdOrderByResgatadoEmDesc(Long usuarioId);

    long countByUsuarioIdAndStatus(Long usuarioId, StatusCupomUsuario status);
}