package com.Gabriel.API_Banco.repository;

import com.Gabriel.API_Banco.model.Lente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LenteRepositorio extends JpaRepository<Lente, Long> {

    List<Lente> findByLoja_Id(Long idLoja);
}
