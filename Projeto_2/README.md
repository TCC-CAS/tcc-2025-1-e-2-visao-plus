# VisionPlus+ 👓

*VisionPlus+* é uma plataforma web voltada à digitalização de óticas de pequeno e médio porte, oferecendo um ambiente centralizado para aproximar consumidores e estabelecimentos ópticos por meio de catálogo digital, localização de lojas, solicitação de cotações, gestão de produtos, cupons promocionais, reserva e acompanhamento de atendimentos.

A solução atua como um hub especializado para o setor óptico, permitindo que óticas independentes tenham presença digital estruturada sem depender de infraestrutura própria complexa. Para o consumidor, a aplicação facilita a busca por óticas, produtos e condições de atendimento em um único ambiente digital.

---

## 📌 Sobre o Projeto

O VisionPlus+ foi desenvolvido como Trabalho de Conclusão de Curso do Bacharelado em Sistemas de Informação do Centro Universitário Senac.

A proposta nasce a partir da dificuldade enfrentada por óticas independentes para manter presença digital ativa, divulgar seus produtos, receber solicitações online e competir com grandes redes. A plataforma também atende consumidores que desejam localizar óticas próximas, consultar produtos, solicitar orçamentos e acompanhar reservas de forma prática.

A aplicação contempla três frentes principais:

- *Consumidor:* busca por óticas, visualização de produtos, solicitação de cotação, acompanhamento de propostas, reserva e interação com a loja.
- *Ótica:* gestão de dados da loja, catálogo de produtos, imagem institucional, cupons, respostas de cotação e acompanhamento de reservas.
- *Administração:* acompanhamento de usuários, lojas cadastradas e solicitações relacionadas à plataforma.

---

## 🎯 Objetivo

O objetivo do VisionPlus+ é reduzir os impactos da baixa presença digital de óticas de pequeno e médio porte, conectando consumidores e estabelecimentos em uma aplicação web acessível, centralizada e voltada ao setor óptico.

A solução contribui para:

- Ampliar a visibilidade digital de óticas locais.
- Facilitar o acesso de consumidores a produtos e serviços ópticos.
- Apoiar a comparação de opções antes da visita presencial.
- Estruturar um canal digital de cotação e reserva.
- Fortalecer pequenos e médios empreendedores do setor.
- Incentivar a digitalização do comércio local.

---

## 🚀 Aplicação em Produção

### Front-end

A interface web está publicada na Vercel:

text
https://tcc-vision-plus.vercel.app


### Back-end

A API REST está publicada na Railway:

text
https://tccvisionplus-production.up.railway.app


### Banco de Dados

O banco de dados MySQL está hospedado na Railway.

---

## 🧩 Funcionalidades da Plataforma

### Cadastro e autenticação

- Cadastro de consumidores.
- Cadastro e solicitação de vínculo de loja.
- Login de usuários.
- Recuperação de senha por e-mail.
- Edição de dados cadastrais.
- Upload e atualização de foto de perfil.

### Perfil do consumidor

- Visualização dos dados do usuário.
- Atualização de informações pessoais.
- Acompanhamento de cotações enviadas.
- Visualização do status das propostas.
- Aprovação, rejeição ou cancelamento de cotações.
- Acompanhamento de reserva vinculada à cotação.
- Registro de interação com a loja.

### Página da ótica

- Exibição pública dos dados da loja.
- Visualização de imagem/logotipo.
- Apresentação de catálogo de produtos.
- Consulta de informações de localização.
- Acesso ao fluxo de cotação.
- Exibição de produtos e promoções vinculadas à loja.

### Catálogo de produtos

- Cadastro de produtos pela ótica.
- Edição de produtos.
- Remoção de produtos.
- Exibição de imagem do produto.
- Consulta de detalhes e informações comerciais.
- Organização da vitrine da loja.

### Cotação

- Solicitação de cotação pelo consumidor.
- Envio de informações do pedido para a ótica.
- Resposta da ótica com valor, prazo e observações.
- Controle de status da cotação.
- Aprovação ou rejeição da proposta pelo consumidor.
- Histórico básico do andamento da solicitação.

### Reserva e sinal

