package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.CriarLenteDTO;
import com.Gabriel.API_Banco.model.Lente;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.repository.LenteRepositorio;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import org.springframework.stereotype.Service;

@Service
public class LenteService {

    private final LenteRepositorio lr;
    private final LojaRepositorio lojar;

    public LenteService(LenteRepositorio lr, LojaRepositorio lojar){
        this.lr = lr;
        this.lojar = lojar;
    }

    public Lente criarLente(CriarLenteDTO dto){
        Loja idloja = lojar.findById(dto.getIdLoja()).orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        Lente lente = new Lente();
        lente.setNome(dto.getNome());
        lente.setTipo(dto.getTipo());
        lente.setMarca(dto.getMarca());
        lente.setModelo(dto.getModelo());
        lente.setMaterial(dto.getMaterial());
        lente.setDescricao(dto.getDescricao());
        lente.setPreco(dto.getPreco());


        return lr.save(lente);
    }

    public void deletarLente(Long id){
        lr.deleteById(id);
    }

    public Lente
}
