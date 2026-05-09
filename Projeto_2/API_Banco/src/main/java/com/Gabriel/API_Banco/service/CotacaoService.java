package com.Gabriel.API_Banco.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import com.Gabriel.API_Banco.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.Gabriel.API_Banco.dto.*;
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
                            cotacao.getId(),
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

    public List<ListarCotacoesDTO> listarPorLoja(Long idLoja) {
        return cotacaoRepo.findByLojaId(idLoja)
                .stream()
                .map(this::toDTO)
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

    // ── Enviar proposta (loja) ───────────────────────────────

    public Cotacao enviarProposta(Long id, ResponderCotacaoDTO dto, Long idLojaLogada) {

        Cotacao cotacao = buscarCotacao(id);
        validarDonoDaLoja(cotacao, idLojaLogada);

        validarTransicao(
                cotacao.getStatus(),
                StatusCotacao.PROPOSTA_ENVIADA,
                Set.of(StatusCotacao.SOLICITADA, StatusCotacao.NEGOCIANDO)
        );

        if (dto.getValorFinal() == null || dto.getPrazoEntrega() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Valor final e prazo são obrigatórios para enviar proposta"
            );
        }

        cotacao.setValorFinal(dto.getValorFinal());
        cotacao.setPrazoEntregaConfirmado(dto.getPrazoEntrega());
        cotacao.setObservacaoLoja(dto.getObservacaoLoja());
        cotacao.setDataResposta(LocalDate.now());
        cotacao.setStatus(StatusCotacao.PROPOSTA_ENVIADA);

        Cotacao salva = cotacaoRepo.save(cotacao);
        emailService.respostaCotacao(salva);
        return salva;
    }

    // ── Transição de status (endpoint central) ───────────────

    public Cotacao transicionarStatus(Long id, StatusTransicaoDTO dto) {

        Cotacao cotacao = buscarCotacao(id);
        StatusCotacao atual = cotacao.getStatus();
        StatusCotacao novo = dto.getNovoStatus();
        Long idAtor = dto.getIdAtor();

        switch (novo) {

            case NEGOCIANDO -> {
                // Loja abre o chat (SOLICITADA → NEGOCIANDO)
                // ou cliente pede revisão (PROPOSTA_ENVIADA → NEGOCIANDO)
                validarTransicao(atual, novo,
                        Set.of(StatusCotacao.SOLICITADA, StatusCotacao.PROPOSTA_ENVIADA));
                validarDonoDaLoja(cotacao, idAtor); // só a loja abre o chat
            }

            case PROPOSTA_ENVIADA -> {
                // Loja envia proposta — use enviarProposta() que já valida os campos
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Para enviar proposta use o endpoint /responder"
                );
            }

            case APROVADA -> {
                // Cliente aprova a proposta
                validarTransicao(atual, novo,
                        Set.of(StatusCotacao.PROPOSTA_ENVIADA));
                validarDonoDoUsuario(cotacao, idAtor);
                cotacao.setDataAprovacao(LocalDate.now());
            }

            case AGUARDANDO_SINAL -> {
                // Loja decide exigir sinal antes de reservar
                validarTransicao(atual, novo,
                        Set.of(StatusCotacao.APROVADA));
                validarDonoDaLoja(cotacao, idAtor);
            }

            case RESERVADA -> {
                // Loja confirma sinal recebido (AGUARDANDO_SINAL → RESERVADA)
                // ou loja reserva direto sem sinal (APROVADA → RESERVADA)
                validarTransicao(atual, novo,
                        Set.of(StatusCotacao.APROVADA, StatusCotacao.AGUARDANDO_SINAL));
                validarDonoDaLoja(cotacao, idAtor);
            }

            case FINALIZADA -> {
                // Qualquer lado pode finalizar
                validarTransicao(atual, novo,
                        Set.of(StatusCotacao.RESERVADA));
            }

            case CANCELADA -> {
                // Qualquer lado pode cancelar, de qualquer estado ativo
                Set<StatusCotacao> cancelaveis = Set.of(
                        StatusCotacao.SOLICITADA,
                        StatusCotacao.NEGOCIANDO,
                        StatusCotacao.PROPOSTA_ENVIADA,
                        StatusCotacao.APROVADA,
                        StatusCotacao.AGUARDANDO_SINAL,
                        StatusCotacao.RESERVADA
                );
                validarTransicao(atual, novo, cancelaveis);
            }

            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Transição de status inválida"
            );
        }

        cotacao.setStatus(novo);
        return cotacaoRepo.save(cotacao);
    }

    // Helpers Privados


    private Cotacao buscarCotacao(Long id) {
        return cotacaoRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cotação não encontrada"));
    }

    private void validarTransicao(StatusCotacao atual,
                                  StatusCotacao novo,
                                  Set<StatusCotacao> permitidos) {
        if (!permitidos.contains(atual)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não é possível ir de " + atual + " para " + novo
            );
        }
    }

    private void validarDonoDaLoja(Cotacao cotacao, Long idAtor) {
        if (!cotacao.getLoja().getId().equals(idAtor)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Esta ação é exclusiva da loja responsável pela cotação"
            );
        }
    }

    private void validarDonoDoUsuario(Cotacao cotacao, Long idAtor) {
        if (!cotacao.getUsuario().getId().equals(idAtor)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Esta ação é exclusiva do cliente da cotação"
            );
        }
    }

    private ListarCotacoesDTO toDTO(Cotacao cotacao) {
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
                cotacao.getId(),
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
    }


    public Cotacao responderCotacao(Long id, ResponderCotacaoDTO dto, Long idLojaLogada) {

        Cotacao cotacao = cotacaoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cotação não encontrada"));

        if (!cotacao.getLoja().getId().equals(idLojaLogada)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Esta cotação não pertence à sua loja"
            );
        }

        if (cotacao.getStatus() != StatusCotacao.SOLICITADA &&
                cotacao.getStatus() != StatusCotacao.NEGOCIANDO) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cotação não pode ser respondida neste estado"
            );
        }

        if (dto.getValorFinal() == null || dto.getPrazoEntrega() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Valor final e prazo são obrigatórios"
            );
        }

        cotacao.setValorFinal(dto.getValorFinal());
        cotacao.setPrazoEntregaConfirmado(dto.getPrazoEntrega());
        cotacao.setObservacaoLoja(dto.getObservacaoLoja());
        cotacao.setDataResposta(LocalDate.now());
        cotacao.setStatus(StatusCotacao.NEGOCIANDO);

        Cotacao cotacaoSalva = cotacaoRepo.save(cotacao);

        emailService.respostaCotacao(cotacaoSalva);

        return cotacaoSalva;
    }

    public Cotacao aprovarCotacao(Long idCotacao) {

        Cotacao cotacao = cotacaoRepo.findById(idCotacao)
                .orElseThrow(() -> new RuntimeException("Cotação não encontrada"));

        if (cotacao.getStatus() != StatusCotacao.NEGOCIANDO) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Apenas cotações respondidas podem ser aprovadas"
            );
        }

        cotacao.setStatus(StatusCotacao.APROVADA);
        cotacao.setDataAprovacao(LocalDate.now());

        return cotacaoRepo.save(cotacao);
    }

    public Cotacao registrarPagamento(Long idCotacao) {

        Cotacao cotacao = cotacaoRepo.findById(idCotacao)
                .orElseThrow(() -> new RuntimeException("Cotação não encontrada"));

        if (cotacao.getStatus() != StatusCotacao.APROVADA) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pagamento só pode ocorrer após aprovação"
            );
        }

        cotacao.setStatus(StatusCotacao.RESERVADA);

        return cotacaoRepo.save(cotacao);
    }

    //public Cotacao respostaCotacaoLoja()

}


