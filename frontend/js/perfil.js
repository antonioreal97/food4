// perfil.js

document.addEventListener('DOMContentLoaded', () => {
  // Para fins de teste, usamos um ID fixo para o supermercado (exemplo: 1).
  // Em uma aplicação real, esse ID seria obtido do token de login ou do localStorage.
  const userId = 1;

  // Função para carregar e exibir os produtos cadastrados para o supermercado logado
  async function loadProducts() {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = 'Carregando produtos...';
    try {
      const response = await fetch(`http://localhost:5207/api/produtos/supermercado/${userId}`);
      if (response.ok) {
        const products = await response.json();
        if (Array.isArray(products) && products.length > 0) {
          let html = '<ul>';
          products.forEach(product => {
            html += `<li>
                      <strong>${product.nome}</strong><br>
                      Vence em: ${product.dataVencimento} <br>
                      Status: ${product.status} <br>
                      Endereço de retirada: ${product.pickupAddress || "Não informado"}
                     </li>`;
          });
          html += '</ul>';
          productsContainer.innerHTML = html;
        } else {
          productsContainer.textContent = 'Nenhum produto cadastrado.';
        }
      } else {
        productsContainer.textContent = 'Erro ao carregar produtos.';
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      productsContainer.textContent = 'Erro ao carregar produtos.';
    }
  }

  // Manipula o formulário de atualização do endereço de retirada
  const pickupForm = document.getElementById('pickupForm');
  if (pickupForm) {
    pickupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pickupAddress = document.getElementById('pickupAddress').value;
      try {
        const response = await fetch(`http://localhost:5207/api/supermercados/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ pickupAddress: pickupAddress })
        });
        if (response.ok) {
          alert('Endereço de retirada atualizado com sucesso!');
        } else {
          alert('Falha ao atualizar o endereço de retirada.');
        }
      } catch (error) {
        console.error('Erro ao atualizar o endereço de retirada:', error);
        alert('Erro ao atualizar o endereço de retirada.');
      }
    });
  }

  // Manipula o formulário de cadastro de produtos
  const productForm = document.getElementById('productForm');
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const productName = document.getElementById('productName').value;
      const productExpiration = document.getElementById('productExpiration').value;
      const productDiscount = parseFloat(document.getElementById('productDiscount').value);
      const productPickup = document.getElementById('productPickup').value;
      // Verifica se o checkbox "Produto para Doação" está marcado
      const donationCheckbox = document.getElementById('productDonation');
      const isDonation = donationCheckbox ? donationCheckbox.checked : false;

      // Se for para doação, força desconto 100 e status "doado"
      const productData = {
        nome: productName,
        dataVencimento: productExpiration,
        desconto: isDonation ? 100 : productDiscount,
        status: isDonation ? "doado" : "disponível",
        supermercadoId: userId,
        pickupAddress: productPickup
      };

      try {
        const response = await fetch('http://localhost:5207/api/produtos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });
        if (response.ok) {
          alert('Produto cadastrado com sucesso!');
          productForm.reset();
          loadProducts();
        } else {
          alert('Falha ao cadastrar o produto.');
        }
      } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        alert('Erro ao cadastrar produto.');
      }
    });
  }

  // Carrega os produtos assim que a página for carregada
  loadProducts();
});
