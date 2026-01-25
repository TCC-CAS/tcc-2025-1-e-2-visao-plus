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
        Loja loja =

        return lr.save(lente);
    }
}
