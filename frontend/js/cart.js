document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items-list');

    // Função para carregar os itens do carrinho
    function loadCartItems() {
        fetch('https://localhost:7223/api/carrinho')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(cartItems => {
                cartItemsContainer.innerHTML = '';
                if (cartItems.length > 0) {
                    cartItems.forEach(item => {
                        const cartItem = document.createElement('li');
                        cartItem.classList.add('cart-item');
                        cartItem.innerHTML = `
                            <div class="cart-item-image">
                                <img src="${item.imagemUrl || 'img/produtos/product-placeholder.svg'}" 
                                     alt="${item.nome}"
                                     onerror="this.src='img/produtos/product-placeholder.svg'">
                            </div>
                            <div class="cart-item-info">
                                <span class="cart-item-name">${item.nome}</span>
                                <span class="cart-item-quantity">${item.quantidade} x R$ ${item.preco}</span>
                            </div>
                        `;
                        cartItemsContainer.appendChild(cartItem);
                    });
                    updateTotalPrice(cartItems);
                } else {
                    cartItemsContainer.innerHTML = '<li>Seu carrinho está vazio</li>';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar itens do carrinho:', error);
                cartItemsContainer.innerHTML = '<li>Erro ao carregar itens do carrinho</li>';
            });
    }

    // Função para atualizar o preço total
    function updateTotalPrice(cartItems) {
        const totalPriceElement = document.getElementById('total-price');
        const totalPrice = cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        totalPriceElement.textContent = totalPrice.toFixed(2).replace('.', ',');
    }

    // Carrega os itens do carrinho ao carregar a página
    loadCartItems();
});