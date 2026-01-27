package com.Gabriel.API_Banco.repository;

import com.Gabriel.API_Banco.model.Armacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArmacaoRepositorio extends JpaRepository<Armacao, Long> {

    List<Armacao> findByLoja_Id(Long idLoja);

}
