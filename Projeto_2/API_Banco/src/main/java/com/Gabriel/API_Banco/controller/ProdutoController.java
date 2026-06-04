package com.Gabriel.API_Banco.controller;

import com.Gabriel.API_Banco.dto.CriarProdutoDTO;
import com.Gabriel.API_Banco.model.Produto;
import com.Gabriel.API_Banco.service.ProdutoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @PostMapping("/criarProduto")
    public Produto criar(@RequestBody CriarProdutoDTO dto) {
        return produtoService.criarProduto(dto);
    }

    @GetMapping("/listarPorLoja/{idLoja}")
    public List<Produto> listarPorLoja(@PathVariable Long idLoja) {
        return produtoService.listarPorLoja(idLoja);
    }

    @PutMapping("/editarProduto/{idProduto}")
    public Produto atualizar(
            @PathVariable Long idProduto,
            @RequestBody CriarProdutoDTO dto) {

        return produtoService.atualizarProduto(idProduto, dto);
    }

    @DeleteMapping("/deletarProduto/{idProduto}")
    public void deletar(@PathVariable Long idProduto) {
        produtoService.deletarProduto(idProduto);
    }
}