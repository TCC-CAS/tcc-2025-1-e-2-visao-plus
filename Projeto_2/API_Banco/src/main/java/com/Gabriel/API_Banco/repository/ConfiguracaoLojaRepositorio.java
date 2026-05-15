package com.Gabriel.API_Banco.repository;

import com.Gabriel.API_Banco.model.ConfiguracaoLoja;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracaoLojaRepositorio extends JpaRepository<ConfiguracaoLoja, Long> {

    ConfiguracaoLoja findByLojaId(Long lojaId);
}
