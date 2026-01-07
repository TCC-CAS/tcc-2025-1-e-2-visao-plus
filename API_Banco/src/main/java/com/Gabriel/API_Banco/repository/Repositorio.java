package com.Gabriel.API_Banco.repository;

import com.Gabriel.API_Banco.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface Repositorio extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

}
