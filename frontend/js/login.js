// login.js

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    const btnEstabelecimento = document.getElementById("btnEstabelecimento");
    const btnCliente = document.getElementById("btnCliente");
    const formSection = document.getElementById("formSection");
  
    // Exibe o formulário de login para Estabelecimento (Supermercado)
    btnEstabelecimento.addEventListener("click", function() {
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
    });
  
    // Exibe o formulário de login para Cliente (Cozinha)
    btnCliente.addEventListener("click", function() {
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
    });
  });
  