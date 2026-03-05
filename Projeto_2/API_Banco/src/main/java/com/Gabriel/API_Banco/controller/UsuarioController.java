package com.Gabriel.API_Banco.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import com.Gabriel.API_Banco.dto.EditarUsuarioDTO;
import com.Gabriel.API_Banco.dto.ListarLojasDTO;
import com.Gabriel.API_Banco.dto.ListarUsuariosDTO;
import com.Gabriel.API_Banco.exceptions.UsuarioExceptions;
import com.Gabriel.API_Banco.repository.UsuarioRepositorio;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Gabriel.API_Banco.model.Usuario;
import com.Gabriel.API_Banco.service.UsuarioService;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService s;
    private final UsuarioRepositorio r;

    public UsuarioController(UsuarioService s, UsuarioRepositorio r) {
        this.s = s;
        this.r = r;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario novo = s.salvar(usuario);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Usuário " + novo.getNome() + " salvo com sucesso!");
        } catch (UsuarioExceptions e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Usuario usuario) {

        // Busca nome no banco, para validar o nome do usuário e se ele está cadastrado
        Optional<Usuario> nomeNoBanco = s.consultarPorNome(usuario.getNome());

        if (nomeNoBanco.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Username não encontrado!");
        }

        // Busca email no banco, para validar primeiro o email do usuário e se ele está cadastrado
        Optional<Usuario> usuarioNoBanco = s.consultarPorEmail(usuario.getEmail());

        // Se NÃO encontrou usuário
        if (usuarioNoBanco.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Email não encontrado!");
        }

        //Se a validação do email der certo, ele vai pegar a senha para comparar
        String senhaNoBanco = usuarioNoBanco.get().getSenha();

        // Compara com a senha que veio no login
        if (!usuario.getSenha().equals(senhaNoBanco)) {

            // Se ela atender a condição imposta, de que não batem, devolve que a senha é inválida
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Senha inválida!");
        }

        // Se chegou até aqui, o email e a senha estão corretos!!
        // Retorna o usuário inteiro → vira JSON automaticamente
        return ResponseEntity.ok(usuarioNoBanco.get());
    }

    @PutMapping("/editarUsuario")
    public ResponseEntity<Usuario> editarUsuario(@RequestBody EditarUsuarioDTO dto){
        Usuario usuario = s.editarUsuario(dto);
        return ResponseEntity.status(HttpStatus.OK).body(usuario);
    }

    @GetMapping("/listarUsuarios")
    public ResponseEntity<List<ListarUsuariosDTO>> listarUsuarios() {
        return ResponseEntity.ok(s.listarUsuarios());
    }

    @DeleteMapping("/deletarUsuario/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        s.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/setarFotoPerfil/{id}")
    public ResponseEntity<String> uploadFoto(@PathVariable Long id,@RequestParam("file") MultipartFile file)
            throws IOException {

        String url = s.atualizarFoto(id, file);

        return ResponseEntity.ok(url);
    }

    @GetMapping("/getFotoPerfil/{id}")
    public ResponseEntity<String> getFoto(@PathVariable Long id){
        String url = s.getFotoPerfil(id);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/existe-email")
    public boolean existeEmail(@RequestParam String email) {
        return r.existsByEmail(email);
    }

    @GetMapping("/existe-nome")
    public boolean existeNome(@RequestParam String nome) {
        return r.existsByNome(nome);
    }



}
