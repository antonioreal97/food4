document.addEventListener("DOMContentLoaded", function () {
  // Seleciona os elementos principais
  const btnEstabelecimento = document.getElementById("btnEstabelecimento");
  const btnCliente = document.getElementById("btnCliente");
  const btnLimparDados = document.getElementById("btnLimparDados");
  const typeSelection = document.getElementById("typeSelection");
  const formSection = document.getElementById("formSection");

  // Função para injetar o formulário de login e configurar o botão de voltar
  function showLoginForm(type) {
    // Define o título e o conteúdo do formulário conforme o tipo
    let title = "";
    let formId = "";
    let emailId = "";
    let senhaId = "";

    if (type === "Supermercado") {
      title = "Login - Estabelecimento";
      formId = "loginEstabelecimentoForm";
      emailId = "emailEstab";
      senhaId = "senhaEstab";
    } else if (type === "Cozinha") {
      title = "Login - Cliente (Cozinha)";
      formId = "loginClienteForm";
      emailId = "emailCliente";
      senhaId = "senhaCliente";
    }

    // Injeta o conteúdo do formulário na seção de login
    formSection.innerHTML = `
      <div class="auth-header">
        <button class="back-btn" id="backButton" type="button">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 class="auth-title" id="formTitle">${title}</h2>
      </div>
      <form id="${formId}">
        <label for="${emailId}">Email:</label>
        <input type="email" id="${emailId}" name="email" required>
        <br>
        <label for="${senhaId}">Senha:</label>
        <input type="password" id="${senhaId}" name="senha" required>
        <br>
        <button class="btn" type="submit">Entrar</button>
      </form>
    `;

    // Exibe o formulário e esconde a seleção de tipo
    formSection.classList.remove("hidden");
    typeSelection.classList.add("hidden");

    // Configura o evento do botão de voltar
    const backButton = document.getElementById("backButton");
    backButton.addEventListener("click", function () {
      formSection.classList.add("hidden");
      typeSelection.classList.remove("hidden");
    });

    // Adiciona o listener de submit ao formulário recém-inserido
    const form = document.getElementById(formId);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById(emailId).value;
      const senha = document.getElementById(senhaId).value;
      // Chama a função de login com a role definida
      loginUser(email, senha, type);
    });
  }

  // Eventos dos botões de seleção de tipo
  btnEstabelecimento.addEventListener("click", function () {
    showLoginForm("Supermercado");
  });

  btnCliente.addEventListener("click", function () {
    showLoginForm("Cozinha");
  });
  
  // Botão para limpar os dados de teste
  btnLimparDados.addEventListener("click", function() {
    localStorage.clear();
    alert("Todos os dados de login foram limpos! Você pode fazer um novo teste agora.");
  });

  // Função para realizar o login via API
  async function loginUser(email, senha, role) {
    const data = {
      email: email,
      password: senha
    };
    
    console.log(`Tentando login como ${role} com email: ${email}`);

    try {
      const response = await fetch("http://localhost:5207/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Resposta do login:", result);
        console.log("Tipo esperado:", role);

        // Usa a propriedade 'user' conforme a resposta do servidor
        if (result.user && !result.user.UserType) {
          result.user.UserType = role;
        }

        console.log("Tipo recebido:", result.user ? result.user.UserType : "nulo");
        console.log(`Role selecionada: ${role}`);
        console.log(`UserType do servidor: ${result.user ? result.user.UserType : "não definido"}`);
        console.log(`Tem SupermercadoId: ${result.user && result.user.SupermercadoId ? "Sim" : "Não"}`);
        console.log(`Tem CozinhaId: ${result.user && result.user.CozinhaId ? "Sim" : "Não"}`);
        
        // Verificação de tipo com lógica complementar
        let isValidUserType = false;
        if (role === "Supermercado" && (result.user.UserType === "Supermercado" || result.user.SupermercadoId)) {
          isValidUserType = true;
        } else if (role === "Cozinha" && (result.user.UserType === "Cozinha" || result.user.CozinhaId)) {
          isValidUserType = true;
        }
        
        // Se o tipo estiver correto, permite o login
        if (isValidUserType) {
          alert("Login realizado com sucesso!");
          
          // Armazena os dados do usuário no localStorage
          localStorage.setItem("token", result.token);
          localStorage.setItem("userId", result.user.Id);
          localStorage.setItem("userName", result.user.Name);
          localStorage.setItem("userEmail", result.user.Email);
          localStorage.setItem("userType", result.user.UserType);
          
          if (result.user.SupermercadoId) {
            localStorage.setItem("supermercadoId", result.user.SupermercadoId);
          }
          
          if (result.user.CozinhaId) {
            localStorage.setItem("cozinhaId", result.user.CozinhaId);
          }
          
          // Redireciona conforme o tipo de usuário
          if (role === "Supermercado") {
            window.location.href = "perfil.html";
          } else {
            window.location.href = "market.html";
          }
        } else {
          if (role === "Cozinha" && !result.user.CozinhaId) {
            alert("Sua conta não está completamente configurada como Cozinha. Por favor, entre em contato com o suporte.");
          } else {
            alert("Tipo de usuário incorreto. Por favor, selecione a opção correta para o seu tipo de conta.");
          }
          console.error("Mismatch de tipo de usuário: esperado", role, "recebido", result.user ? result.user.UserType : "nulo");
        }
      } else {
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.message) {
          alert(`Erro: ${errorData.message}`);
        } else {
          alert("Login falhou. Verifique suas credenciais.");
        }
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      alert("Erro ao realizar login. Verifique sua conexão com o servidor.");
    }
  }

  // Limpa os dados armazenados para testes
  btnLimparDados.addEventListener("click", function () {
    localStorage.clear();
    alert("Dados limpos!");
  });
});
