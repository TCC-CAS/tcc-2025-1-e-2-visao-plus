package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.repository.LojaRepositorio;
import com.Gabriel.API_Banco.repository.ProdutoRepositorio;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {

    private final ProdutoRepositorio produtoRepo;
    private final LojaRepositorio lojaRepo;

    public ProdutoService(ProdutoRepositorio produtoRepo, LojaRepositorio lojaRepo) {
        this.produtoRepo = produtoRepo;
        this.lojaRepo = lojaRepo;
    }


}
