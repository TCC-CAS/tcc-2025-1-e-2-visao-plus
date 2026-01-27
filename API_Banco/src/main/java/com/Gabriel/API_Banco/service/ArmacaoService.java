package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.CriarArmacaoDTO;
import com.Gabriel.API_Banco.dto.EditarArmacaoDTO;
import com.Gabriel.API_Banco.dto.ListarArmacaoDTO;
import com.Gabriel.API_Banco.model.Armacao;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.repository.ArmacaoRepositorio;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ArmacaoService {

    private final ArmacaoRepositorio ar;
    private final LojaRepositorio lojar;

    public ArmacaoService(ArmacaoRepositorio ar, LojaRepositorio lojar){
        this.ar = ar;
        this.lojar = lojar;
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
                        armacao.getPreco()
                ))
                .toList();
    }

    public List<ListarArmacaoDTO> listarArmacaoPorLoja(Long idLoja){
        return ar.findAll().stream()
                .map(armacao -> new ListarArmacaoDTO(
                        armacao.getId(),
                        armacao.getNome(),
                        armacao.getTipo(),
                        armacao.getMarca(),
                        armacao.getModelo(),
                        armacao.getMaterial(),
                        armacao.getDescricao(),
                        armacao.getPreco()
                ))
                .toList();
    }





















}
