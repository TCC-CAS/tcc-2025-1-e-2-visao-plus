package com.Gabriel.API_Banco.service;

import com.Gabriel.API_Banco.model.Usuario;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ImageService {

    private final Cloudinary cloudinary;

    public ImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadProfileImage(MultipartFile file) throws IOException {

        validarImagem(file);

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "profile_pictures"
                )
        );

        return uploadResult.get("secure_url").toString();
    }

    public String uploadImage(MultipartFile file) throws IOException {

        validarImagem(file);

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "profile_pictures"
                )
        );

        return uploadResult.get("secure_url").toString();
    }

    private static final long TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

    private void validarImagem(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Arquivo de imagem é obrigatório.");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                (!contentType.equals("image/jpeg") &&
                        !contentType.equals("image/png") &&
                        !contentType.equals("image/jpg") &&
                        !contentType.equals("image/webp"))) {
            throw new RuntimeException("Formato inválido. Use JPG, PNG ou WEBP.");
        }

        if (file.getSize() > TAMANHO_MAXIMO_IMAGEM) {
            throw new RuntimeException("Arquivo maior que 5MB.");
        }
    }

    public void deleteImage(String imageUrl) {

        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        try {
            String publicId = extrairPublicId(imageUrl);

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            if (!"ok".equals(result.get("result"))) {
                System.out.println("Imagem não encontrada no Cloudinary.");
            }

            System.out.println("Resultado delete: " + result);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar imagem do Cloudinary", e);
        }
    }

    private String extrairPublicId(String imageUrl) {

        // Exemplo URL:
        // https://res.cloudinary.com/xxx/image/upload/v1712345678/lojas/abc123.jpg

        String[] partes = imageUrl.split("/upload/");

        if (partes.length < 2) {
            throw new RuntimeException("URL inválida do Cloudinary");
        }

        String caminhoComVersao = partes[1];
        // v1712345678/lojas/abc123.jpg

        String semVersao = caminhoComVersao.replaceFirst("v\\d+/", "");
        // lojas/abc123.jpg

        return semVersao.substring(0, semVersao.lastIndexOf("."));
        // lojas/abc123
    }

    public String uploadBannerLoja(MultipartFile file) throws IOException {

        validarImagem(file);

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "loja_banners"
                )
        );

        return uploadResult.get("secure_url").toString();
    }

}
