package com.Gabriel.API_Banco.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Gabriel.API_Banco.model.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByNome(String nome);

    Optional<Usuario> findById (Long id);

    boolean existsByEmail(String email);

    boolean existsByNome(String nome);



}
