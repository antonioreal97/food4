// perfil.js

// Funções globais para manipulação de produtos
let globalToken = null;

window.openEditModal = function(product) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Editar Produto</h2>
      <form id="editProductForm">
        <div class="form-group">
          <label for="editProductName">Nome do Produto:</label>
          <input type="text" id="editProductName" value="${product.nome}" required>
        </div>
        <div class="form-group">
          <label for="editProductExpiration">Data de Vencimento:</label>
          <input type="date" id="editProductExpiration" value="${product.dataVencimento.split('T')[0]}" required>
        </div>
        <div class="form-group">
          <label for="editProductDiscount">Desconto (%):</label>
          <input type="number" id="editProductDiscount" value="${product.desconto}" min="0" max="100">
        </div>
        <div class="form-group">
          <label for="editProductPickup">Endereço de Retirada:</label>
          <input type="text" id="editProductPickup" value="${product.pickupAddress}" required>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="editProductDonation" ${product.status === 'doado' ? 'checked' : ''}>
            Produto para Doação
          </label>
        </div>
        <div class="modal-buttons">
          <button type="submit" class="btn-save">Salvar</button>
          <button type="button" class="btn-cancel">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Adiciona os event listeners
  const form = modal.querySelector('#editProductForm');
  const cancelButton = modal.querySelector('.btn-cancel');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedProduct = {
      id: product.id,
      nome: document.getElementById('editProductName').value.trim(),
      dataVencimento: document.getElementById('editProductExpiration').value,
      desconto: parseFloat(document.getElementById('editProductDiscount').value) || 0,
      status: document.getElementById('editProductDonation').checked ? 'doado' : 'disponível',
      pickupAddress: document.getElementById('editProductPickup').value.trim(),
      supermercadoId: Number(product.supermercadoId),
      imagemUrl: product.imagemUrl || null,
      quantidade: Number(product.quantidade) || 1,
      preco: Number(product.preco) || 0,
      categoria: product.categoria || 'Geral'
    };

    // Validações básicas
    if (!updatedProduct.nome) {
      alert('O nome do produto é obrigatório.');
      return;
    }

    if (!updatedProduct.dataVencimento) {
      alert('A data de vencimento é obrigatória.');
      return;
    }

    if (!updatedProduct.pickupAddress) {
      alert('O endereço de retirada é obrigatório.');
      return;
    }

    console.log('Dados do produto antes da atualização:', updatedProduct);
    await window.editProduto(product.id, updatedProduct);
    document.body.removeChild(modal);
  });

  cancelButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
};

window.deleteProduto = async function(produtoId) {
  const currentSupermercadoId = localStorage.getItem('supermercadoId');
  
  try {
    // Primeiro, verifica se o produto pertence ao supermercado logado
    const response = await fetch(`http://localhost:5207/api/produtos/${produtoId}`, {
      headers: {
        'Authorization': `Bearer ${globalToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Produto não encontrado');
    }
    
    const produto = await response.json();
    if (Number(produto.supermercadoId) !== Number(currentSupermercadoId)) {
      alert('Você não tem permissão para excluir este produto.');
      return;
    }
    
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    const deleteResponse = await fetch(`http://localhost:5207/api/produtos/${produtoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${globalToken}`
      }
    });

    if (deleteResponse.ok) {
      alert('Produto excluído com sucesso!');
      window.loadProducts(); // Recarrega a lista de produtos
    } else {
      const errorData = await deleteResponse.json();
      throw new Error(errorData.message || 'Erro ao excluir produto');
    }
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    alert('Erro ao excluir produto: ' + error.message);
  }
};