- Conversão da cotação aprovada em reserva.
- Exibição de valor de sinal quando aplicável.
- Confirmação manual do pagamento informado.
- Atualização do status para acompanhamento da reserva.
- Fluxo preparado para integração futura com gateway financeiro.

### Mensageria

- Comunicação vinculada ao processo de cotação.
- Troca de informações entre consumidor e ótica.
- Apoio ao esclarecimento de dúvidas sobre proposta, produto, prazo e reserva.

### Cupons e promoções

- Criação de cupons promocionais pela ótica.
- Edição de cupons.
- Ativação e desativação de promoções.
- Exibição de cupons relacionados à loja.
- Estrutura compatível com campanhas comerciais da plataforma.

### Administração

- Visualização de usuários cadastrados.
- Visualização de lojas cadastradas.
- Gestão básica de solicitações de loja.
- Edição de informações administrativas.
- Apoio à moderação e organização da plataforma.

---

## 🏪 Modelo de Planos para Óticas

O VisionPlus+ possui uma proposta comercial baseada em planos para óticas, permitindo que a plataforma opere com diferentes níveis de recursos, visibilidade e capacidade de divulgação.

A estrutura de planos organiza o acesso das lojas a funcionalidades como quantidade de anúncios, promoções, personalização da página, relatórios e destaque dentro da plataforma.

| Plano | Proposta | Recursos associados |
|---|---|---|
| Gratuito | Entrada inicial da ótica na plataforma | Cadastro da loja, presença digital básica e catálogo inicial |
| Plano 1 | Divulgação comercial simples | Recursos promocionais básicos e maior capacidade de exposição |
| Plano 2 | Presença ampliada | Mais anúncios, cupons, personalização e destaque intermediário |
| Plano 3 | Perfil premium | Maior visibilidade, relatórios, campanhas e recursos avançados |

Esse modelo permite que óticas menores iniciem com baixo custo e ampliem sua presença conforme a necessidade comercial.

---

## 💳 Pagamento e Reserva

O fluxo de reserva do VisionPlus+ está associado à aprovação de uma cotação.

Após o consumidor aprovar uma proposta, a ótica pode confirmar a reserva do produto ou atendimento. Quando houver necessidade de pagamento de sinal, a plataforma permite registrar essa etapa no processo, mantendo o acompanhamento do status da solicitação.

A solução considera um modelo preparado para integração com meios de pagamento digitais, especialmente Pix, permitindo evolução para cenários com:

- Código Pix copia e cola.
- Atualização automática da reserva.

Na versão acadêmica, o fluxo representa operacionalmente a jornada de sinal e reserva, mantendo a rastreabilidade do processo entre consumidor e ótica.

---

## 🧭 Fluxo Principal da Aplicação

mermaid
flowchart TD
    A[Consumidor acessa a plataforma] --> B[Realiza cadastro ou login]
    B --> C[Visualiza óticas e produtos]
    C --> D[Acessa a página da ótica]
    D --> E[Envia solicitação de cotação]
    E --> F[Ótica recebe a solicitação]
    F --> G[Ótica responde com proposta]
    G --> H[Consumidor avalia a proposta]
    H --> I{Proposta aprovada?}
    I -->|Não| J[Cotação rejeitada ou cancelada]
    I -->|Sim| K[Reserva ou sinal]
    K --> L[Ótica confirma a reserva]
    L --> M[Atendimento ou retirada na loja]


---

## 🧱 Estrutura Geral da Solução

text
Projeto_2/
├── API_Banco/
│   ├── controller/
│   ├── dto/
│   ├── model/
│   ├── repository/
│   ├── service/
│   ├── config/
│   └── pom.xml
│
├── JS/
│   ├── components/
│   ├── core/
│   └── pages/
│
├── css/
├── imgs/
│
├── index.html
├── Login.html
├── Cadastro.html
├── CadastroLoja.html
├── CentralLoja.html
├── CuponsLoja.html
├── PaginaLoja.html
├── PaginaPerfil.html
├── PaginaPrincipal.html
├── ProdutosLoja.html
└── RecuperarSenha.html


---

## 🛠️ Tecnologias Utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript
- Módulos JavaScript
- Vercel

### Back-end

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven
- API REST
- Railway

