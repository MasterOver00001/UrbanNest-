// UrbanNest - JavaScript Principal

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const luckyBtn = document.getElementById('luckyBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Configuração da busca principal
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                // Redirecionar para página de resultados com parâmetro de busca
                window.location.href = `imoveis.html?search=${encodeURIComponent(query)}`;
            } else {
                alert('Por favor, digite algo para buscar.');
            }
        });
    }

    // Botão "Estou com sorte"
    if (luckyBtn) {
        luckyBtn.addEventListener('click', function() {
            const luckySearches = [
                'Apartamento 2 quartos Centro',
                'Casa com jardim Zona Sul',
                'Loft moderno Vila Madalena',
                'Studio mobiliado Copacabana',
                'Cobertura com vista para o mar',
                'Casa térrea com quintal',
                'Apartamento novo Barra da Tijuca'
            ];
            
            const randomSearch = luckySearches[Math.floor(Math.random() * luckySearches.length)];
            searchInput.value = randomSearch;
            
            // Simular busca automática
            setTimeout(() => {
                window.location.href = `imoveis.html?search=${encodeURIComponent(randomSearch)}`;
            }, 500);
        });
    }

    // Filtros rápidos
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            window.location.href = `imoveis.html?tipo=${encodeURIComponent(filter)}`;
        });
    });

    // Animações suaves para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animações aos cards de features
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Função para buscar imóveis (será usada em outras páginas)
async function buscarImoveis(filtros = {}) {
    try {
        const params = new URLSearchParams(filtros);
        const response = await fetch(`/api/imoveis?${params}`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar imóveis');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro na busca:', error);
        return { imoveis: [], total: 0 };
    }
}

// Função para formatar preço
function formatarPreco(preco) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(preco);
}

// Função para validar formulários
function validarFormulario(form) {
    const campos = form.querySelectorAll('input[required], select[required], textarea[required]');
    let valido = true;
    
    campos.forEach(campo => {
        if (!campo.value.trim()) {
            campo.classList.add('erro');
            valido = false;
        } else {
            campo.classList.remove('erro');
        }
    });
    
    return valido;
}

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    
    // Estilos inline para a notificação
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Cores baseadas no tipo
    const cores = {
        'info': '#2196F3',
        'sucesso': '#4CAF50',
        'erro': '#f44336',
        'aviso': '#FF9800'
    };
    
    notificacao.style.backgroundColor = cores[tipo] || cores.info;
    
    document.body.appendChild(notificacao);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.parentNode.removeChild(notificacao);
            }
        }, 300);
    }, 3000);
}

// Adicionar estilos para animações das notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .erro {
        border-color: #f44336 !important;
        background-color: #ffebee !important;
    }
`;
document.head.appendChild(style);

