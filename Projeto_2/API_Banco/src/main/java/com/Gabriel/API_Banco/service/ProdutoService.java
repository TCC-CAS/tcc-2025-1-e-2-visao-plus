package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.CriarProdutoDTO;
import com.Gabriel.API_Banco.model.*;
import com.Gabriel.API_Banco.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepositorio produtoRepo;
    private final LojaRepositorio lojaRepo;
    private final LenteRepositorio lenteRepo;
    private final ArmacaoRepositorio armacaoRepo;
    private final UsuarioRepositorio usuarioRepo;

    public ProdutoService(ProdutoRepositorio produtoRepo, LojaRepositorio lojaRepo,LenteRepositorio lenteRepo, ArmacaoRepositorio armacaoRepo, UsuarioRepositorio usuarioRepo) {
        this.produtoRepo = produtoRepo;
        this.lojaRepo = lojaRepo;
        this.lenteRepo = lenteRepo;
        this.armacaoRepo = armacaoRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public Produto buscarPorId(Long idProduto) {
        return produtoRepo.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    public Produto criarProduto(CriarProdutoDTO dto) {

        Loja loja = lojaRepo.findById(dto.getIdLoja())
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        Lente lente = lenteRepo.findById(dto.getIdLente())
                .orElseThrow(() -> new RuntimeException("Lente não encontrada"));

        Armacao armacao = armacaoRepo.findById(dto.getIdArmacao())
                .orElseThrow(() -> new RuntimeException("Armação não encontrada"));

        Usuario usuario = usuarioRepo.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Produto produto = new Produto();
        produto.setNomeProduto(dto.getNome());
        produto.setLoja(loja);
        produto.setLente(lente);
        produto.setArmacao(armacao);
        produto.setGrauLenteDireita(dto.getGrauDireito());
        produto.setGrauLenteEsquerda(dto.getGrauEsquerdo());
        produto.setUsuario(usuario);
        produto.setValor(dto.getValor());
        produto.setPrazoEntregaDias(dto.getPrazoEntrega());

        return produtoRepo.save(produto);
    }


    public List<Produto> listarPorLoja(Long idLoja) {

        Loja loja = lojaRepo.findById(idLoja)
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        return produtoRepo.findByLoja(loja);
    }

    public Produto atualizarProduto(Long idProduto, CriarProdutoDTO dto) {

        Produto produto = produtoRepo.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produto.setNomeProduto(dto.getNome());
        produto.setValor(dto.getValor());

        return produtoRepo.save(produto);
    }

    public void deletarProduto(Long idProduto) {

        Produto produto = produtoRepo.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produtoRepo.delete(produto);
    }

}
