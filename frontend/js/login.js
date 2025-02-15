// login.js

document.addEventListener("DOMContentLoaded", function () {
  const btnEstabelecimento = document.getElementById("btnEstabelecimento");
  const btnCliente = document.getElementById("btnCliente");
  const formSection = document.getElementById("formSection");

  // Exibe o formulário de login para Estabelecimento (Supermercado)
  btnEstabelecimento.addEventListener("click", function () {
    formSection.innerHTML = `
      <h3>Login - Estabelecimento</h3>
      <form id="loginEstabelecimentoForm">
        <label for="emailEstab">Email:</label>
        <input type="email" id="emailEstab" name="email" required>
        <br>
        <label for="senhaEstab">Senha:</label>
        <input type="password" id="senhaEstab" name="senha" required>
        <br>
        <button type="submit">Entrar</button>
      </form>
    `;
    const form = document.getElementById("loginEstabelecimentoForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("emailEstab").value;
      const senha = document.getElementById("senhaEstab").value;
      // Chama a função de login com role "Supermercado"
      loginUser(email, senha, "Supermercado");
    });
  });

  // Exibe o formulário de login para Cliente (Cozinha)
  btnCliente.addEventListener("click", function () {
    formSection.innerHTML = `
      <h3>Login - Cliente (Cozinha)</h3>
      <form id="loginClienteForm">
        <label for="emailCliente">Email:</label>
        <input type="email" id="emailCliente" name="email" required>
        <br>
        <label for="senhaCliente">Senha:</label>
        <input type="password" id="senhaCliente" name="senha" required>
        <br>
        <button type="submit">Entrar</button>
      </form>
    `;
    const form = document.getElementById("loginClienteForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("emailCliente").value;
      const senha = document.getElementById("senhaCliente").value;
      // Chama a função de login com role "Cozinha"
      loginUser(email, senha, "Cozinha");
    });
  });

  // Função para realizar o login via API
  async function loginUser(email, senha, role) {
    const data = {
      email: email,
      password: senha, // Deve ser "password" para teste
      role: role      // Envia a role para controle (opcional)
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
        // Armazena o token retornado, se necessário
        localStorage.setItem("token", result.Token);
        // Redireciona para a página de acordo com a role do usuário
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
