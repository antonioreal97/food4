// market.js

document.addEventListener('DOMContentLoaded', () => {
    const supermarketsContainer = document.getElementById('supermarkets-container');
  
    // Função para criar um elemento com as informações do supermercado e um preview de produtos
    function createSupermarketElement(supermarket) {
      const container = document.createElement('div');
      container.classList.add('supermarket');
  
      // Exibe o nome do supermercado
      const header = document.createElement('h3');
      header.textContent = supermarket.nome;
      container.appendChild(header);
  
      // Exibe o endereço e contato
      const address = document.createElement('p');
      address.textContent = `Endereço: ${supermarket.endereco}`;
      container.appendChild(address);
  
      const contact = document.createElement('p');
      contact.textContent = `Contato: ${supermarket.contato}`;
      container.appendChild(contact);
  
      // Cria um container para o preview dos produtos
      const productsPreview = document.createElement('div');
      productsPreview.classList.add('products-preview');
      productsPreview.textContent = 'Carregando produtos...';
      container.appendChild(productsPreview);
  
      // Realiza uma chamada para o endpoint que retorna os produtos do supermercado (limite a 3 produtos para preview)
      fetch(`http://localhost:5207/api/produtos/supermercado/${supermarket.id}`)
        .then(response => response.json())
        .then(products => {
          productsPreview.innerHTML = '';
          // Limita a exibição para até 3 produtos
          const preview = products.slice(0, 3);
          if (preview.length === 0) {
            productsPreview.textContent = 'Nenhum produto disponível';
          } else {
            const ul = document.createElement('ul');
            preview.forEach(product => {
              const li = document.createElement('li');
              li.textContent = `${product.nome} - ${product.status}`;
              ul.appendChild(li);
            });
            productsPreview.appendChild(ul);
          }
        })
        .catch(error => {
          console.error('Erro ao carregar produtos:', error);
          productsPreview.textContent = 'Erro ao carregar produtos';
        });
  
      return container;
    }
  
    // Função para carregar os supermercados parceiros do backend
    function loadSupermarkets() {
      fetch('http://localhost:5207/api/supermercados')
        .then(response => response.json())
        .then(supermarkets => {
          if (Array.isArray(supermarkets) && supermarkets.length > 0) {
            supermarkets.forEach(supermarket => {
              const element = createSupermarketElement(supermarket);
              supermarketsContainer.appendChild(element);
            });
          } else {
            supermarketsContainer.textContent = 'Nenhum supermercado parceiro encontrado.';
          }
        })
        .catch(error => {
          console.error('Erro ao carregar supermercados:', error);
          supermarketsContainer.textContent = 'Erro ao carregar supermercados.';
        });
    }
  
    // Chama a função para iniciar o carregamento
    loadSupermarkets();
  });
  