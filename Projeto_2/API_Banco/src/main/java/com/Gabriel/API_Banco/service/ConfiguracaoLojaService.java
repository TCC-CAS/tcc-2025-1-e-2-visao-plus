package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.ConfiguracaoLojaDTO;
import com.Gabriel.API_Banco.model.ConfiguracaoLoja;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.repository.ConfiguracaoLojaRepositorio;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import org.springframework.stereotype.Service;

@Service
public class ConfiguracaoLojaService {

    private final ConfiguracaoLojaRepositorio r;
    private final LojaRepositorio lr;

    public ConfiguracaoLojaService(ConfiguracaoLojaRepositorio r,LojaRepositorio lr){
        this.r = r;
        this.lr = lr;
    }

    /**
     * Busca configuração da loja.
     * Se não existir, cria uma padrão.
     */
    public ConfiguracaoLoja buscarOuCriarConfiguracao(Long lojaId) {

        ConfiguracaoLoja config = r.findByLojaId(lojaId);

        if (config != null) {
            return config;
        }

        Loja loja = lr.findById(lojaId)
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        ConfiguracaoLoja nova = new ConfiguracaoLoja();
        nova.setLoja(loja);

        // Defaults
        nova.setCorPrimaria("#156783");
        nova.setCorSecundaria("#b5d7df");
        nova.setCorFundo("#ffffff");
        nova.setFontePrimaria("Arial");
        nova.setFonteSecundaria("Helvetica");
        nova.setLayoutPagina("padrao");
        nova.setLayoutProdutos("lista");
        nova.setProdutosLinha(4);
        nova.setMostrarMarca(true);
        nova.setMostrarPreco(true);

        return r.save(nova);
    }

    public ConfiguracaoLoja atualizarConfiguracao(
            Long lojaId,
            ConfiguracaoLojaDTO dto
    ) {
        ConfiguracaoLoja config = buscarOuCriarConfiguracao(lojaId);

        if (dto.getCorPrimaria() != null)
            config.setCorPrimaria(dto.getCorPrimaria());

        if (dto.getCorSecundaria() != null)
            config.setCorSecundaria(dto.getCorSecundaria());

        if (dto.getCorFundo() != null)
            config.setCorFundo(dto.getCorFundo());

        if (dto.getFontePrimaria() != null)
            config.setFontePrimaria(dto.getFontePrimaria());

        if (dto.getFonteSecundaria() != null)
            config.setFonteSecundaria(dto.getFonteSecundaria());

        if (dto.getLayoutPagina() != null)
            config.setLayoutPagina(dto.getLayoutPagina());

        if (dto.getLayoutProdutos() != null)
            config.setLayoutProdutos(dto.getLayoutProdutos());

        if (dto.getProdutosLinha() != null)
            config.setProdutosLinha(dto.getProdutosLinha());

        if (dto.getMostrarMarca() != null)
            config.setMostrarMarca(dto.getMostrarMarca());

        if (dto.getMostrarPreco() != null)
            config.setMostrarPreco(dto.getMostrarPreco());

        return r.save(config);
    }
}

