package com.Gabriel.API_Banco.repository;

import com.Gabriel.API_Banco.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Repositorio extends JpaRepository<Usuario, Long> {

}
