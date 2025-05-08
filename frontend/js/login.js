document.addEventListener("DOMContentLoaded", function () {
  // Seleciona os elementos principais
  const btnEstabelecimento = document.getElementById("btnEstabelecimento");
  const btnCliente = document.getElementById("btnCliente");
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
  if (btnEstabelecimento) {
    btnEstabelecimento.addEventListener("click", function () {
      showLoginForm("Supermercado");
    });
  }

  if (btnCliente) {
    btnCliente.addEventListener("click", function () {
      showLoginForm("Cozinha");
    });
  }

  // Função para realizar o login via API
  async function loginUser(email, senha, role) {
    const data = {
      email: email,
      password: senha
    };
    
    console.log(`Tentando login como ${role} com email: ${email}`);

    try {
      console.log('Enviando dados:', JSON.stringify(data));
      
      const response = await fetch("https://localhost:7223/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      console.log('Status da resposta:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Resposta do login:", result);
        console.log("Tipo esperado:", role);
        console.log("Conteúdo completo do user:", JSON.stringify(result.user, null, 2));

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
            console.log("SupermercadoId armazenado:", result.user.SupermercadoId);
          } else {
            console.log("SupermercadoId não disponível na resposta");
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
        let errorMessage = "Login falhou. ";
        
        try {
          const errorData = await response.json();
          console.log("Erro detalhado:", errorData);
          
          if (errorData && errorData.message) {
            errorMessage += errorData.message;
          } else {
            errorMessage += "Verifique suas credenciais.";
          }
        } catch (jsonError) {
          console.error("Erro ao processar resposta de erro:", jsonError);
          
          if (response.status === 401) {
            errorMessage += "Credenciais inválidas.";
          } else if (response.status === 404) {
            errorMessage += "Servidor não encontrou o endpoint de login.";
          } else if (response.status === 500) {
            errorMessage += "Erro interno no servidor. Tente novamente mais tarde.";
          } else {
            errorMessage += `Código de erro: ${response.status}`;
          }
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      let errorMessage = "Erro ao realizar login. ";
      
      if (error.message && error.message.includes("Failed to fetch")) {
        errorMessage += "Não foi possível conectar ao servidor. Verifique se o backend está em execução.";
      } else {
        errorMessage += "Verifique sua conexão com o servidor.";
      }
      
      alert(errorMessage);
    }
  }

  // Código removido do botão limpar dados pois foi substituído pelo botão dinâmico
});
