package com.Gabriel.API_Banco.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.Gabriel.API_Banco.dto.CriarCotacaoDTO;
import com.Gabriel.API_Banco.model.Cotacao;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.Produto;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.model.enums.StatusCotacao;
import com.Gabriel.API_Banco.repository.CotacaoRepositorio;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import com.Gabriel.API_Banco.repository.ProdutoRepositorio;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;

@Service
public class CotacaoService {

    private final CotacaoRepositorio cotacaoRepo;
    private final UsuarioRepositorio usuarioRepo;
    private final LojaRepositorio lojaRepo;
    private final ProdutoService produtoService;

    public CotacaoService(CotacaoRepositorio cotacaoRepo, UsuarioRepositorio usuarioRepo, LojaRepositorio lojaRepo, ProdutoService produtoService) {

        this.cotacaoRepo = cotacaoRepo;
        this.usuarioRepo = usuarioRepo;
        this.lojaRepo = lojaRepo;
        this.produtoService = produtoService;
    }

    public Cotacao criarCotacao(CriarCotacaoDTO dto) {

        Usuario usuario = usuarioRepo.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Loja loja = lojaRepo.findById(dto.getIdLoja())
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        // cria produto primeiro
        Produto produto = produtoService.criarProduto(dto.getProduto());

        Cotacao cotacao = new Cotacao();
        cotacao.setUsuario(usuario);
        cotacao.setLoja(loja);
        cotacao.setProduto(produto);
        cotacao.setValorBase(produto.getValor());
        cotacao.setDataCriacao(LocalDate.now());
        cotacao.setStatus(StatusCotacao.SOLICITADA);

        return cotacaoRepo.save(cotacao);
    }

}


