package com.Gabriel.API_Banco.service;
import org.springframework.stereotype.Service;

import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.repository.LojaRepositorio;

@Service
public class LojaService {


    private final LojaRepositorio r;

    public LojaService(LojaRepositorio r){
        this.r = r;
    }

    public Loja salvar(Loja loja) {
        return r.save(loja);
    }

}