### Banco de Dados

- MySQL
- Hibernate/JPA

### Serviços e Integrações

- Cloudinary para armazenamento de imagens.
- BrasilAPI para consulta de CEP.
- Leaflet para recursos de mapa.
- SMTP Gmail para envio de e-mails.
- Railway para banco e API.
- Vercel para publicação do front-end.

---

## 🧠 Principais Entidades do Sistema

A modelagem da aplicação é organizada em entidades relacionadas à autenticação, loja, catálogo, cotações, reserva, cupons e comunicação.

Entidades principais:

- Usuário
- Loja
- Produto
- Cotação
- Mensagem
- Cupom
- Solicitação de loja
- Imagem
- Reserva
- Plano
- Pagamento
- Notificação

Essas entidades representam o ciclo principal da plataforma: cadastro, descoberta da loja, consulta de produtos, solicitação de cotação, resposta da ótica, reserva e acompanhamento.

---

## 📊 Visão de Arquitetura

mermaid
flowchart TD
    A[Usuário Consumidor] --> B[Front-end Vercel]
    C[Usuário Ótica] --> B
    D[Administrador] --> B

    B --> E[API REST Spring Boot]
    E --> F[MySQL Railway]
    E --> G[Cloudinary]
    E --> H[BrasilAPI]
    E --> I[SMTP Gmail]

    E --> J[Módulo de Usuários]
    E --> K[Módulo de Lojas]
    E --> L[Módulo de Produtos]
    E --> M[Módulo de Cotações]
    E --> N[Módulo de Cupons]
    E --> O[Módulo de Mensagens]
    E --> P[Módulo Administrativo]


---

## 🔐 Segurança e Privacidade

A plataforma considera boas práticas de segurança e proteção de dados, com foco em:

- Controle de acesso por tipo de usuário.
- Separação entre consumidor, ótica e administrador.
- Validação de dados no back-end.
- Criptografia de senha.
- Uso de variáveis de ambiente para dados sensíveis.
- Não versionamento de senhas, chaves privadas ou credenciais.
- Tratamento responsável de imagens e informações cadastrais.
- Aderência aos princípios da LGPD.

Dados como senha de banco, credenciais SMTP e chaves do Cloudinary devem permanecer em variáveis de ambiente e não devem ser inseridos diretamente no código versionado.

---

## ⚙️ Como Executar Localmente

### Pré-requisitos

Para executar a aplicação em ambiente local, é necessário possuir:

- Java 17 ou superior.
- Maven.
- MySQL.
- Git.
- VS Code ou IntelliJ IDEA.
- Extensão Live Server no VS Code, ou servidor estático equivalente.

---

## 🔧 Configuração do Back-end

Acesse a pasta do back-end:

bash
cd Projeto_2/API_Banco


Configure o arquivo application.properties ou as variáveis de ambiente com os dados necessários.

Exemplo de configuração local:

properties
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/visionplus
spring.datasource.username=root
spring.datasource.password=sua_senha

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

cloudinary.cloud-name=seu_cloud_name
cloudinary.api-key=sua_api_key
cloudinary.api-secret=seu_api_secret

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu_email
spring.mail.password=sua_senha_de_app
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true


Execute o back-end com Maven:

bash
./mvnw spring-boot:run


Ou, em ambientes Windows:

bash
mvnw spring-boot:run


Também é possível executar com Maven instalado globalmente:

bash
mvn spring-boot:run


A API ficará disponível em:

text
http://localhost:8080


---

## 🗄️ Configuração do Banco de Dados

Crie um banco MySQL local:

sql
CREATE DATABASE visionplus;


O Hibernate/JPA pode criar ou atualizar as tabelas automaticamente, conforme a configuração:

properties
spring.jpa.hibernate.ddl-auto=update


Em produção, o banco utilizado está hospedado no Railway.

---

## 🎨 Configuração do Front-end

Acesse a pasta principal do projeto:

bash
cd Projeto_2


Abra o projeto no VS Code e execute o arquivo index.html com Live Server.

Também é possível abrir diretamente:

text
PaginaPrincipal.html


Para funcionamento completo, o front-end deve apontar para a API correta.

Em ambiente local:

text
http://localhost:8080


