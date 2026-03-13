package com.Gabriel.API_Banco.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.Gabriel.API_Banco.model.Cotacao;

import java.util.List;
import java.util.Optional;

public interface CotacaoRepositorio extends JpaRepository<Cotacao, Long>{

    List<Cotacao> findByUsuarioId(Long id);
}
