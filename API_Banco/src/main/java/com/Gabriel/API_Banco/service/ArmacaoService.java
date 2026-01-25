package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.model.Armacao;
import com.Gabriel.API_Banco.repository.ArmacaoRepositorio;
import org.springframework.stereotype.Service;


@Service
public class ArmacaoService {

    private final ArmacaoRepositorio ar;

    public ArmacaoService(ArmacaoRepositorio ar){
        this.ar = ar;
    }

    public Armacao criarArmacao(Armacao armacao){
        return ar.save(armacao);
    }


}
