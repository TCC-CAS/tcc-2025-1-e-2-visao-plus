package com.Gabriel.API_Banco.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.Gabriel.API_Banco.model.Produto;


public interface ProdutoRepositorio extends JpaRepository<Produto, Long> {

}
