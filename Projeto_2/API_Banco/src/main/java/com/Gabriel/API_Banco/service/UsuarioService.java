package com.Gabriel.API_Banco.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import com.Gabriel.API_Banco.dto.EditarUsuarioDTO;
import com.Gabriel.API_Banco.dto.ListarUsuariosDTO;
import com.Gabriel.API_Banco.exceptions.UsuarioExceptions;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import org.springframework.stereotype.Service;
import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UsuarioService {

    private final UsuarioRepositorio r;
    private final LojaRepositorio lr;
    private final ImageService imageService;

    public UsuarioService(UsuarioRepositorio r, LojaRepositorio lr, ImageService imageService) {
        this.r = r;
        this.lr = lr;
        this.imageService = imageService;
    }




    public Usuario salvar(Usuario usuario) {

        if (r.existsByEmail(usuario.getEmail())) {
            throw new UsuarioExceptions("Email já cadastrado");
        }

        if (r.existsByNome(usuario.getNome())) {
            throw new UsuarioExceptions("Nome de usuário já cadastrado");
        }

        return r.save(usuario);
    }

    public Optional<Usuario> consultarPorEmail(String email) {
        return r.findByEmail(email);
    }
    public Optional<Usuario> consultarPorNome(String nome){return r.findByNome(nome);}

    public Usuario editarUsuario(EditarUsuarioDTO dto) {

        Usuario usuario = r.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());

        return r.save(usuario);
    }

    public List<ListarUsuariosDTO> listarUsuarios() {
        return r.findAll().stream()
                .map(usuario -> new ListarUsuariosDTO(
                        usuario.getId(),
                        usuario.getNome(),
                        usuario.getEmail(),
                        usuario.getTipoUsuario()

                ))
                .toList();
    }

    @Transactional
    public void deletarUsuario(Long id) {
        Usuario usuario = r.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        r.delete(usuario);
    }

    //IMAGENSSSSSSS FINALMENTEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE//

    public String atualizarFoto(Long usuarioId, MultipartFile file) throws IOException {

        Usuario usuario = r.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String urlAntiga = usuario.getFotoUrl();
        String urlNova = imageService.uploadProfileImage(file);

        usuario.setFotoUrl(urlNova);
        r.save(usuario);

        if(urlAntiga != null &&  !urlAntiga.isBlank()) {
            imageService.deleteImage(urlAntiga);
        }

        return urlNova;
    }

    public String getFotoPerfil(Long id){
        Usuario usuario = r.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return usuario.getFotoUrl();
    }

}
