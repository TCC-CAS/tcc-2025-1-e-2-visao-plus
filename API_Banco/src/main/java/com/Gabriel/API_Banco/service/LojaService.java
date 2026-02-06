package com.Gabriel.API_Banco.service;
import com.Gabriel.API_Banco.dto.EditarLojaDTO;
import org.springframework.stereotype.Service;

import com.Gabriel.API_Banco.dto.CriarLojaDTO;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;
import com.Gabriel.API_Banco.dto.ListarLojasDTO;

import java.util.List;

@Service
public class LojaService {


    private final LojaRepositorio r;
    private final UsuarioRepositorio ur;

    public LojaService(LojaRepositorio r, UsuarioRepositorio ur){
        this.r = r;
        this.ur = ur;
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
                        loja.getDescricao()
                ))
                .toList();
    }

}
