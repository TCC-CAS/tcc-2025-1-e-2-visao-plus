package com.Gabriel.API_Banco.repository;

import com.Gabriel.API_Banco.model.MensagemCotacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensagemCotacaoRepository extends JpaRepository<MensagemCotacao, Long> {

    List<MensagemCotacao> findByCotacaoIdOrderByEnviadoEmAsc(Long idCotacao);
}
