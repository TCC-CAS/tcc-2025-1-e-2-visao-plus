package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.CriarLenteDTO;
import com.Gabriel.API_Banco.dto.EditarLenteDTO;
import com.Gabriel.API_Banco.dto.ListarLentesDTO;
import com.Gabriel.API_Banco.model.Armacao;
import com.Gabriel.API_Banco.model.Lente;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.repository.LenteRepositorio;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class LenteService {

    private final LenteRepositorio lr;
    private final LojaRepositorio lojar;
    private final ImageService imageService;

    public LenteService(LenteRepositorio lr, LojaRepositorio lojar, ImageService imageService){
        this.lr = lr;
        this.lojar = lojar;
        this.imageService = imageService;
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

    public Lente editarLente(Long id, EditarLenteDTO  dto){

        Lente lente = lr.findById(id)
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
                        lente.getId(),
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
                        lente.getId(),
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

    public String atualizarFotoLente(Long id, MultipartFile file) throws IOException {

        Lente lente = lr.findById(id)
                .orElseThrow(() -> new RuntimeException("Armação não encontrada"));

        String urlAntiga = lente.getFotoUrl();
        String urlNova = imageService.uploadImage(file);

        lente.setFotoUrl(urlNova);
        lr.save(lente);

        if(urlAntiga != null && !urlAntiga.isBlank()){
            imageService.deleteImage(urlAntiga);
        }

        return urlNova;
    }


}























