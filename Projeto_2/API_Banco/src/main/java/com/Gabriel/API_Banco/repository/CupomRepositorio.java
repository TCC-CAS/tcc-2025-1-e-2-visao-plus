package com.Gabriel.API_Banco.repository;

import com.Gabriel.API_Banco.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CupomRepositorio extends JpaRepository<Cupom, Long> {

    List<Cupom> findByLojaIdAndDeletadoFalseOrderByCriadoEmDesc(Long lojaId);

    List<Cupom> findByLojaIdAndAtivoTrueAndPublicoTrueAndDeletadoFalseAndDataValidadeAfter(
            Long lojaId,
            LocalDateTime agora
    );

    List<Cupom> findByAtivoTrueAndPublicoTrueAndDeletadoFalseAndDataValidadeAfter(
            LocalDateTime agora
    );

    long countByLojaIdAndAtivoTrueAndDeletadoFalse(Long lojaId);

    boolean existsByLojaIdAndCodigoIgnoreCaseAndDeletadoFalse(Long lojaId, String codigo);
}