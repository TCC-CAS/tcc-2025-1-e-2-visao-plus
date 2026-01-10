package com.Gabriel.API_Banco.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.Usuario;

public interface LojaRepositorio extends JpaRepository<Loja, Long> {

    Optional<Loja> findByEmailLoja(String email);
    Optional<Usuario> findByEmailUsuario(String email);



}