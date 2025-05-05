// Dados dos supermercados parceiros
const supermercados = [
  {
    nome: "SuperYago Supermercado",
    endereco: "Endereço não informado",
    contato: "yago@yago.com",
    imagem: "img/SuperYago.png"
  },
  {
    nome: "SuperToin Supermercado",
    endereco: "Endereço não informado",
    contato: "toin@toin.com",
    imagem: "img/SuperToin.png"
  },
  {
    nome: "SuperTeste",
    endereco: "teste",
    contato: "teste@teste.com",
    imagem: "img/SuperTeste.png"
  },
  {
    nome: "SuperIvan Supermercado",
    endereco: "Endereço não informado",
    contato: "ivan@ivan.com",
    imagem: "img/SuperIvan.png"
  }
];

// Função para criar o card de um supermercado
function criarCardSupermercado(supermercado) {
  return `
    <div class="partner-card">
      <div class="partner-image">
        <img src="${supermercado.imagem}" alt="${supermercado.nome}" onerror="this.src='img/supermercados/default.jpg'">
      </div>
      <div class="partner-info">
        <h3 class="partner-name">${supermercado.nome}</h3>
        <p class="partner-details">
          <i class="fas fa-map-marker-alt"></i>
          ${supermercado.endereco}
        </p>
        <p class="partner-contact">
          <i class="fas fa-envelope"></i>
          ${supermercado.contato}
        </p>
      </div>
    </div>
  `;
}

// Função para carregar os supermercados na página
function carregarSupermercados() {
  const supermercadosContainer = document.getElementById('supermercados-list');
  if (supermercadosContainer) {
    const cardsHTML = supermercados.map(criarCardSupermercado).join('');
    supermercadosContainer.innerHTML = cardsHTML;
  }
}

// Carregar os supermercados quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarSupermercados);
