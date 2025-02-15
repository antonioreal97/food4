// market.js

document.addEventListener('DOMContentLoaded', () => {
  const supermarketsContainer = document.getElementById('supermarkets-container');

  // Função para criar o card do supermercado
  function createSupermarketCard(supermarket) {
      const card = document.createElement('article');
      card.classList.add('supermarket-card');

      // Cabeçalho do card
      const header = document.createElement('div');
      header.classList.add('market-header');
      
      header.innerHTML = `
          <img src="images/market-placeholder.jpg" alt="${supermarket.nome}" class="market-logo">
          <div class="market-info">
              <h3 class="market-name">${supermarket.nome}</h3>
              <div class="market-details">
                  <span class="rating"><i class="fas fa-star"></i> 4.5</span>
                  <span class="distance"><i class="fas fa-map-marker-alt"></i> ${supermarket.distancia || '2.5km'}</span>
              </div>
          </div>
      `;

      // Corpo do card
      const body = document.createElement('div');
      body.classList.add('products-container');
      
      // Seção de informações de contato
      const contactInfo = document.createElement('div');
      contactInfo.classList.add('product-list');
      contactInfo.innerHTML = `
          <p><i class="fas fa-map-marker-alt"></i> ${supermarket.endereco}</p>
          <p><i class="fas fa-phone"></i> ${supermarket.contato}</p>
      `;

      // Seção de produtos
      const productsSection = document.createElement('div');
      productsSection.classList.add('product-list');
      productsSection.innerHTML = `
          <h4 class="product-list-title">
              <i class="fas fa-box-open"></i>
              Produtos Disponíveis
              <span class="badge">${supermarket.totalProdutos || 0} itens</span>
          </h4>
          <ul class="product-items preview-products"></ul>
      `;

      // Footer do card
      const footer = document.createElement('div');
      footer.classList.add('market-footer');
      footer.innerHTML = `
          <button class="btn btn-primary contact-btn">
              <i class="fas fa-shopping-cart"></i> Ver Todos os Produtos
          </button>
      `;

      // Montagem do card
      body.appendChild(contactInfo);
      body.appendChild(productsSection);
      card.appendChild(header);
      card.appendChild(body);
      card.appendChild(footer);

      // Carrega os produtos
      loadProducts(supermarket.id, productsSection.querySelector('.preview-products'));

      return card;
  }

  // Função para carregar os produtos
  function loadProducts(supermarketId, container) {
      fetch(`http://localhost:5207/api/produtos/supermercado/${supermarketId}`)
          .then(response => response.json())
          .then(products => {
              container.innerHTML = products.slice(0, 3).map(product => `
                  <li class="product-item">
                      <span class="product-name">${product.nome}</span>
                      <span class="product-quantity ${product.status.toLowerCase()}">
                          ${product.quantidade} unidades
                      </span>
                  </li>
              `).join('');
          })
          .catch(error => {
              console.error('Erro ao carregar produtos:', error);
              container.innerHTML = '<li>Erro ao carregar produtos</li>';
          });
  }

  // Carrega todos os supermercados
  function loadSupermarkets() {
      fetch('http://localhost:5207/api/supermercados')
          .then(response => response.json())
          .then(supermarkets => {
              supermarketsContainer.innerHTML = '';
              if (supermarkets.length > 0) {
                  supermarkets.forEach(supermarket => {
                      supermarketsContainer.appendChild(createSupermarketCard(supermarket));
                  });
              } else {
                  supermarketsContainer.innerHTML = `
                      <div class="empty-state">
                          <i class="fas fa-store-slash"></i>
                          <p>Nenhum supermercado encontrado</p>
                      </div>
                  `;
              }
          })
          .catch(error => {
              console.error('Erro ao carregar supermercados:', error);
              supermarketsContainer.innerHTML = `
                  <div class="error-state">
                      <i class="fas fa-exclamation-triangle"></i>
                      <p>Erro ao carregar dados</p>
                  </div>
              `;
          });
  }

  // Inicia o carregamento
  loadSupermarkets();

  // Adicione aqui event listeners para interações
});