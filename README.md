# 📦 Plataforma de Redistribuição de Produtos

## 📜 Descrição
Esta aplicação conecta **supermercados** e **cozinhas solidárias**, criando uma rede de impacto social, econômico e ambiental. O projeto está alinhado aos Objetivos de Desenvolvimento Sustentável (ODS) da ONU e busca dois grandes propósitos: Combater o Desperdício de Alimentos e Promover a Segurança Alimentar para Populações Vulneráveis.

Através da plataforma, supermercados podem disponibilizar produtos com desconto ou para doação, enquanto cozinhas solidárias cadastradas acessam esses alimentos, garantindo refeições de qualidade para comunidades em situação de vulnerabilidade. Dessa forma, reduzimos o desperdício e fortalecemos a solidariedade, transformando excedentes em esperança.

### 🎥 Demonstração (GIF)
![Demonstração do protótipo](frontend/img/prototipo.gif)

---

## 📂 Estrutura do Projeto
```plaintext
projeto/
├── frontend/
│   ├── index.html
│   ├── cadastro.html
│   ├── login.html
│   ├── cadastro.html
│   ├── perfil.html
│   ├── market.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── script.js
│   │   ├── cadastro.js
│   │   ├── login.js
│   │   ├── perfil.js
│   │   └── cadastro.js
│   └── images/
│       └── (coloque suas imagens aqui, por exemplo, logo.png)
├── backend/
│   ├── Authentication/
│   │   ├── AuthenticationHandler.cs
│   │   └── FakeAuthenticationHandler.cs
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── SupermercadosController.cs
│   │   ├── CozinhasController.cs
│   │   ├── ProdutosController.cs
│   │   └── TransacoesController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Models/
│   │   ├── Login.cs
│   │   ├── Produto.cs
│   │   ├── Cozinha.cs
│   │   ├── Supermercado.cs
│   │   └── Transacao.cs
│   ├── database/
│   │   └── appdata.db (gerado automaticamente após as migrations)
│   ├── Migrations/
│   ├── Properties/
│   ├── appsettings.Development.json
│   ├── appsettings.json
│   ├── backend.csproj
│   └── Program.cs
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** C# com ASP.NET Core
- **Banco de Dados:** SQLite
- **Autenticação:** Esquema Fake (para testes)
- **Controle de Versão:** Git

---

## 🚀 Instruções para Clonar e Executar o Projeto

### 📌 Pré-requisitos
- [.NET 6.0 SDK](https://dotnet.microsoft.com/download)
- [SQLite](https://www.sqlite.org/download.html) *(opcional para gerenciamento via ferramentas gráficas, pois o arquivo é gerado automaticamente)*
- Um editor de código (ex.: **Visual Studio Code**)
- Um servidor web para o frontend (ex.: **Live Server**, que pode ser instalado como extensão no VS Code)

### 🔹 Clonando o Repositório
```bash
git clone https://github.com/antonioreal97/food4.git
cd food4
```

### ⚙️ Executando o Backend
1. Navegue até a pasta `backend`:
   ```bash
   cd backend
   ```
2. Restaure os pacotes NuGet:
   ```bash
   dotnet restore
   ```
3. Caso ainda não tenha criado o banco de dados, crie a migration inicial e atualize o banco:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```
4. Execute a aplicação:
   ```bash
   dotnet run
   ```
5. A API ficará disponível em [`http://localhost:5207`](http://localhost:5207) (ou outra porta definida). 
### 🎨 Executando o Frontend
1. Abra a pasta `frontend` no seu editor de código.
2. Utilize uma ferramenta de **Live Server** *(por exemplo, a extensão Live Server do VS Code)* ou abra manualmente o arquivo `index.html` no navegador.
3. A partir do `index.html`, você poderá navegar para as páginas de **login** e **cadastro**.

---
## 📚 Documentação do Projeto

Para conhecer mais detalhes sobre o desenvolvimento e a contextualização do projeto, acesse os documentos abaixo:

- [1 Documentação de Contexto](docs/1Documentacao_de_Contexto.md)
- [2 Especificações do Projeto](docs/2Especificacoes_do_Projeto.md)

---

## ℹ️ Observações Importantes
### 🔐 Autenticação Fake:
O backend está configurado para utilizar um esquema de **autenticação fake** para testes. Em produção, será necessário implementar um esquema de autenticação real.

### 🔄 Atualização dos Dados:
Os formulários de **cadastro** e **login** do frontend se comunicam com os endpoints do backend utilizando o método `fetch`. Certifique-se de que a URL (`http://localhost:5207/api/...`) esteja correta e que o backend esteja rodando.

### 🗄️ Banco de Dados:
A string de conexão no `appsettings.json` aponta para o arquivo `./database/appdata.db`. Caso necessário, **crie a pasta `database` manualmente** na pasta `backend` antes de executar as migrations.

---

## 📞 Contato e Suporte
Se precisar de ajuda ou quiser contribuir com o projeto, entre em contato pelo email **suporte@nossaplataforma.com**. 

Agradecemos seu interesse em ajudar a reduzir o desperdício de alimentos! 🌱🥗