Em produção:

text
https://tccvisionplus-production.up.railway.app


---

## 🌐 Deploy

### Front-end na Vercel

A publicação do front-end utiliza a pasta principal do projeto contendo os arquivos HTML, CSS, JS e imagens.

Configuração utilizada:

text
Framework Preset: Other
Root Directory: Projeto_2
Build Command: vazio ou echo "static"
Output Directory: .


### Back-end na Railway

A publicação da API utiliza a pasta do projeto Spring Boot.

Configuração utilizada:

text
Root Directory: Projeto_2/API_Banco
Build Command: ./mvnw clean package -DskipTests
Start Command: java -jar target/*.jar


Variáveis de ambiente utilizadas no Railway:

text
PORT
MYSQLHOST
MYSQLPORT
MYSQLDATABASE
MYSQLUSER
MYSQLPASSWORD
EMAIL_USER
EMAIL_PASS
C_NAME
C_KEY
C_SECRET


---

## 🧪 Roteiro de Teste da Aplicação

### Fluxo consumidor

1. Acessar a aplicação pela URL da Vercel.
2. Criar uma conta de consumidor.
3. Realizar login.
4. Editar dados do perfil.
5. Atualizar foto de perfil.
6. Acessar a página principal.
7. Visualizar óticas e produtos.
8. Entrar na página de uma ótica.
9. Enviar uma solicitação de cotação.
10. Acompanhar a cotação pelo perfil.
11. Avaliar a proposta enviada pela loja.
12. Aprovar, rejeitar ou cancelar a cotação.
13. Acompanhar o status de reserva.

### Fluxo ótica

1. Realizar login com usuário vinculado à loja.
2. Acessar a central da loja.
3. Atualizar dados da loja.
4. Atualizar imagem/logotipo.
5. Cadastrar produtos.
6. Editar produtos existentes.
7. Criar ou gerenciar cupons.
8. Visualizar cotações recebidas.
9. Responder uma cotação.
10. Confirmar reserva ou sinal.
11. Finalizar atendimento.

### Fluxo administrador

1. Realizar login como administrador.
2. Acessar painel administrativo.
3. Visualizar usuários.
4. Visualizar lojas.
5. Gerenciar solicitações de loja.
6. Apoiar a manutenção dos dados da plataforma.

---

## 📈 Modelo de Sustentabilidade

O VisionPlus+ possui proposta de sustentabilidade baseada em planos para óticas, recursos promocionais e ampliação da visibilidade dentro da plataforma.

A estrutura comercial permite combinar:

- Plano gratuito de entrada.
- Planos pagos com maior exposição.
- Cupons e promoções.
- Destaque de lojas.
- Recursos adicionais para gestão da loja.
- Relatórios e indicadores comerciais.
- Possível intermediação em reservas e pagamentos.

Esse modelo busca equilibrar inclusão digital para pequenas óticas e viabilidade econômica da plataforma.

---

## ♿ Acessibilidade e Usabilidade

A aplicação considera princípios de usabilidade e acessibilidade para facilitar o uso por consumidores e lojistas.

Pontos contemplados:

- Interface web simples.
- Navegação por páginas e seções.
- Botões de ação visíveis.
- Mensagens de retorno ao usuário.
- Organização por perfil de acesso.
- Contraste visual e hierarquia de informações.
- Uso de formulários objetivos.
- Fluxo de cotação guiado.

---

## 📌 Status Acadêmico

Este repositório representa a entrega acadêmica do projeto VisionPlus+, contemplando documentação, código-fonte, front-end publicado, back-end publicado e banco de dados em ambiente de produção.

A aplicação demonstra o fluxo principal da solução proposta: cadastro, autenticação, loja, catálogo, cotação, resposta, reserva, comunicação e administração básica.

---

## 👥 Integrantes

- Ana Luiza de Melo Irenio
- Gabriel Lucio de Oliveira
- Giovanna Alves Cezar

Orientador:

- Prof. José Martinele Alves Silva

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos como Trabalho de Conclusão de Curso do Bacharelado em Sistemas de Informação do Centro Universitário Senac.

O uso, reprodução ou adaptação do código deve preservar a finalidade acadêmica e a autoria original do projeto.