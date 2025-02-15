// cadastro.js
document.addEventListener('DOMContentLoaded', function() {
  const btnCadEstabelecimento = document.getElementById("btnCadEstabelecimento");
  const btnCadCliente = document.getElementById("btnCadCliente");
  const cadastroSection = document.getElementById("cadastroSection");
  const typeSelection = document.getElementById("typeSelection"); // Alterado

  // Verificar se elementos existem
  if(!btnCadEstabelecimento || !btnCadCliente || !cadastroSection || !typeSelection) {
    console.error('Elementos não encontrados! Verifique os IDs no HTML');
    return;
  }

  // Função para exibir o formulário
  function showForm(html) {
      typeSelection.classList.add('hidden'); // Alterado
      cadastroSection.innerHTML = html;
      cadastroSection.classList.remove('hidden');
  }

  // Função para voltar às opções
  function showOptions() {
      typeSelection.classList.remove('hidden'); // Alterado
      cadastroSection.classList.add('hidden');
  }

  // Adiciona botão Voltar nos formulários
  function addBackButton(formId) {
      const backButton = document.createElement('button');
      backButton.type = 'button';
      backButton.textContent = 'Voltar';
      backButton.className = 'btn voltar-btn';
      backButton.onclick = showOptions;
      
      const form = document.getElementById(formId);
      form.appendChild(backButton);
  }

  // Cadastro para Estabelecimento (Supermercado)
  btnCadEstabelecimento.addEventListener("click", function() {
      showForm(`
          <div class="form-container">
              <h3>Cadastro - Estabelecimento (Supermercado)</h3>
              <form id="cadEstabForm">
                  <div class="form-group">
                      <label for="nomeEstab">Nome do Estabelecimento:</label>
                      <input type="text" id="nomeEstab" name="nome" required>
                  </div>
                  <div class="form-group">
                      <label for="enderecoEstab">Endereço:</label>
                      <input type="text" id="enderecoEstab" name="endereco" required>
                  </div>
                  <div class="form-group">
                      <label for="contatoEstab">Contato:</label>
                      <input type="text" id="contatoEstab" name="contato" required>
                  </div>
                  <div class="form-group">
                      <label for="emailEstab">Email:</label>
                      <input type="email" id="emailEstab" name="email" required>
                  </div>
                  <div class="form-group">
                      <label for="senhaEstab">Senha:</label>
                      <input type="password" id="senhaEstab" name="senha" required>
                  </div>
                  <button type="submit" class="btn">Cadastrar</button>
              </form>
          </div>
      `);
      
      addBackButton('cadEstabForm');
      setupEstabForm();
  });

  // Cadastro para Cliente (Cozinha)
  btnCadCliente.addEventListener("click", function() {
      showForm(`
          <div class="form-container">
              <h3>Cadastro - Cliente (Cozinha)</h3>
              <form id="cadClienteForm">
                  <div class="form-group">
                      <label for="nomeCliente">Nome da Cozinha:</label>
                      <input type="text" id="nomeCliente" name="nome" required>
                  </div>
                  <div class="form-group">
                      <label for="enderecoCliente">Endereço:</label>
                      <input type="text" id="enderecoCliente" name="endereco" required>
                  </div>
                  <div class="form-group">
                      <label for="contatoCliente">Contato:</label>
                      <input type="text" id="contatoCliente" name="contato" required>
                  </div>
                  <div class="form-group">
                      <label for="registroCliente">Registro do Governo:</label>
                      <input type="text" id="registroCliente" name="registroGoverno" required>
                  </div>
                  <div class="form-group">
                      <label for="emailCliente">Email:</label>
                      <input type="email" id="emailCliente" name="email" required>
                  </div>
                  <div class="form-group">
                      <label for="senhaCliente">Senha:</label>
                      <input type="password" id="senhaCliente" name="senha" required>
                  </div>
                  <button type="submit" class="btn">Cadastrar</button>
              </form>
          </div>
      `);
      
      addBackButton('cadClienteForm');
      setupClienteForm();
  });

  function setupEstabForm() {
      const cadEstabForm = document.getElementById("cadEstabForm");
      cadEstabForm.addEventListener("submit", function(e) {
          e.preventDefault();
          handleRegistration('supermercados', {
              nome: document.getElementById("nomeEstab").value,
              endereco: document.getElementById("enderecoEstab").value,
              contato: document.getElementById("contatoEstab").value,
              email: document.getElementById("emailEstab").value,
              senha: document.getElementById("senhaEstab").value
          });
      });
  }

  function setupClienteForm() {
      const cadClienteForm = document.getElementById("cadClienteForm");
      cadClienteForm.addEventListener("submit", function(e) {
          e.preventDefault();
          handleRegistration('cozinhas/cadastrar', {
              nome: document.getElementById("nomeCliente").value,
              endereco: document.getElementById("enderecoCliente").value,
              contato: document.getElementById("contatoCliente").value,
              registroGoverno: document.getElementById("registroCliente").value,
              email: document.getElementById("emailCliente").value,
              senha: document.getElementById("senhaCliente").value
          });
      });
  }

  function handleRegistration(endpoint, data) {
      fetch(`http://localhost:5207/api/${endpoint}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => {
          if (!response.ok) throw new Error('Erro no cadastro');
          return response.json();
      })
      .then(result => {
          alert('Cadastro realizado com sucesso!');
          window.location.href = 'login.html';
      })
      .catch(error => {
          console.error('Erro:', error);
          alert('Erro no cadastro: ' + error.message);
      });
  }
});