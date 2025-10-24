# UrbanNest - Sistema de Gerenciamento de Imóveis

## 📋 Descrição do Projeto

O UrbanNest é uma plataforma web completa para gerenciamento de imóveis para aluguel, desenvolvida como trabalho acadêmico para a disciplina de **Análise e Projeto de Sistemas**. O sistema simula um motor de busca similar ao Google, mas especializado em imóveis urbanos.

## 🎯 Objetivos Acadêmicos

- Demonstrar conceitos de **arquitetura de sistemas**
- Implementar **modelagem de dados** relacional
- Integrar **APIs externas** (Google Maps)
- Aplicar **padrões de desenvolvimento web**
- Criar **interface responsiva** e moderna

## 🏗️ Arquitetura do Sistema

### Frontend
- **HTML5** - Estrutura semântica das páginas
- **CSS3** - Estilização responsiva e moderna
- **JavaScript** - Interatividade e consumo de APIs

### Backend
- **Python Flask** - Framework web minimalista
- **SQLite** - Banco de dados relacional
- **SQLAlchemy** - ORM para mapeamento objeto-relacional

### Integração Externa
- **Google Maps API** - Mapas interativos (conceitual)
- **Google Custom Search** - Busca externa (conceitual)

## 📁 Estrutura do Projeto

```
urban_nest_complete/
├── src/
│   ├── main.py                 # Aplicação Flask principal
│   ├── models/                 # Modelos de dados
│   │   ├── user.py            # Modelo de usuário
│   │   ├── imovel.py          # Modelo de imóvel
│   │   └── agendamento.py     # Modelo de agendamento
│   ├── routes/                # Rotas da API
│   │   ├── user.py            # Rotas de usuário
│   │   ├── imoveis.py         # Rotas de imóveis
│   │   └── agendamentos.py    # Rotas de agendamentos
│   ├── database/              # Banco de dados
│   │   └── app.db             # SQLite database
│   └── static/                # Arquivos estáticos
│       ├── index.html         # Página inicial
│       ├── imoveis.html       # Listagem de imóveis
│       ├── detalhes_imovel.html # Detalhes do imóvel
│       ├── cadastro_imovel.html # Cadastro de imóvel
│       ├── sobre.html         # Sobre nós
│       ├── contato.html       # Contato
│       ├── termos.html        # Termos e privacidade
│       ├── styles.css         # Estilos globais
│       ├── script.js          # JavaScript global
│       └── urban_nest_logo.png # Logo do sistema
└── requirements.txt           # Dependências Python
```

## 🌐 Páginas Implementadas

### 1. **index.html** - Página Inicial
- Interface similar ao Google
- Barra de pesquisa centralizada
- Logo personalizado UrbanNest
- Links de navegação

### 2. **imoveis.html** - Listagem de Imóveis
- Grid responsivo de imóveis
- Filtros avançados (tipo, preço, quartos, etc.)
- Paginação
- Integração com API backend

### 3. **detalhes_imovel.html** - Detalhes do Imóvel
- Galeria de imagens
- Informações completas do imóvel
- Mapa de localização (Google Maps)
- Formulário de agendamento de visita
- Botões de compartilhamento

### 4. **cadastro_imovel.html** - Cadastro de Imóvel
- Formulário completo para proprietários
- Upload de imagens
- Validação de dados
- Características e comodidades

### 5. **sobre.html** - Sobre Nós
- História da empresa
- Equipe e valores
- Tecnologias utilizadas
- Estatísticas do sistema

### 6. **contato.html** - Contato
- Formulário de contato
- Informações de contato
- FAQ (Perguntas Frequentes)
- Redes sociais

### 7. **termos.html** - Termos e Privacidade
- Termos de uso
- Política de privacidade
- Interface com abas
- Conteúdo jurídico completo

## 🗄️ Modelagem do Banco de Dados

### Entidades Principais

#### **Usuários**
```sql
- id (PK)
- nome
- email (UNIQUE)
- telefone
- senha_hash
- data_criacao
```

#### **Imóveis**
```sql
- id (PK)
- titulo
- descricao
- tipo (apartamento, casa, loft, etc.)
- preco
- quartos
- banheiros
- area
- endereco_completo
- latitude
- longitude
- status (disponível, alugado)
- proprietario_id (FK)
- data_criacao
```

