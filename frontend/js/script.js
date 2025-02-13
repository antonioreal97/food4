// Exemplo de chamada para obter dados do backend

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5000/api/supermercados')
      .then(response => response.json())
      .then(data => {
        console.log('Dados dos supermercados:', data);
        // Aqui você pode manipular e exibir os dados na interface
      })
      .catch(error => console.error('Erro ao carregar os dados:', error));
  });
  