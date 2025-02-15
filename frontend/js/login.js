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
    btnEstabelecimento.addEventListener("click", function () {
      showLoginForm("Supermercado");
    });
  
    btnCliente.addEventListener("click", function () {
      showLoginForm("Cozinha");
    });
  
    // Função para realizar o login via API
    async function loginUser(email, senha, role) {
      const data = {
        email: email,
        password: senha, // Para teste, o valor esperado deve ser "password"
        role: role      // Role: "Supermercado" ou "Cozinha"
      };
  
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
          alert("Login realizado com sucesso!");
          localStorage.setItem("token", result.Token);
          // Redireciona conforme o tipo de usuário
          if (role === "Supermercado") {
            window.location.href = "perfil.html";
          } else {
            window.location.href = "market.html";
          }
        } else {
          alert("Login falhou. Verifique suas credenciais.");
        }
      } catch (error) {
        console.error("Erro ao realizar login:", error);
        alert("Erro ao realizar login.");
      }
    }
  });
  