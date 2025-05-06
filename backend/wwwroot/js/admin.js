// Verificação de autenticação
document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.tipo !== 'admin') {
        alert('Acesso negado. Apenas administradores podem acessar esta página.');
        window.location.href = '/Login';
        return;
    }

    // Gerenciamento de Tabs
    const tabs = document.querySelectorAll('.nav-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all contents
            contents.forEach(content => content.classList.add('d-none'));
            // Show selected content
            const targetId = tab.id.replace('-tab', '-content');
            document.getElementById(targetId).classList.remove('d-none');

            // Load data based on selected tab
            switch(targetId) {
                case 'usuarios-content':
                    carregarUsuarios();
                    break;
                case 'transacoes-content':
                    carregarTransacoes();
                    break;
                case 'feedbacks-content':
                    carregarFeedbacks();
                    break;
                case 'relatorios-content':
                    carregarRelatorios();
                    break;
            }
        });
    });

    // Event Listeners
    document.getElementById('gerar-relatorio-doacoes').addEventListener('click', gerarRelatorioDoacoes);
    document.getElementById('gerar-relatorio-usuarios').addEventListener('click', gerarRelatorioUsuarios);

    // Carregar dados iniciais
    carregarUsuarios();
});

// Função para obter o token de autenticação
function getAuthToken() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    return userData ? userData.token : null;
}

// Funções de Monitoramento de Usuários
async function carregarUsuarios() {
    try {
        const token = getAuthToken();
        if (!token) {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = '/Login';
            return;
        }

        const response = await fetch('http://localhost:5000/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '/Login';
            return;
        }

        const usuarios = await response.json();
        
        const tbody = document.querySelector('#usuarios-table tbody');
        tbody.innerHTML = '';

        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${formatarTipoUsuario(usuario.tipo)}</td>
                <td>${formatarStatus(usuario.ativo)}</td>
                <td>${formatarData(usuario.dataCadastro)}</td>
                <td>${formatarData(usuario.ultimoAcesso)}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        alert('Erro ao carregar usuários. Tente novamente.');
    }
}

// Funções de Monitoramento de Transações
async function carregarTransacoes() {
    try {
        const token = getAuthToken();
        if (!token) {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = '/Login';
            return;
        }

        const response = await fetch('http://localhost:5000/api/users/transacoes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '/Login';
            return;
        }

        const data = await response.json();
        
        if (data.message) {
            alert(data.message);
            return;
        }

        const tbody = document.querySelector('#transacoes-table tbody');
        tbody.innerHTML = '';

        let total = 0;
        let concluidas = 0;
        let pendentes = 0;

        data.forEach(transacao => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${transacao.id}</td>
                <td>${formatarData(transacao.data)}</td>
                <td>${formatarTipoTransacao(transacao.tipo)}</td>
                <td>${formatarStatus(transacao.status)}</td>
                <td>R$ ${transacao.valor.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetalhesTransacao(${transacao.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);

            total++;
            if (transacao.status === 'concluida') {
                concluidas++;
            } else if (transacao.status === 'pendente') {
                pendentes++;
            }
        });

        // Atualizar contadores
        document.getElementById('total-transacoes').textContent = total;
        document.getElementById('transacoes-concluidas').textContent = concluidas;
        document.getElementById('transacoes-pendentes').textContent = pendentes;
    } catch (error) {
        console.error('Erro ao carregar transações:', error);
        alert('Erro ao carregar transações. Tente novamente.');
    }
}

// Funções de Monitoramento de Feedbacks
async function carregarFeedbacks() {
    try {
        const token = getAuthToken();
        if (!token) {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = '/Login';
            return;
        }

        const response = await fetch('http://localhost:5000/api/users/feedbacks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '/Login';
            return;
        }

        const data = await response.json();
        
        if (data.message) {
            alert(data.message);
            return;
        }

        const tbody = document.querySelector('#feedbacks-table tbody');
        tbody.innerHTML = '';

        let total = 0;
        let pendentes = 0;
        let somaAvaliacoes = 0;

        data.forEach(feedback => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${feedback.id}</td>
                <td>${formatarData(feedback.data)}</td>
                <td>${feedback.doacaoId}</td>
                <td>${formatarAvaliacao(feedback.avaliacao)}</td>
                <td>${feedback.texto}</td>
                <td>${formatarStatusFeedback(feedback.status)}</td>
            `;
            tbody.appendChild(tr);

            total++;
            if (feedback.status === 'pendente') {
                pendentes++;
            }
            somaAvaliacoes += feedback.avaliacao;
        });

        // Atualizar contadores
        document.getElementById('total-feedbacks').textContent = total;
        document.getElementById('feedbacks-pendentes').textContent = pendentes;
        document.getElementById('media-avaliacoes').textContent = 
            total > 0 ? (somaAvaliacoes / total).toFixed(1) : '0.0';
    } catch (error) {
        console.error('Erro ao carregar feedbacks:', error);
        alert('Erro ao carregar feedbacks. Tente novamente.');
    }
}

// Funções de Geração de Relatórios
async function carregarRelatorios() {
    // Inicialização da página de relatórios
    // Não é necessário carregar dados aqui, pois os relatórios são gerados sob demanda
}

async function gerarRelatorioDoacoes() {
    try {
        const token = getAuthToken();
        if (!token) {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = '/Login';
            return;
        }

        const response = await fetch('http://localhost:5000/api/users/relatorios/doacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '/Login';
            return;
        }

        const data = await response.json();
        
        if (data.message) {
            alert(data.message);
            return;
        }

        // TODO: Implementar download do relatório
        alert('Relatório gerado com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar relatório de doações:', error);
        alert('Erro ao gerar relatório. Tente novamente.');
    }
}

async function gerarRelatorioUsuarios() {
    try {
        const token = getAuthToken();
        if (!token) {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = '/Login';
            return;
        }

        const response = await fetch('http://localhost:5000/api/users/relatorios/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '/Login';
            return;
        }

        const data = await response.json();
        
        if (data.message) {
            alert(data.message);
            return;
        }

        // TODO: Implementar download do relatório
        alert('Relatório gerado com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar relatório de usuários:', error);
        alert('Erro ao gerar relatório. Tente novamente.');
    }
}

// Funções Auxiliares
function formatarTipoUsuario(tipo) {
    const tipos = {
        'Supermercado': 'Supermercado',
        'Cozinha': 'Cozinha Solidária',
        'Admin': 'Administrador'
    };
    return tipos[tipo] || tipo;
}

function formatarTipoTransacao(tipo) {
    const tipos = {
        'doacao': 'Doação',
        'solicitacao': 'Solicitação',
        'entrega': 'Entrega'
    };
    return tipos[tipo] || tipo;
}

function formatarStatus(status) {
    return status ? 'Ativo' : 'Inativo';
}

function formatarStatusFeedback(status) {
    const statusMap = {
        'pendente': 'Pendente',
        'aprovado': 'Aprovado',
        'rejeitado': 'Rejeitado'
    };
    return statusMap[status] || status;
}

function formatarAvaliacao(avaliacao) {
    return `${avaliacao} ⭐`;
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}
