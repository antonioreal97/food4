document.addEventListener('DOMContentLoaded', async () => {
  const listContainer = document.getElementById('supermercados-list');

  try {
    const response = await fetch('https://localhost:7223/api/supermercados');
    if (!response.ok) {
      throw new Error('Erro na resposta da rede.');
    }
    const data = await response.json();
    console.log('Dados dos supermercados:', data);

    // Limpa o container antes de inserir os dados
    listContainer.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
      // Cria uma lista para exibir os supermercados
      const ul = document.createElement('ul');
      data.forEach(supermercado => {
        const li = document.createElement('li');
        // Utiliza os campos conforme o modelo; se o JSON estiver em camelCase, ajuste se necessário
        li.innerHTML = `<strong>${supermercado.Nome || supermercado.nome}</strong><br>
                        Endereço: ${supermercado.Endereco || supermercado.endereco}<br>
                        Contato: ${supermercado.Contato || supermercado.contato}`;
        ul.appendChild(li);
      });
      listContainer.appendChild(ul);
    } else {
      listContainer.textContent = 'Nenhum supermercado parceiro encontrado.';
    }
  } catch (error) {
    console.error('Erro ao carregar os dados:', error);
    listContainer.textContent = 'Erro ao carregar os dados dos supermercados.';
  }
});
