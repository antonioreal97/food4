// cadastro.js

document.addEventListener('DOMContentLoaded', function() {
    const btnCadEstabelecimento = document.getElementById("btnCadEstabelecimento");
    const btnCadCliente = document.getElementById("btnCadCliente");
    const cadastroSection = document.getElementById("cadastroSection");
  
    // Cadastro para Estabelecimento (Supermercado)
    btnCadEstabelecimento.addEventListener("click", function() {
      cadastroSection.innerHTML = `
        <h3>Cadastro - Estabelecimento (Supermercado)</h3>
        <form id="cadEstabForm">
          <label for="nomeEstab">Nome do Estabelecimento:</label>
          <input type="text" id="nomeEstab" name="nome" required>
          <br>
          <label for="enderecoEstab">Endereço:</label>
          <input type="text" id="enderecoEstab" name="endereco" required>
          <br>
          <label for="contatoEstab">Contato:</label>
          <input type="text" id="contatoEstab" name="contato" required>
          <br>
          <label for="emailEstab">Email:</label>
          <input type="email" id="emailEstab" name="email" required>
          <br>
          <label for="senhaEstab">Senha:</label>
          <input type="password" id="senhaEstab" name="senha" required>
          <br>
          <button type="submit">Cadastrar</button>
        </form>
      `;
      
      // Evento de submissão do formulário para Estabelecimento
      const cadEstabForm = document.getElementById("cadEstabForm");
      cadEstabForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const data = {
          nome: document.getElementById("nomeEstab").value,
          endereco: document.getElementById("enderecoEstab").value,
          contato: document.getElementById("contatoEstab").value,
          email: document.getElementById("emailEstab").value,
          senha: document.getElementById("senhaEstab").value
        };
        // Enviar dados para o endpoint de cadastro de supermercados
        fetch('http://localhost:5000/api/supermercados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
          alert('Cadastro realizado com sucesso!');
          // Redirecione ou limpe o formulário conforme necessário
        })
        .catch(error => console.error('Erro:', error));
      });
    });
  
    // Cadastro para Cliente (Cozinha)
    btnCadCliente.addEventListener("click", function() {
      cadastroSection.innerHTML = `
        <h3>Cadastro - Cliente (Cozinha)</h3>
        <form id="cadClienteForm">
          <label for="nomeCliente">Nome da Cozinha:</label>
          <input type="text" id="nomeCliente" name="nome" required>
          <br>
          <label for="enderecoCliente">Endereço:</label>
          <input type="text" id="enderecoCliente" name="endereco" required>
          <br>
          <label for="contatoCliente">Contato:</label>
          <input type="text" id="contatoCliente" name="contato" required>
          <br>
          <label for="registroCliente">Registro do Governo:</label>
          <input type="text" id="registroCliente" name="registroGoverno" required>
          <br>
          <label for="emailCliente">Email:</label>
          <input type="email" id="emailCliente" name="email" required>
          <br>
          <label for="senhaCliente">Senha:</label>
          <input type="password" id="senhaCliente" name="senha" required>
          <br>
          <button type="submit">Cadastrar</button>
        </form>
      `;
      
      // Evento de submissão do formulário para Cozinha
      const cadClienteForm = document.getElementById("cadClienteForm");
      cadClienteForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const data = {
          nome: document.getElementById("nomeCliente").value,
          endereco: document.getElementById("enderecoCliente").value,
          contato: document.getElementById("contatoCliente").value,
          registroGoverno: document.getElementById("registroCliente").value,
          email: document.getElementById("emailCliente").value,
          senha: document.getElementById("senhaCliente").value
        };
        // Enviar dados para o endpoint de cadastro de cozinhas
        fetch('http://localhost:5000/api/cozinhas/cadastrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
          alert('Cadastro realizado com sucesso!');
          // Redirecione ou limpe o formulário conforme necessário
        })
        .catch(error => console.error('Erro:', error));
      });
    });
  });
  