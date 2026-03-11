package com.Gabriel.API_Banco.service;

import java.time.LocalDate;
import java.util.List;

import com.Gabriel.API_Banco.dto.ListarCotacoesDTO;
import com.Gabriel.API_Banco.dto.ListarLentesDTO;
import com.Gabriel.API_Banco.dto.ListarProdutosDTO;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.server.ResponseStatusException;

import static java.util.stream.Collectors.toList;

@Service
public class CotacaoService {

    private final CotacaoRepositorio cotacaoRepo;
    private final UsuarioRepositorio usuarioRepo;
    private final LojaRepositorio lojaRepo;
    private final ProdutoService produtoService;
    private final EmailService emailService;

    public CotacaoService(CotacaoRepositorio cotacaoRepo, UsuarioRepositorio usuarioRepo, LojaRepositorio lojaRepo, ProdutoService produtoService, EmailService emailService) {

        this.cotacaoRepo = cotacaoRepo;
        this.usuarioRepo = usuarioRepo;
        this.lojaRepo = lojaRepo;
        this.produtoService = produtoService;
        this.emailService = emailService;
    }

    public List<ListarCotacoesDTO> listarPorUsuario(Long idUsuario) {

        return cotacaoRepo.findByUsuarioId(idUsuario)
                .stream()
                .map(cotacao -> {

                    var produto = cotacao.getProduto();

                    ListarProdutosDTO produtoDTO = new ListarProdutosDTO(
                            produto.getNomeProduto(),
                            produto.getLente().getId(),
                            produto.getArmacao().getId(),
                            produto.getGrauLenteDireita(),
                            produto.getGrauLenteEsquerda(),
                            produto.getValor(),
                            produto.getPrazoEntregaDias()
                    );

                    return new ListarCotacoesDTO(
                            cotacao.getUsuario().getId(),
                            cotacao.getLoja(),
                            produtoDTO,
                            cotacao.getValorBase(),
                            cotacao.getValorFinal(),
                            cotacao.getPrazoEntregaConfirmado(),
                            cotacao.getDataCriacao(),
                            cotacao.getDataResposta(),
                            cotacao.getDataAprovacao(),
                            cotacao.getObservacaoCliente(),
                            cotacao.getObservacaoLoja(),
                            cotacao.getStatus()
                    );
                })
                .toList();
    }

    public Cotacao criarCotacao(CriarCotacaoDTO dto) {

        if (dto.getProduto().getIdLente() == null ||
                dto.getProduto().getIdArmacao() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cotação deve conter lente e armação"
            );
        }


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
        cotacao.setDataResposta(LocalDate.now().plusDays(7));

        Cotacao cotacaoSalva = cotacaoRepo.save(cotacao);

        emailService.criacaoDeCotacao(cotacaoSalva);

        return cotacaoSalva;
    }

    //public Cotacao respostaCotacaoLoja()

}


