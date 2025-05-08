// perfil.js

document.addEventListener('DOMContentLoaded', async () => {
  // Verifica se o usuário está logado
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return;
  }

  // Função para decodificar token JWT sem bibliotecas externas
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Erro ao decodificar token JWT:', e);
      return null;
    }
  }

  // Tenta obter o userId e userType do token JWT
  let tokenData = parseJwt(token);
  console.log('Dados do token JWT:', tokenData);
  
  // Extrai o ID do usuário e tipo do token
  let userId = tokenData ? tokenData.nameid : null;
  let userType = tokenData ? tokenData.role : null;
  
  console.log('Extraído do JWT - userId:', userId, 'userType:', userType);
  
  // Fallback para localStorage, se necessário
  if (!userId) userId = localStorage.getItem('userId');
  if (!userType) userType = localStorage.getItem('userType');
  
  // Busca o ID do supermercado
  let supermercadoId = localStorage.getItem('supermercadoId');
  
  console.log('Dados finais para uso:');
  console.log('userType:', userType);
  console.log('userId:', userId);
  console.log('supermercadoId:', supermercadoId);
  
  // Verifica se o usuário é do tipo correto para esta página
  if (userType !== 'Supermercado') {
    alert('Esta página é apenas para supermercados.');
    window.location.href = 'login.html';
    return;
  }
  
  // Se não temos o ID de usuário, devemos obter do servidor
  if (!userId) {
    try {
      console.log('Tentando obter informações do usuário do servidor...');
      const response = await fetch('https://localhost:7223/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Dados do usuário obtidos do servidor:', userData);
        
        // Salva os dados do usuário no localStorage
        userId = userData.id;
        localStorage.setItem('userId', userId);
        
        if (userData.userType) {
          userType = userData.userType;
          localStorage.setItem('userType', userType);
        }
        
        if (userData.supermercadoId) {
          supermercadoId = userData.supermercadoId;
          localStorage.setItem('supermercadoId', supermercadoId);
        }
        
        console.log('Dados atualizados após consulta:');
        console.log('userType:', userType);
        console.log('userId:', userId);
        console.log('supermercadoId:', supermercadoId);
      } else {
        console.error('Erro ao obter informações do usuário:', response.status);
      }
    } catch (error) {
      console.error('Erro ao consultar informações do usuário:', error);
    }
  }
  
  // Se ainda não temos userId, não podemos continuar
  if (!userId) {
    console.error('Não foi possível obter o ID do usuário.');
    alert('Erro ao obter informações do usuário. Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }
  
  // Identificador para uso nas funções
  const supermercadoIdentificador = supermercadoId || userId;

  // Função para carregar e exibir as informações do supermercado logado
  async function loadProfile() {
    try {
      console.log(`Carregando perfil para identificador: ${supermercadoIdentificador}`);
      console.log(`userType: ${userType}, userId: ${userId}`);
      
      // Primeiro, tentamos buscar os dados atualizados do usuário
      // para garantir que temos o ID do supermercado mais recente
      try {
        console.log("Buscando informações atualizadas do usuário via /api/auth/me");
        const userResponse = await fetch('https://localhost:7223/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("Dados do usuário recebidos:", userData);
          
          // Atualiza as variáveis locais e o localStorage com os dados mais recentes
          if (userData.supermercadoId) {
            supermercadoId = userData.supermercadoId;
            localStorage.setItem('supermercadoId', supermercadoId);
            console.log(`SupermercadoId atualizado: ${supermercadoId}`);
          }
          
          // Se temos as informações do supermercado diretamente na resposta, podemos usá-las
          if (userData.supermercado) {
            console.log("Usando dados do supermercado da resposta /api/auth/me");
            const profile = userData.supermercado;
            
            // Atualiza os elementos do perfil
            updateProfileUI(profile);
            
            // Não precisa fazer outra requisição
            return;
          }
        } else {
          console.warn("Não foi possível obter dados atualizados do usuário", userResponse.status);
        }
      } catch (userError) {
        console.warn("Erro ao buscar informações do usuário:", userError);
      }
      
      // Se chegamos aqui, precisamos buscar os dados do supermercado diretamente
      
      // Usamos um endpoint diferente dependendo do tipo de identificador
      let url;
      if (supermercadoId) {
        // Se temos um ID de supermercado, usamos diretamente
        url = `https://localhost:7223/api/supermercados/${supermercadoId}`;
        console.log(`Buscando pelo ID do supermercado: ${supermercadoId}`);
      } else {
        // Se só temos ID de usuário, usamos o endpoint específico
        url = `https://localhost:7223/api/supermercados/usuario/${userId}`;
        console.log(`Buscando pelo ID do usuário: ${userId}`);
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log(`Status da resposta: ${response.status}`);
      
      if (response.ok) {
        const profile = await response.json();
        console.log('Dados do perfil recebidos:', profile);
        
        // Armazena o ID do supermercado no localStorage se ainda não estiver lá
        if (profile.id && !supermercadoId) {
          supermercadoId = profile.id;
          localStorage.setItem('supermercadoId', profile.id);
          console.log(`ID do supermercado ${profile.id} armazenado no localStorage`);
        }
        
        // Atualiza a UI com os dados do perfil
        updateProfileUI(profile);
      } else {
        // Tenta ler detalhes do erro
        try {
          const errorData = await response.json();
          console.error('Erro detalhado:', errorData);
          console.error(`Erro ao carregar informações do perfil: ${response.status} ${response.statusText}`);
          
          // Se o erro for porque o usuário não tem supermercado associado,
          // podemos tentar criar um novo usando a API
          if (response.status === 404 && errorData && errorData.message && 
              errorData.message.includes("não possui um supermercado associado")) {
            console.log("Tentando criar novo supermercado para o usuário...");
            
            try {
              // Chamamos novamente o endpoint que agora deve criar um novo supermercado
              const createResponse = await fetch(`https://localhost:7223/api/supermercados/usuario/${userId}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              
              if (createResponse.ok) {
                const newProfile = await createResponse.json();
                console.log("Novo supermercado criado:", newProfile);
                
                // Armazena o ID do novo supermercado
                if (newProfile.id) {
                  supermercadoId = newProfile.id;
                  localStorage.setItem('supermercadoId', newProfile.id);
                  console.log(`ID do novo supermercado ${newProfile.id} armazenado no localStorage`);
                }
                
                // Atualiza a UI com os dados do novo supermercado
                updateProfileUI(newProfile);
                
                // Recarrega a página para garantir que tudo está correto
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              } else {
                console.error("Falha ao criar novo supermercado:", createResponse.status);
              }
            } catch (createError) {
              console.error("Erro ao criar novo supermercado:", createError);
            }
          }
        } catch {
          console.error(`Erro ao carregar informações do perfil: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar informações do perfil:', error);
    }
  }
  
  // Função auxiliar para atualizar a UI com os dados do perfil
  function updateProfileUI(profile) {
    // Atualiza os elementos do perfil se existirem
    const profileNameElement = document.getElementById('profileName');
    if (profileNameElement) {
      profileNameElement.textContent = profile.nome || 'Nome não informado';
    }
    
    const profileAddressElement = document.getElementById('profileAddress');
    if (profileAddressElement) {
      profileAddressElement.textContent = profile.endereco || 'Endereço não informado';
    }
    
    // Preenche o campo de endereço de retirada com o valor atual (se disponível)
    const pickupAddressInput = document.getElementById('pickupAddress');
    if (pickupAddressInput) {
      pickupAddressInput.value = profile.pickupAddress || '';
    }
    
    // Preenche o campo de endereço de retirada no formulário de produto com o valor atual
    const productPickupInput = document.getElementById('productPickup');
    if (productPickupInput && profile.pickupAddress) {
      productPickupInput.value = profile.pickupAddress;
    } else if (productPickupInput && profile.endereco) {
      // Se não houver endereço de retirada, usa o endereço principal
      productPickupInput.value = profile.endereco;
    }
  }

  // Função para carregar e exibir os produtos cadastrados para o supermercado logado
  async function loadProducts() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    
    // Atualizamos o ID do supermercado caso tenha sido definido após a primeira chamada
    const currentSupermercadoId = localStorage.getItem('supermercadoId');
    
    console.log(`Carregando produtos. supermercadoId atual: ${currentSupermercadoId}`);
    
    productsContainer.innerHTML = '<div class="loading-state">Carregando produtos...</div>';
    
    try {
      // Usa o ID mais recente que temos
      const idToUse = currentSupermercadoId || supermercadoIdentificador;
      console.log(`Buscando produtos para o supermercado ID: ${idToUse}`);
      
      const response = await fetch(`https://localhost:7223/api/produtos/supermercado/${idToUse}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log(`Status da resposta de produtos: ${response.status}`);
      
      if (response.ok) {
        const products = await response.json();
        console.log(`Produtos recebidos: ${products.length}`);
        
        if (Array.isArray(products) && products.length > 0) {
          // Formata a data para o padrão brasileiro
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
          };
          
          // Determina a classe CSS para o status
          const getStatusClass = (status) => {
            if (!status) return 'status-disponivel';
            
            status = status.toLowerCase();
            if (status === 'doado') return 'status-doacao';
            if (status === 'vencido') return 'status-vencido';
            return 'status-desconto';
          };
          
          let html = '<div class="products-list">';
          
          products.forEach(product => {
            const formattedDate = formatDate(product.dataVencimento);
            const statusClass = getStatusClass(product.status);
            const pickupAddress = product.pickupAddress || 'Utilize o endereço principal do supermercado';
            
            html += `
              <div class="product-card">
                <div class="product-info">
                  <div class="product-name">${product.nome}</div>
                  <div class="product-details">
                    <span>Vence em: ${formattedDate}</span>
                    <span class="product-status ${statusClass}">${product.status || 'Disponível'}</span>
                    <span>Desconto: ${product.desconto}%</span>
                  </div>
                  <div class="pickup-address">
                    <small>Endereço para retirada: ${pickupAddress}</small>
                  </div>
                </div>
              </div>
            `;
          });
          
          html += '</div>';
          productsContainer.innerHTML = html;
        } else {
          productsContainer.innerHTML = '<div class="empty-state">Nenhum produto cadastrado. Use o formulário acima para adicionar seus primeiros produtos.</div>';
        }
      } else {
        const errorMessage = await response.text().catch(() => null);
        console.error('Erro na resposta do servidor:', errorMessage);
        productsContainer.innerHTML = '<div class="empty-state">Erro ao carregar produtos. Tente novamente mais tarde.</div>';
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      productsContainer.innerHTML = '<div class="empty-state">Erro ao carregar produtos. Verifique sua conexão.</div>';
    }
  }

  // Manipula o formulário de atualização do endereço de retirada
  const pickupForm = document.getElementById('pickupForm');
  if (pickupForm) {
    pickupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pickupAddress = document.getElementById('pickupAddress').value;
      
      if (!pickupAddress.trim()) {
        alert('Por favor, informe um endereço de retirada válido.');
        return;
      }
      
      try {
        // Obtém o ID mais recente do supermercado
        const currentSupermercadoId = localStorage.getItem('supermercadoId');
        
        // Se não temos o ID do supermercado, não podemos atualizar
        if (!currentSupermercadoId) {
          console.error('ID do supermercado não encontrado no localStorage');
          alert('Não foi possível identificar o supermercado. Por favor, atualize a página e tente novamente.');
          return;
        }
        
        console.log(`Atualizando endereço de retirada para supermercado ID: ${currentSupermercadoId}`);
        
        const response = await fetch(`https://localhost:7223/api/supermercados/${currentSupermercadoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ pickupAddress: pickupAddress })
        });
        
        console.log(`Status da resposta de atualização: ${response.status}`);
        
        if (response.ok) {
          const updatedSupermercado = await response.json();
          console.log('Supermercado atualizado:', updatedSupermercado);
          alert('Endereço de retirada atualizado com sucesso!');
          
          // Atualiza o campo do endereço de retirada no formulário de produto
          const productPickupField = document.getElementById('productPickup');
          if (productPickupField) {
            productPickupField.value = pickupAddress;
          }
          
          // Atualiza as informações do perfil
          loadProfile();
        } else {
          const errorData = await response.json().catch(() => null);
          console.error('Erro na resposta:', errorData);
          alert(`Falha ao atualizar o endereço de retirada: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Erro ao atualizar o endereço de retirada:', error);
        alert('Erro ao atualizar o endereço de retirada. Verifique a conexão com o servidor.');
      }
    });
  }

  // Adiciona preview da imagem
  const productImage = document.getElementById('productImage');
  const imagePreview = document.getElementById('imagePreview');

  if (productImage) {
    productImage.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview do produto">`;
          imagePreview.classList.add('active');
        }
        reader.readAsDataURL(file);
      }
    });
  }

  // Manipula o formulário de cadastro de produtos
  const productForm = document.getElementById('productForm');
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Obter todos os valores do formulário
      const productName = document.getElementById('productName').value.trim();
      const productExpiration = document.getElementById('productExpiration').value;
      const productDiscount = parseFloat(document.getElementById('productDiscount').value) || 0;
      const productPickup = document.getElementById('productPickup').value.trim();
      const productImage = document.getElementById('productImage').files[0];
      const donationCheckbox = document.getElementById('productDonation');
      const isDonation = donationCheckbox ? donationCheckbox.checked : false;

      // Validações básicas
      if (!productName) {
        alert('Por favor, informe o nome do produto.');
        return;
      }
      
      if (!productExpiration) {
        alert('Por favor, informe a data de vencimento.');
        return;
      }
      
      // Data de vencimento deve ser futura
      const expirationDate = new Date(productExpiration);
      const today = new Date();
      if (expirationDate < today) {
        alert('A data de vencimento não pode ser anterior à data atual.');
        return;
      }

      // Mostrar feedback visual de que o produto está sendo cadastrado
      const submitButton = productForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Cadastrando...';
      submitButton.disabled = true;
      
      // Obtém o ID mais atual do supermercado
      const currentSupermercadoId = localStorage.getItem('supermercadoId');
      
      // Se não temos o ID do supermercado, vamos tentar obter do servidor
      if (!currentSupermercadoId) {
        console.warn('ID do supermercado não encontrado no localStorage. Tentando obter do servidor...');
        
        try {
          const meResponse = await fetch('https://localhost:7223/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (meResponse.ok) {
            const userData = await meResponse.json();
            console.log("Dados do usuário obtidos:", userData);
            
            // Verifica se temos o ID do supermercado na resposta
            if (userData.supermercadoId) {
              // Salva no localStorage e usa para o cadastro
              localStorage.setItem('supermercadoId', userData.supermercadoId);
              console.log(`Encontrado e armazenado supermercadoId: ${userData.supermercadoId}`);
              
              // Continua com este ID
              const formData = prepareProductFormData(
                productName, 
                productExpiration, 
                productDiscount, 
                isDonation, 
                userData.supermercadoId,
                productPickup,
                productImage
              );
              
              await submitProductFormData(formData, submitButton, originalButtonText);
              return;
            } else {
              console.error('ID do supermercado não encontrado na resposta do servidor');
              alert('Não foi possível identificar o supermercado. Por favor, atualize a página e tente novamente.');
              
              // Restabelece o estado do botão
              submitButton.textContent = originalButtonText;
              submitButton.disabled = false;
              return;
            }
          } else {
            console.error('Erro ao obter dados do usuário:', meResponse.status);
          }
        } catch (error) {
          console.error('Erro ao tentar obter dados do usuário:', error);
        }
        
        // Se chegou aqui, não conseguiu obter o ID do supermercado
        alert('Não foi possível identificar o supermercado. Por favor, atualize a página e tente novamente.');
        
        // Restabelece o estado do botão
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        return;
      }
      
      console.log(`Cadastrando produto para supermercado ID: ${currentSupermercadoId}`);
      
      // Prepara e envia os dados do formulário
      const formData = prepareProductFormData(
        productName, 
        productExpiration, 
        productDiscount, 
        isDonation, 
        currentSupermercadoId,
        productPickup,
        productImage
      );
      
      await submitProductFormData(formData, submitButton, originalButtonText);
    });
  }
  
  // Função para preparar os dados do formulário
  function prepareProductFormData(name, expiration, discount, isDonation, supermercadoId, pickup, image) {
      const formData = new FormData();
      formData.append('nome', name);
      formData.append('dataVencimento', expiration);
      formData.append('desconto', isDonation ? 100 : discount);
      formData.append('status', isDonation ? "doado" : "disponível");
      formData.append('supermercadoId', supermercadoId);
      
      // Só inclui o endereço de retirada se foi fornecido
      if (pickup) {
        formData.append('pickupAddress', pickup);
      }
      
      // Adiciona a imagem se foi fornecida
      if (image) {
        formData.append('imagem', image);
      }
      
      // Debug para ver o que está sendo enviado
      console.log("FormData preparado com os seguintes valores:");
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      
      return formData;
  }
  
  // Função para enviar o formulário
  async function submitProductFormData(formData, submitButton, originalButtonText) {
    try {
      // Aviso ao usuário
      console.log("Enviando dados do produto para o servidor...");
      
      const response = await fetch('https://localhost:7223/api/produtos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      console.log(`Status da resposta: ${response.status}`);
      
      if (response.ok) {
        const newProduct = await response.json();
        console.log('Produto cadastrado:', newProduct);
        
        alert('Produto cadastrado com sucesso!');
        document.getElementById('productForm').reset();
        
        // Limpa o preview da imagem
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
          imagePreview.innerHTML = '';
          imagePreview.classList.remove('active');
        }
        
        // Recarrega a lista de produtos
        loadProducts();
      } else {
        // Tenta obter detalhes do erro
        const errorText = await response.text();
        console.error('Erro na resposta do servidor:', errorText);
        
        try {
          const errorObj = JSON.parse(errorText);
          if (errorObj.message) {
            alert(`Falha ao cadastrar o produto: ${errorObj.message}`);
          } else if (errorObj.errors) {
            // Se há erros de validação, mostra o primeiro
            const firstError = Object.values(errorObj.errors)[0][0];
            alert(`Erro de validação: ${firstError}`);
          } else {
            alert(`Falha ao cadastrar o produto: ${response.status} ${response.statusText}`);
          }
        } catch {
          alert(`Falha ao cadastrar o produto: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro de conexão ao cadastrar produto. Verifique sua conexão de internet.');
    } finally {
      // Restaura o estado original do botão
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  }

  // Carrega as informações do perfil e os produtos assim que a página for carregada
  loadProfile();
  loadProducts();
});
