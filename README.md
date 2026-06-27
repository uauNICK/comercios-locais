# 🏪 Plataforma Genérica para Comércios Locais (GlowStyle)

Uma plataforma web moderna, responsiva e altamente customizável desenvolvida para comércios locais (como barbearias, salões de beleza, manicures, estéticas, spas, entre outros). O sistema conta com uma área de cliente para agendamentos e reservas com integração direta ao WhatsApp, além de um Painel Administrativo completo para controle de catálogo, ajustes visuais e temas.

---

## 🚀 Demonstração & Portfólio

Este projeto foi construído utilizando tecnologias nativas da web (**HTML5**, **CSS3** e **JavaScript**), garantindo carregamento instantâneo, compatibilidade total e hospedagem simplificada em servidores de arquivos estáticos como a **Vercel** ou **GitHub Pages**.

- **Hospedagem Recomendada:** Vercel.
- **Banco de Dados:** Emulado no cliente utilizando o navegador (`localStorage`), preservando dados de agendamentos, produtos e preferências de forma persistente sem custos de infraestrutura backend.

---

## ✨ Funcionalidades Principais

### 👤 Área do Cliente (Landing Page)
- **Banner Customizado:** Banner do comércio no topo com suporte a imagens customizadas.
- **Catálogo Interativo:** Filtro rápido entre **Serviços** e **Produtos**.
- **Agendamento Inteligente:** Sistema de marcação de horários que verifica a data escolhida e desabilita automaticamente horários conflitantes que já foram agendados.
- **Carrinho de Reservas:** Permite a reserva de múltiplos itens e cálculo automático de preço final.
- **Integração com WhatsApp:** Ao confirmar uma reserva ou agendamento, o cliente é direcionado automaticamente para o WhatsApp do estabelecimento com uma mensagem estruturada contendo todos os detalhes do pedido.
- **Localização e Mapa:** Seção dedicada ao endereço físico, horários de funcionamento e botão para rotas no Google Maps.

### ⚙️ Painel Administrativo (`/admin`)
- **Acesso Protegido:** Login administrativo protegido por senha (senha padrão de teste: `admin`).
- **Personalização de Identidade:** Altere o nome da loja, slogan, descrição, contatos e URLs das imagens em tempo real.
- **Gerenciador de Temas:** Alterne instantaneamente entre 4 temas profissionais integrados:
  - 💈 **Barbearia (Escuro):** Tons sóbrios com acentos dourados/amber.
  - 💅 **Salão (Rosa Gold):** Design elegante com fundo claro e acentos rose.
  - 🌿 **Spa Verde:** Tons de verde floresta e menta para ambientes de relaxamento.
  - ⚡ **Neon Cyber:** Estilo cyberpunk com tons roxos e acentos neon.
- **Controle de Catálogo:** Cadastro, edição, visualização e remoção (CRUD) de produtos e serviços.
- **Controle de Agendamentos:** Visualização de todos os agendamentos em formato de tabela, com botão de atalho rápido para iniciar conversa no WhatsApp do cliente correspondente.

---

## 🛠️ Tecnologias Utilizadas

- **Estruturação:** HTML5 semântico.
- **Estilização:** CSS3 puro, utilizando variáveis nativas para controle de temas, efeitos de Glassmorphism (`backdrop-filter`) e design totalmente responsivo (Mobile-First).
- **Lógica e Dados:** JavaScript Moderno (ES6+) para manipulação do DOM e persistência local (`localStorage`).
- **Ícones:** FontAwesome v6 (via CDN).
- **Tipografia:** Google Fonts (Outfit e Inter).

---

## 💻 Como Rodar Localmente

1. Faça o clone do repositório:
   ```bash
   git clone https://github.com/uauNICK/comercios-locais.git
   ```
2. Navegue até a pasta do projeto:
   ```bash
   cd comercios-locais
   ```
3. Abra o arquivo `index.html` em qualquer navegador (pode clicar duas vezes no arquivo no seu gerenciador de arquivos).

---

## ⚙️ Customização do Administrador

Ao abrir a plataforma no navegador:
1. Role a barra de navegação superior e clique em **Painel Admin**.
2. Digite a senha de acesso: **`admin`**.
3. Altere as configurações de branding e catálogo de acordo com as necessidades do comércio local.
4. Clique em **Salvar Alterações** e observe a landing page se ajustar dinamicamente em tempo real!
