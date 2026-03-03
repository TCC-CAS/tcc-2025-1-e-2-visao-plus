package com.Gabriel.API_Banco.service;
import com.Gabriel.API_Banco.dto.EditarLojaDTO;
import com.Gabriel.API_Banco.model.Armacao;
import org.springframework.stereotype.Service;

import com.Gabriel.API_Banco.dto.CriarLojaDTO;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;
import com.Gabriel.API_Banco.dto.ListarLojasDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class LojaService {


    private final LojaRepositorio r;
    private final UsuarioRepositorio ur;
    private final ImageService imageService;

    public LojaService(LojaRepositorio r, UsuarioRepositorio ur, ImageService imageService){
        this.r = r;
        this.ur = ur;
        this.imageService = imageService;
    }

    public Loja criarLoja(CriarLojaDTO dto) {
        Usuario dono = ur.findById(dto.getIdUsuario()).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Loja loja = new Loja();
        loja.setNome(dto.getNome());
        loja.setEmail(dto.getEmail());
        loja.setCnpj(dto.getCnpj());
        loja.setEndereco(dto.getEndereco());
        loja.setDono(dono);
        loja.setCep(dto.getCEP());
        dono.setTipoUsuario("Vendedor");

        return r.save(loja);
    }

    public void deletarLoja(Long id) {
        r.deleteById(id);

    }

    public java.util.Optional<Loja> findByEmailLoja(String email) {
        return r.findByEmail(email);
    }

    public java.util.Optional<Loja> findByIdLoja(Long idLoja) {
        return r.findById(idLoja);
    }

    public java.util.Optional<Loja> findByIdUsuario(Long idUsuario) {
        return r.findByDonoId(idUsuario);
    }

    public Loja editarLoja(EditarLojaDTO dto) {

        Loja loja = r.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        loja.setNome(dto.getNome());
        loja.setEmail(dto.getEmail());
        loja.setCnpj(dto.getCnpj());
        loja.setCep(dto.getCep());
        loja.setEndereco(dto.getEndereco());
        loja.setDescricao(dto.getDescricao());

        return r.save(loja);
    }

        public List<ListarLojasDTO> listarTodas() {
            return r.findAll().stream()
                    .map(loja -> new ListarLojasDTO(
                            loja.getId(),
                            loja.getNome(),
                            loja.getEmail(),
                            loja.getCnpj(),
                            loja.getCep(),
                            loja.getEndereco(),
                            loja.getDescricao(),
                            loja.getFotoUrl()
                    ))
                    .toList();
        }

    public String setarFotoLoja(Long id, MultipartFile file) throws IOException {

        Loja loja = r.findById(id)
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        // Se já existir imagem, deletar antes
        if (loja.getFotoUrl() != null) {
            imageService.deleteImage(loja.getFotoUrl());
        }

        String imageUrl = imageService.uploadImage(file);

        loja.setFotoUrl(imageUrl);

        r.save(loja);

        return imageUrl;
    }



}
