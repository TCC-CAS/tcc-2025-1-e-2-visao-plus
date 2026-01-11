package com.Gabriel.API_Banco.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Gabriel.API_Banco.model.Loja;

public interface LojaRepositorio extends JpaRepository<Loja, Long> {

    Optional<Loja> findByEmail(String email);

    Optional<Loja> findByIdUsuario(Long idUsuario);

}