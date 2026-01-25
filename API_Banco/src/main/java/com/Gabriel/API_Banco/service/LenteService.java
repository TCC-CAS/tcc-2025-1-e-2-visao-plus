package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.CriarLenteDTO;
import com.Gabriel.API_Banco.dto.EditarLenteDTO;
import com.Gabriel.API_Banco.dto.ListarLentesDTO;
import com.Gabriel.API_Banco.model.Lente;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.repository.LenteRepositorio;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LenteService {

    private final LenteRepositorio lr;
    private final LojaRepositorio lojar;

    public LenteService(LenteRepositorio lr, LojaRepositorio lojar){
        this.lr = lr;
        this.lojar = lojar;
    }

    public Lente criarLente(CriarLenteDTO dto){
        Loja loja = lojar.findById(dto.getIdLoja())
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        Lente lente = new Lente();
        lente.setNome(dto.getNome());
        lente.setTipo(dto.getTipo());
        lente.setMarca(dto.getMarca());
        lente.setModelo(dto.getModelo());
        lente.setMaterial(dto.getMaterial());
        lente.setDescricao(dto.getDescricao());
        lente.setPreco(dto.getPreco());
        lente.setLoja(loja);

        return lr.save(lente);
    }

    public void deletarLente(Long id){
        lr.deleteById(id);
    }

    public Lente editarLente(EditarLenteDTO  dto){

        Lente lente = lr.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Lente não encontrada!"));

        lente.setNome(dto.getNome());
        lente.setTipo(dto.getTipo());
        lente.setMarca(dto.getMarca());
        lente.setModelo(dto.getModelo());
        lente.setMaterial(dto.getMaterial());
        lente.setDescricao(dto.getDescricao());
        lente.setPreco(dto.getPreco());

        return lr.save(lente);
    }

    public java.util.Optional<Lente> findByIdLente(Long id){
        return lr.findById(id);
    }

    public List<ListarLentesDTO> listarLentes(){
        return lr.findAll().stream()
                .map(lente -> new ListarLentesDTO(
                        lente.getNome(),
                        lente.getTipo(),
                        lente.getMarca(),
                        lente.getModelo(),
                        lente.getMaterial(),
                        lente.getDescricao(),
                        lente.getPreco()
                ))
                .toList();
    }

    public List<ListarLentesDTO> listarLentesPorLoja(Long idLoja) {
        return lr.findByLoja_Id(idLoja)
                .stream()
                .map(lente -> new ListarLentesDTO(
                        lente.getNome(),
                        lente.getTipo(),
                        lente.getMarca(),
                        lente.getModelo(),
                        lente.getMaterial(),
                        lente.getDescricao(),
                        lente.getPreco()
                ))
                .toList();
    }


}