window.editProduto = async function(produtoId, produto) {
  const currentSupermercadoId = localStorage.getItem('supermercadoId');
  
  try {
    // Verifica se o produto pertence ao supermercado logado
    if (Number(produto.supermercadoId) !== Number(currentSupermercadoId)) {
      alert('Você não tem permissão para editar este produto.');
      return;
    }
    
    // Limpa o cache local antes de formatar o produto
    localStorage.removeItem(`produto_${produtoId}`);
    
    // Formata a data para o formato esperado pela API
    const formattedProduct = {
      id: Number(produtoId),
      nome: produto.nome,
      dataVencimento: new Date(produto.dataVencimento).toISOString(),
      desconto: Number(produto.desconto),
      status: produto.status.toLowerCase(),
      pickupAddress: produto.pickupAddress,
      supermercadoId: Number(produto.supermercadoId),
      imagemUrl: produto.imagemUrl || null
    };

    console.log('Enviando dados para atualização:', formattedProduct);

    const response = await fetch(`http://localhost:5207/api/produtos/${produtoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${globalToken}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify(formattedProduct)
    });

    console.log('Status da resposta:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      console.log('Produto atualizado com sucesso');
      alert('Produto atualizado com sucesso!');
      
      // Força um pequeno delay antes de recarregar os produtos
      // e limpa qualquer cache que possa existir
      setTimeout(() => {
        localStorage.removeItem(`produto_${produtoId}`);
        window.loadProducts();
      }, 500);
    } else {
      let errorMessage = 'Erro ao atualizar produto';
      const responseText = await response.text();
      console.error('Resposta de erro completa:', responseText);
      
      try {
        const errorData = JSON.parse(responseText);
        console.error('Erro retornado pela API:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Erro ao ler resposta de erro:', e);
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    alert('Erro ao atualizar produto: ' + error.message);
  }
};

// Função para resolver URLs de imagens
function resolveImageUrl(url) {
  if (!url) return './img/produtos/product-placeholder.svg';
  
  // Se a URL começar com /frontend, remove essa parte
  if (url.startsWith('/frontend/')) {
    url = url.substring(9); // Remove '/frontend'
  }
  
  // Se a URL não começar com /, adiciona ./
  if (!url.startsWith('/')) {
    url = './' + url;
  } else {
    url = '.' + url;
  }
  
  return url;
}

window.loadProducts = async function() {
  const productsContainer = document.getElementById('productsContainer');
  if (!productsContainer) return;
  
  const currentSupermercadoId = localStorage.getItem('supermercadoId');
  
  console.log(`Carregando produtos. supermercadoId atual: ${currentSupermercadoId}`);
  
  productsContainer.innerHTML = '<div class="loading-state">Carregando produtos...</div>';
  
  try {
    const idToUse = currentSupermercadoId || supermercadoId;
    console.log(`Buscando produtos para o supermercado ID: ${idToUse}`);
    
    // Adiciona um timestamp para evitar cache
    const timestamp = new Date().getTime();
    const response = await fetch(`http://localhost:5207/api/produtos/supermercado/${idToUse}?_=${timestamp}`, {
      headers: {
        'Authorization': `Bearer ${globalToken}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    console.log(`Status da resposta de produtos: ${response.status}`);
    
    if (response.ok) {
      const products = await response.json();
      console.log(`Produtos recebidos: ${products.length}`);
      console.log('Dados dos produtos:', products);
      
      if (Array.isArray(products) && products.length > 0) {
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toLocaleDateString('pt-BR');
        };
        
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
          
          // Resolve o caminho da imagem
          const imagemUrl = resolveImageUrl(product.imagemUrl);
          console.log(`URL da imagem original: ${product.imagemUrl}`);
          console.log(`URL da imagem resolvida: ${imagemUrl}`);
          
          // Verifica se o produto pertence ao supermercado logado
          const isOwner = Number(product.supermercadoId) === Number(idToUse);
          
          html += `
            <div class="product-card">
              <div class="product-info">
                <div class="product-image">
                  <img src="${imagemUrl}" alt="${product.nome}" onerror="this.src='./img/produtos/product-placeholder.svg'">
                </div>
                <div class="product-name">${product.nome}</div>
                <div class="product-details">
                  <span>Vence em: ${formattedDate}</span>
                  <span class="product-status ${statusClass}">${product.status || 'Disponível'}</span>
                  <span>Desconto: ${product.desconto}%</span>
                  <small>Endereço para retirada: ${pickupAddress}</small>
                </div>
                ${isOwner ? `
                  <div class="product-actions">
                    <button onclick="openEditModal(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="btn-edit">Editar</button>
                    <button onclick="deleteProduto(${product.id})" class="btn-delete">Excluir</button>
                  </div>
                ` : ''}
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
};

document.addEventListener('DOMContentLoaded', async () => {
  // Verifica se o usuário está logado
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = '/Login';
    return;
  }

  // Armazena o token globalmente
  globalToken = token;

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

  const decodedToken = parseJwt(token);
  const userId = decodedToken.nameid;
  const userType = decodedToken.role;
  let supermercadoId = decodedToken.SupermercadoId;

  // Função para cadastrar um novo produto
  async function submitProductFormData(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('Nome', document.getElementById('productName').value);
    formData.append('DataVencimento', document.getElementById('productExpiration').value);
    formData.append('Desconto', document.getElementById('productDiscount').value || '0');
    formData.append('Status', document.getElementById('productDonation').checked ? 'doado' : 'disponível');
    formData.append('SupermercadoId', supermercadoId);
    
    // Garante que o endereço de retirada seja preenchido
    const pickupAddress = document.getElementById('productPickup').value;
    if (!pickupAddress) {
        alert('Por favor, preencha o endereço de retirada do produto.');
        return;
    }
    formData.append('PickupAddress', pickupAddress);

    // Verifica se uma imagem foi selecionada
    const imageFile = document.getElementById('productImage').files[0];
    if (!imageFile) {
        alert('Por favor, selecione uma imagem para o produto.');
        return;
    }

    // Verifica o tamanho da imagem (máximo 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
    }

    // Verifica o tipo da imagem
    if (!imageFile.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        return;
    }

    formData.append('Imagem', imageFile);

    // Log dos dados que estão sendo enviados
    console.log('Dados do formulário:');
    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            console.log(`${key}: [File] ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
            console.log(`${key}: ${value}`);
        }
    }

    try {
        console.log('Enviando requisição para criar produto...');
        const apiUrl = 'http://localhost:5207/api/produtos/criar';
        console.log(`URL da API: ${apiUrl}`);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
            credentials: 'include' // Importante para CORS com cookies
        });

        console.log(`Status da resposta: ${response.status}`);
        console.log(`Headers da resposta:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            let errorMessage = 'Erro desconhecido ao cadastrar produto.';
            try {
                const errorData = await response.json();
                console.error('Erro detalhado:', errorData);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                console.error('Erro ao parsear resposta de erro:', e);
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Produto cadastrado:', result);
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
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        console.error('Stack trace:', error.stack);
        
        // Mensagem de erro mais detalhada para o usuário
        let userMessage = 'Erro ao cadastrar produto. ';
        if (error.message.includes('Failed to fetch')) {
            userMessage += 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
        } else {
            userMessage += error.message;
        }
        alert(userMessage);
    }
  }

  document.getElementById('productForm').addEventListener('submit', submitProductFormData);

  // Função para carregar e exibir as informações do supermercado logado
  async function loadProfile() {
    try {
      console.log(`Carregando perfil para identificador: ${supermercadoId}`);
      console.log(`userType: ${userType}, userId: ${userId}`);
      
      // Primeiro, tentamos buscar os dados atualizados do usuário
      // para garantir que temos o ID do supermercado mais recente
      try {
        console.log("Buscando informações atualizadas do usuário via /api/auth/me");
        const userResponse = await fetch('http://localhost:5207/api/auth/me', {
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
        url = `http://localhost:5207/api/supermercados/${supermercadoId}`;
        console.log(`Buscando pelo ID do supermercado: ${supermercadoId}`);
      } else {
        // Se só temos ID de usuário, usamos o endpoint específico
        url = `http://localhost:5207/api/supermercados/usuario/${userId}`;
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
              const createResponse = await fetch(`http://localhost:5207/api/supermercados/usuario/${userId}`, {
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
      
      // Atualiza a imagem do perfil
      const profileImageElement = document.getElementById('profileImage');
      if (profileImageElement) {
        // Extrai o nome do supermercado
        const nomeCompleto = profile.nome || '';
        let nomeArquivo = nomeCompleto.split(' ')[0]; // Pega o primeiro nome
        
        // Se o nome já começa com "Super", não adiciona novamente
        if (!nomeArquivo.startsWith('Super')) {
          nomeArquivo = 'Super' + nomeArquivo;
        }
        
        // Define o caminho da imagem
        const imagePath = `./img/${nomeArquivo}.png`;
        
        console.log('Tentando carregar imagem:', imagePath);
        
        // Define a imagem e um fallback caso não seja encontrada
        profileImageElement.src = imagePath;
        profileImageElement.onerror = function() {
          console.log('Imagem não encontrada, usando logo padrão');
          this.src = './img/logo.png';
        };
      }
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
        
        const response = await fetch(`http://localhost:5207/api/supermercados/${currentSupermercadoId}`, {
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

  // Carrega as informações do perfil e os produtos assim que a página for carregada
  loadProfile();
  loadProducts();
});
