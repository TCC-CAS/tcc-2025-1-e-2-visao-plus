package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.CriarArmacaoDTO;
import com.Gabriel.API_Banco.dto.EditarArmacaoDTO;
import com.Gabriel.API_Banco.dto.ListarArmacaoDTO;
import com.Gabriel.API_Banco.model.Armacao;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.repository.ArmacaoRepositorio;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@Service
public class ArmacaoService {

    private final ArmacaoRepositorio ar;
    private final LojaRepositorio lojar;
    private final ImageService imageService;

    public ArmacaoService(ArmacaoRepositorio ar, LojaRepositorio lojar, ImageService imageService){
        this.ar = ar;
        this.lojar = lojar;
        this.imageService = imageService;
    }

    public Armacao criarArmacao(CriarArmacaoDTO dto){
        Loja loja = lojar.findById(dto.getIdLoja())
                .orElseThrow(() -> new RuntimeException("Loja não encontrada!"));

        Armacao armacao = new Armacao();
        armacao.setNome(dto.getNome());
        armacao.setTipo(dto.getTipo());
        armacao.setMarca(dto.getMarca());
        armacao.setModelo(dto.getModelo());
        armacao.setMaterial(dto.getMaterial());
        armacao.setDescricao(dto.getDescricao());
        armacao.setPreco(dto.getPreco());
        armacao.setLoja(loja);

        return ar.save(armacao);
    }

    public void deletarArmacao(Long id){
        ar.deleteById(id);
    }

    public Armacao editarArmacao(Long id, EditarArmacaoDTO dto){

        Armacao armacao = ar.findById(id)
                .orElseThrow(() -> new RuntimeException("Armação não encontrada"));

        armacao.setNome(dto.getNome());
        armacao.setTipo(dto.getTipo());
        armacao.setMarca(dto.getMarca());
        armacao.setModelo(dto.getModelo());
        armacao.setMaterial(dto.getMaterial());
        armacao.setDescricao(dto.getDescricao());
        armacao.setPreco(dto.getPreco());

        return ar.save(armacao);
    }

    public java.util.Optional<Armacao> findByIdArmacao(Long id) {
        return ar.findById(id);
    }

    public List<ListarArmacaoDTO> listarArmacoes(){
        return ar.findAll().stream()
                .map(armacao -> new ListarArmacaoDTO(
                        armacao.getId(),
                        armacao.getNome(),
                        armacao.getTipo(),
                        armacao.getMarca(),
                        armacao.getModelo(),
                        armacao.getMaterial(),
                        armacao.getDescricao(),
                        armacao.getPreco(),
                        armacao.getFotoUrl()
                ))
                .toList();
    }

    public List<ListarArmacaoDTO> listarArmacaoPorLoja(Long idLoja){
        return ar.findByLoja_Id(idLoja).stream()
                .map(armacao -> new ListarArmacaoDTO(
                        armacao.getId(),
                        armacao.getNome(),
                        armacao.getTipo(),
                        armacao.getMarca(),
                        armacao.getModelo(),
                        armacao.getMaterial(),
                        armacao.getDescricao(),
                        armacao.getPreco(),
                        armacao.getFotoUrl()
                ))
                .toList();
    }

    public String atualizarFotoArmacao(Long id, MultipartFile file) throws IOException {

        Armacao armacao = ar.findById(id)
                .orElseThrow(() -> new RuntimeException("Armação não encontrada"));

        String urlAntiga = armacao.getFotoUrl();
        String urlNova = imageService.uploadImage(file);

        armacao.setFotoUrl(urlNova);
        ar.save(armacao);

        if(urlAntiga != null && !urlAntiga.isBlank()){
            imageService.deleteImage(urlAntiga);
        }

        return urlNova;
    }





















}
