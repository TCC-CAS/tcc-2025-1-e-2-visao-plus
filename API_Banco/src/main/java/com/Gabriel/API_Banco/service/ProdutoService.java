package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.CriarProdutoDTO;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.Produto;
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

    public Produto criarProduto(CriarProdutoDTO dto) {

        Loja loja = lojaRepo.findById(dto.getIdLoja())
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        Produto produto = new Produto();
        produto.setNomeProduto(dto.getNome());
        produto.setValor(dto.getValor());
        produto.setLoja(loja);

        return produtoRepo.save(produto);
    }


}
