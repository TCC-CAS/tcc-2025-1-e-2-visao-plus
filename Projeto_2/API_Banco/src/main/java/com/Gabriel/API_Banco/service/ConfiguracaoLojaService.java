package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.dto.ConfiguracaoLojaDTO;
import com.Gabriel.API_Banco.model.ConfiguracaoLoja;
import com.Gabriel.API_Banco.model.Loja;
import com.Gabriel.API_Banco.model.enums.PlanoLoja;
import com.Gabriel.API_Banco.repository.ConfiguracaoLojaRepositorio;
import com.Gabriel.API_Banco.repository.LojaRepositorio;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class ConfiguracaoLojaService {

    private final ConfiguracaoLojaRepositorio r;
    private final LojaRepositorio lr;
    private final ImageService imageService;

    public ConfiguracaoLojaService(
            ConfiguracaoLojaRepositorio r,
            LojaRepositorio lr,
            ImageService imageService
    ) {
        this.r = r;
        this.lr = lr;
        this.imageService = imageService;
    }


    public ConfiguracaoLoja atualizarBanner(Long lojaId, MultipartFile file) throws IOException {

        ConfiguracaoLoja config = buscarOuCriarConfiguracao(lojaId);

        Loja loja = config.getLoja();

        if (loja == null) {
            loja = lr.findById(lojaId)
                    .orElseThrow(() -> new RuntimeException("Loja não encontrada"));
            config.setLoja(loja);
        }

        PlanoLoja plano = normalizarPlano(loja.getPlano());

        if (plano == PlanoLoja.FREE) {
            throw new RuntimeException("Banner disponível apenas nos planos PLUS e PRO.");
        }

        String urlBanner = imageService.uploadBannerLoja(file);

        config.setBannerUrl(urlBanner);
        config.setMostrarBanner(true);

        return r.save(config);
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

        aplicarConfiguracaoPadrao(nova);

        return r.save(nova);
    }


    public ConfiguracaoLoja atualizarConfiguracao(Long lojaId, ConfiguracaoLojaDTO dto) {

        ConfiguracaoLoja config = buscarOuCriarConfiguracao(lojaId);

        Loja loja = config.getLoja();

        if (loja == null) {
            loja = lr.findById(lojaId)
                    .orElseThrow(() -> new RuntimeException("Loja não encontrada"));
            config.setLoja(loja);
        }

        PlanoLoja plano = normalizarPlano(loja.getPlano());

        System.out.println("===== DEBUG CONFIG LOJA =====");
        System.out.println("PLANO: " + plano);
        System.out.println("DTO COR PRIMARIA: " + dto.getCorPrimaria());
        System.out.println("ANTES DE ATUALIZAR: " + config.getCorPrimaria());

        atualizarCamposBasicos(config, dto);

        System.out.println("DEPOIS DE CAMPOS BASICOS: " + config.getCorPrimaria());

        if (plano == PlanoLoja.FREE) {
            aplicarRegrasPlanoFree(config);
        } else if (plano == PlanoLoja.PLUS) {
            atualizarCamposPlus(config, dto);
            aplicarRegrasPlanoPlus(config);
        } else if (plano == PlanoLoja.PRO) {
            atualizarCamposPlus(config, dto);
            atualizarCamposPro(config, dto);
            aplicarRegrasPlanoPro(config);
        } else {
            aplicarRegrasPlanoFree(config);
        }

        System.out.println("DEPOIS DAS REGRAS DO PLANO: " + config.getCorPrimaria());
        System.out.println("=============================");

        return r.save(config);
    }

    private void aplicarConfiguracaoPadrao(ConfiguracaoLoja config) {
        config.setCorPrimaria("#156783");
        config.setCorSecundaria("#b5d7df");
        config.setCorFundo("#f5f7fa");
        config.setFontePrimaria("Arial");
        config.setFonteSecundaria("Helvetica");
        config.setLayoutPagina("padrao");
        config.setLayoutProdutos("grid");
        config.setProdutosLinha(4);
        config.setMostrarMarca(true);
        config.setMostrarPreco(true);
        config.setBannerUrl(null);
        config.setTextoDestaque(null);
        config.setMostrarBanner(false);
    }

    private PlanoLoja normalizarPlano(PlanoLoja plano) {
        if (plano == null) {
            plano = PlanoLoja.FREE;
        }

        return plano;
    }

    /**
     * Campos que todo plano pode ter.
     * Aqui entram coisas básicas que não quebram a regra de monetização.
     */
    private void atualizarCamposBasicos(ConfiguracaoLoja config, ConfiguracaoLojaDTO dto) {
        if (dto.getMostrarMarca() != null) {
            config.setMostrarMarca(dto.getMostrarMarca());
        }

        if (dto.getCorPrimaria() != null) {
            config.setCorPrimaria(dto.getCorPrimaria());
        }

        if (dto.getCorSecundaria() != null) {
            config.setCorSecundaria(dto.getCorSecundaria());
        }

        if (dto.getCorFundo() != null) {
            config.setCorFundo(dto.getCorFundo());
        }

        if (dto.getFontePrimaria() != null) {
            config.setFontePrimaria(dto.getFontePrimaria());
        }

        if (dto.getFonteSecundaria() != null) {
            config.setFonteSecundaria(dto.getFonteSecundaria());
        }
    }

    /**
     * Campos liberados a partir do PLUS.
     */
    private void atualizarCamposPlus(ConfiguracaoLoja config, ConfiguracaoLojaDTO dto) {

        if (dto.getLayoutProdutos() != null) {
            config.setLayoutProdutos(dto.getLayoutProdutos());
        }

        if (dto.getProdutosLinha() != null) {
            config.setProdutosLinha(dto.getProdutosLinha());
        }

        if (dto.getMostrarPreco() != null) {
            config.setMostrarPreco(dto.getMostrarPreco());
        }

        if (dto.getBannerUrl() != null) {
            config.setBannerUrl(dto.getBannerUrl());
        }

        if (dto.getMostrarBanner() != null) {
            config.setMostrarBanner(dto.getMostrarBanner());
        }
    }

    /**
     * Campos liberados apenas no PRO.
     */
    private void atualizarCamposPro(ConfiguracaoLoja config, ConfiguracaoLojaDTO dto) {

        if (dto.getLayoutPagina() != null) {
            config.setLayoutPagina(dto.getLayoutPagina());
        }

        if (dto.getTextoDestaque() != null) {
            config.setTextoDestaque(dto.getTextoDestaque());
        }
    }

    private void aplicarRegrasPlanoFree(ConfiguracaoLoja config) {
        config.setLayoutPagina("padrao");
        config.setLayoutProdutos("grid");
        config.setProdutosLinha(4);

        config.setMostrarPreco(true);

        config.setMostrarBanner(false);
        config.setBannerUrl(null);
        config.setTextoDestaque(null);
    }

    private void aplicarRegrasPlanoPlus(ConfiguracaoLoja config) {
        config.setLayoutPagina("banner");
        config.setTextoDestaque(null);

        if (config.getProdutosLinha() == null || config.getProdutosLinha() < 2 || config.getProdutosLinha() > 4) {
            config.setProdutosLinha(4);
        }

        if (config.getLayoutProdutos() == null || config.getLayoutProdutos().isBlank()) {
            config.setLayoutProdutos("grid");
        }

        if (config.getMostrarBanner() == null) {
            config.setMostrarBanner(false);
        }

        if (config.getMostrarPreco() == null) {
            config.setMostrarPreco(true);
        }
    }

    private void aplicarRegrasPlanoPro(ConfiguracaoLoja config) {

        if (config.getLayoutPagina() == null || config.getLayoutPagina().isBlank()) {
            config.setLayoutPagina("vitrine");
        }

        if (config.getLayoutProdutos() == null || config.getLayoutProdutos().isBlank()) {
            config.setLayoutProdutos("grid");
        }

        if (config.getProdutosLinha() == null || config.getProdutosLinha() < 2 || config.getProdutosLinha() > 4) {
            config.setProdutosLinha(4);
        }

        if (config.getMostrarBanner() == null) {
            config.setMostrarBanner(false);
        }

        if (config.getMostrarPreco() == null) {
            config.setMostrarPreco(true);
        }

        if (config.getFontePrimaria() == null || config.getFontePrimaria().isBlank()) {
            config.setFontePrimaria("Arial");
        }

        if (config.getFonteSecundaria() == null || config.getFonteSecundaria().isBlank()) {
            config.setFonteSecundaria("Helvetica");
        }
    }

}