#### **Agendamentos**
```sql
- id (PK)
- imovel_id (FK)
- nome_interessado
- email
- telefone
- data_visita
- hora_visita
- mensagem
- status (pendente, confirmado, cancelado)
- data_criacao
```

## 🔧 Funcionalidades Implementadas

### Frontend
- ✅ Design responsivo (mobile-first)
- ✅ Interface moderna e intuitiva
- ✅ Busca e filtros em tempo real
- ✅ Galeria de imagens interativa
- ✅ Formulários com validação
- ✅ Integração com mapas (conceitual)

### Backend
- ✅ API RESTful completa
- ✅ CRUD de imóveis
- ✅ Sistema de agendamentos
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ CORS habilitado

### Banco de Dados
- ✅ Modelagem relacional
- ✅ Dados de exemplo populados
- ✅ Relacionamentos entre entidades
- ✅ Índices para performance

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Python 3.8+
- pip (gerenciador de pacotes Python)

### Instalação
1. Extrair o arquivo ZIP
2. Navegar até o diretório do projeto
3. Criar ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```
4. Instalar dependências:
   ```bash
   pip install -r requirements.txt
   ```

### Execução
1. Navegar até o diretório src:
   ```bash
   cd src
   ```
2. Executar a aplicação:
   ```bash
   python main.py
   ```
3. Acessar no navegador:
   ```
   http://localhost:5000
   ```

## 🔗 APIs e Integrações

### Google Maps API (Conceitual)
- **Finalidade**: Exibir localização dos imóveis
- **Implementação**: Placeholder com instruções
- **Uso Real**: Requer chave de API válida

### Google Custom Search (Conceitual)
- **Finalidade**: Busca externa de informações sobre bairros
- **Implementação**: Estrutura preparada
- **Uso Real**: Requer configuração de API

## 📊 Dados de Exemplo

O sistema vem populado com 6 imóveis de exemplo:
- Apartamentos em diferentes bairros de São Paulo
- Variação de preços, tamanhos e características
- Coordenadas geográficas para mapas
- Imagens placeholder

## 🎨 Design e UX

### Paleta de Cores
- **Primária**: #4285f4 (Azul Google)
- **Secundária**: #34a853 (Verde)
- **Accent**: #fbbc04 (Amarelo)
- **Neutros**: Tons de cinza

### Tipografia
- **Fonte**: System fonts (Segoe UI, Roboto, Arial)
- **Hierarquia**: Tamanhos responsivos
- **Legibilidade**: Alto contraste

### Responsividade
- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: 480px, 768px, 1024px
- **Grid System**: CSS Grid e Flexbox

## 🔒 Segurança

### Medidas Implementadas
- Validação de entrada de dados
- Sanitização de formulários
- Headers de segurança
- Tratamento de erros

### Considerações para Produção
- Autenticação de usuários
- Autorização de acesso
- Criptografia de senhas
- HTTPS obrigatório

## 📈 Possíveis Melhorias

### Funcionalidades Adicionais
- Sistema de login/cadastro
- Chat entre proprietários e interessados
- Sistema de avaliações
- Notificações por email
- Painel administrativo

### Tecnologias Avançadas
- React.js para frontend
- PostgreSQL para produção
- Redis para cache
- Docker para containerização
- CI/CD pipeline

## 📚 Conceitos Acadêmicos Demonstrados

### Análise de Sistemas
- Levantamento de requisitos
- Modelagem de processos
- Casos de uso
- Diagramas de fluxo

### Projeto de Sistemas
- Arquitetura em camadas
- Padrão MVC
- API RESTful
- Banco de dados relacional

### Engenharia de Software
- Versionamento com Git
- Documentação técnica
- Testes de funcionalidade
- Deploy e distribuição

## 👥 Equipe de Desenvolvimento

**Desenvolvedor Principal**: Sistema desenvolvido para fins acadêmicos
**Disciplina**: Análise e Projeto de Sistemas
**Instituição**: [Nome da Faculdade]
**Período**: 2025

## 📞 Suporte

Para dúvidas sobre o projeto:
- **Email**: contato@urbannest.com (fictício)
- **Documentação**: Este arquivo README
- **Código**: Comentários inline no código

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e acadêmicos.

---

**UrbanNest** - Conectando pessoas aos seus lares ideais desde 2025 🏠

