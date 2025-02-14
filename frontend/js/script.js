// Exemplo de chamada para obter dados do backend e exibi-los na interface

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:5207/api/supermercados')
    .then(response => response.json())
    .then(data => {
      console.log('Dados dos supermercados:', data);
      const listContainer = document.getElementById('supermercados-list');

      if (Array.isArray(data) && data.length > 0) {
        // Cria uma lista para exibir os supermercados
        const ul = document.createElement('ul');
        data.forEach(supermercado => {
          const li = document.createElement('li');
          // Exibe as informações relevantes do supermercado
          li.textContent = `${supermercado.nome} - ${supermercado.endereco} - ${supermercado.contato}`;
          ul.appendChild(li);
        });
        listContainer.appendChild(ul);
      } else {
        listContainer.textContent = 'Nenhum supermercado parceiro encontrado.';
      }
    })
    .catch(error => {
      console.error('Erro ao carregar os dados:', error);
      const listContainer = document.getElementById('supermercados-list');
      listContainer.textContent = 'Erro ao carregar os dados dos supermercados.';
    });
});
