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
            
            // Primeiro registra o usuário
            handleUserRegistration({
                name: document.getElementById("nomeEstab").value,
                email: document.getElementById("emailEstab").value,
                password: document.getElementById("senhaEstab").value,
                userType: "Supermercado"
            }, function(userData) {
                // Depois registra os dados do supermercado
                handleEntityRegistration('supermercados', {
                    nome: document.getElementById("nomeEstab").value,
                    endereco: document.getElementById("enderecoEstab").value,
                    contato: document.getElementById("contatoEstab").value,
                    email: document.getElementById("emailEstab").value,
                    cnpj: "12345678901234" // Valor padrão para fins de demonstração
                }, userData);
            });
        });
    }
  
    function setupClienteForm() {
        const cadClienteForm = document.getElementById("cadClienteForm");
        cadClienteForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Captura os valores dos campos uma única vez
            const nomeCozinha = document.getElementById("nomeCliente").value;
            const enderecoCozinha = document.getElementById("enderecoCliente").value;
            const contatoCozinha = document.getElementById("contatoCliente").value;
            const registroCozinha = document.getElementById("registroCliente").value;
            const emailCozinha = document.getElementById("emailCliente").value;
            const senhaCozinha = document.getElementById("senhaCliente").value;
            
            // Valida os dados antes de enviar
            if (!nomeCozinha || !enderecoCozinha || !contatoCozinha || !registroCozinha || !emailCozinha || !senhaCozinha) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }
            
            console.log("Iniciando cadastro da cozinha com email:", emailCozinha);
            
            // Primeiro registra o usuário
            handleUserRegistration({
                name: nomeCozinha,
                email: emailCozinha,
                password: senhaCozinha,
                userType: "Cozinha"
            }, function(userData) {
                console.log("Usuário registrado com sucesso, registrando cozinha agora...");
                
                // Depois registra os dados da cozinha
                handleEntityRegistration('cozinhas', {
                    nome: nomeCozinha,
                    endereco: enderecoCozinha,
                    contato: contatoCozinha,
                    registroGoverno: registroCozinha,
                    email: emailCozinha
                }, userData);
            });
        });
    }
  
    // Função para registrar o usuário (sem requisição HEAD)
    function handleUserRegistration(userData, callback) {
        console.log("Registrando usuário:", userData);
        
        const serverUrl = 'http://localhost:5207/api/auth/register';
        console.log(`Tentando conectar a: ${serverUrl}`);
  
        // Faz diretamente o POST
        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            // Clone a resposta para poder lê-la múltiplas vezes (debug)
            const clonedResponse = response.clone();
            
            clonedResponse.text().then(rawResponse => {
                console.log("Resposta bruta do servidor:", rawResponse);
                try {
                    const jsonResponse = JSON.parse(rawResponse);
                    console.log("Resposta JSON do servidor:", jsonResponse);
                } catch (e) {
                    console.log("A resposta não é um JSON válido");
                }
            });
            
            if (!response.ok) {
                // Tenta ler como JSON primeiro
                return response.json().catch(() => {
                    // Se falhar ao ler como JSON, tenta ler como texto
                    return response.text().then(text => ({ message: text }));
                }).then(errData => {
                    throw new Error(errData.message || 'Erro no registro de usuário');
                });
            }
            return response.json();
        })
        .then(result => {
            console.log("Resposta do registro:", result);
            
            // Manipulação de resultados diversos - adapta o resultado para { Token, User }
            let processedResult = result;
            
            // Caso 1: O resultado é apenas um objeto User sem o token
            if (result && result.id && !result.Token && !result.User) {
                console.log("Convertendo resultado para o formato esperado");
                processedResult = {
                    Token: localStorage.getItem("token") || "token-placeholder",
                    User: {
                        Id: result.id,
                        Name: result.name,
                        Email: result.email,
                        UserType: result.userType || "Cozinha"
                    }
                };
            }
            
            // Caso 2: O token está presente mas os dados do usuário estão no nível raiz
            if (result && result.Token && !result.User && result.Id) {
                console.log("Estruturando dados do usuário");
                processedResult = {
                    Token: result.Token,
                    User: {
                        Id: result.Id,
                        Name: result.Name,
                        Email: result.Email,
                        UserType: result.UserType
                    }
                };
            }
            
            // Verificação final do processedResult
            if (!processedResult.Token) {
                console.warn("Token não encontrado, gerando temporário");
                processedResult.Token = "token-temporario-" + new Date().getTime();
            }
            
            if (!processedResult.User) {
                console.warn("Objeto User não encontrado, criando estrutura");
                processedResult.User = {
                    Id: result.id || result.Id || new Date().getTime(),
                    Name: result.name || result.Name || document.getElementById("nomeCliente").value || "Usuário",
                    Email: result.email || result.Email || document.getElementById("emailCliente").value || "email@exemplo.com",
                    UserType: result.userType || result.UserType || "Cozinha"
                };
            }
            
            // Armazena o token
            localStorage.setItem("token", processedResult.Token);
            
            // Armazena os dados do usuário
            localStorage.setItem("userId", processedResult.User.Id || "");
            localStorage.setItem("userName", processedResult.User.Name || "");
            localStorage.setItem("userEmail", processedResult.User.Email || "");
            localStorage.setItem("userType", processedResult.User.UserType || "");
            console.log("UserType armazenado:", processedResult.User.UserType);
            
            // Chama o callback para registrar a entidade
            callback(processedResult);
        })
        .catch(error => {
            console.error('Erro:', error);
            
            // Mensagem mais amigável para o erro de Failed to fetch
            if (error.message === 'Failed to fetch') {
                alert('Não foi possível conectar ao servidor. Verifique se o servidor backend está em execução em http://localhost:5207');
            } else {
                alert('Erro no registro de usuário: ' + error.message);
            }
        });
    }
  
    // Função para registrar a entidade (supermercado ou cozinha)
    function handleEntityRegistration(endpoint, entityData, userData) {
        console.log("Registrando entidade:", endpoint, entityData);
        console.log("Dados do usuário para registro:", userData);
        
        // Verifica se os dados do usuário são válidos
        if (!userData || !userData.Token || !userData.User) {
            console.error("Dados de usuário inválidos:", userData);
            alert("Erro nos dados do usuário. Por favor, tente novamente.");
            return;
        }
        
        fetch(`http://localhost:5207/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.Token}`
            },
            body: JSON.stringify(entityData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().catch(() => {
                    // Se falhar ao ler como JSON, tenta ler como texto
                    return response.text().then(text => ({ message: text }));
                }).then(errData => {
                    throw new Error(errData.message || 'Erro no cadastro da entidade');
                });
            }
            return response.json();
        })
        .then(result => {
            console.log("Resposta do registro da entidade:", result);
            
            // Verifica se o resultado contém um ID
            if (result && result.id) {
                // Salva o ID da entidade
                const userType = userData.User.UserType || localStorage.getItem("userType");
                
                if (userType === 'Supermercado') {
                    localStorage.setItem("supermercadoId", result.id);
                } else {
                    localStorage.setItem("cozinhaId", result.id);
                }
                
                alert('Cadastro realizado com sucesso!');
                
                // Redireciona conforme o tipo de usuário
                if (userType === "Supermercado") {
                    window.location.href = "perfil.html";
                } else {
                    window.location.href = "market.html";
                }
            } else {
                console.error("Resposta sem ID:", result);
                alert("Erro no registro da entidade. Resposta inválida do servidor.");
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro no cadastro: ' + error.message);
        });
    }
  });
  