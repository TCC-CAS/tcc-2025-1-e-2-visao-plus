package com.Gabriel.API_Banco.repository;
import com.Gabriel.API_Banco.model.Loja;
import org.springframework.data.jpa.repository.JpaRepository;

import com.Gabriel.API_Banco.model.Produto;

import java.util.List;


public interface ProdutoRepositorio extends JpaRepository<Produto, Long> {

    List<Produto> findByLoja(Loja loja);

}
