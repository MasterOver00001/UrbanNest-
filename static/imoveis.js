// JavaScript para a página de imóveis

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const searchBarForm = document.getElementById('searchBarForm');
    const searchBarInput = document.getElementById('searchBarInput');
    const imoveisGrid = document.getElementById('imoveisGrid');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    const pagination = document.getElementById('pagination');
    
    // Filtros
    const tipoFilter = document.getElementById('tipoFilter');
    const precoFilter = document.getElementById('precoFilter');
    const quartosFilter = document.getElementById('quartosFilter');
    const localizacaoFilter = document.getElementById('localizacaoFilter');
    const aplicarFiltros = document.getElementById('aplicarFiltros');
    const limparFiltros = document.getElementById('limparFiltros');
    
    // View options
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Estado da aplicação
    let currentPage = 1;
    let currentFilters = {};
    let currentView = 'grid';
    
    // Dados de exemplo (em um projeto real, viriam da API)
    const imoveisExemplo = [
        {
            id: 1,
            titulo: 'Apartamento Moderno no Centro',
            tipo: 'apartamento',
            preco: 2500,
            quartos: 2,
            banheiros: 2,
            area: 80,
            localizacao: 'Centro, São Paulo - SP',
            descricao: 'Apartamento completamente reformado com acabamentos modernos, próximo ao metrô.',
            imagem: null,
            destaque: true
        },
        {
            id: 2,
            titulo: 'Casa com Jardim na Zona Sul',
            tipo: 'casa',
            preco: 4200,
            quartos: 3,
            banheiros: 2,
            area: 150,
            localizacao: 'Vila Madalena, São Paulo - SP',
            descricao: 'Casa térrea com amplo jardim, ideal para famílias. Garagem para 2 carros.',
            imagem: null,
            destaque: false
        },
        {
            id: 3,
            titulo: 'Loft Industrial Reformado',
            tipo: 'loft',
            preco: 3800,
            quartos: 1,
            banheiros: 1,
            area: 90,
            localizacao: 'Bela Vista, São Paulo - SP',
            descricao: 'Loft com pé direito alto, estilo industrial, totalmente mobiliado.',
            imagem: null,
            destaque: true
        },
        {
            id: 4,
            titulo: 'Studio Compacto e Funcional',
            tipo: 'studio',
            preco: 1800,
            quartos: 1,
            banheiros: 1,
            area: 35,
            localizacao: 'Liberdade, São Paulo - SP',
            descricao: 'Studio otimizado com móveis planejados, ideal para jovens profissionais.',
            imagem: null,
            destaque: false
        },
        {
            id: 5,
            titulo: 'Cobertura com Vista Panorâmica',
            tipo: 'apartamento',
            preco: 8500,
            quartos: 4,
            banheiros: 3,
            area: 200,
            localizacao: 'Moema, São Paulo - SP',
            descricao: 'Cobertura duplex com terraço, churrasqueira e vista para a cidade.',
            imagem: null,
            destaque: true
        },
        {
            id: 6,
            titulo: 'Casa Térrea com Quintal',
            tipo: 'casa',
            preco: 3200,
            quartos: 3,
            banheiros: 2,
            area: 120,
            localizacao: 'Vila Prudente, São Paulo - SP',
            descricao: 'Casa com quintal amplo, ideal para pets. Próxima a escolas e comércio.',
            imagem: null,
            destaque: false
        }
    ];
    
    // Inicialização
    init();
    
    function init() {
        // Verificar parâmetros da URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const tipoParam = urlParams.get('tipo');
        
        if (searchParam) {
            searchBarInput.value = searchParam;
            currentFilters.search = searchParam;
        }
        
        if (tipoParam) {
            tipoFilter.value = tipoParam;
            currentFilters.tipo = tipoParam;
        }
        
        // Event listeners
        setupEventListeners();
        
        // Carregar imóveis
        carregarImoveis();
    }
    
    function setupEventListeners() {
        // Busca
        searchBarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchBarInput.value.trim();
            currentFilters.search = query;
            currentPage = 1;
            carregarImoveis();
        });
        
        // Filtros
        aplicarFiltros.addEventListener('click', function() {
            aplicarFiltrosAtivos();
        });
        
        limparFiltros.addEventListener('click', function() {
            limparTodosFiltros();
        });
        
        // View options
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.dataset.view;
                alterarVisualizacao(view);
            });
        });
    }
    
    function aplicarFiltrosAtivos() {
        currentFilters = {};
        
        if (searchBarInput.value.trim()) {
            currentFilters.search = searchBarInput.value.trim();
        }
        
        if (tipoFilter.value) {
            currentFilters.tipo = tipoFilter.value;
        }
        
        if (precoFilter.value) {
            currentFilters.preco = precoFilter.value;
        }
        
        if (quartosFilter.value) {
            currentFilters.quartos = quartosFilter.value;
        }
        
        if (localizacaoFilter.value.trim()) {
            currentFilters.localizacao = localizacaoFilter.value.trim();
        }
        
        currentPage = 1;
        carregarImoveis();
    }
    
    function limparTodosFiltros() {
        // Limpar campos
        searchBarInput.value = '';
        tipoFilter.value = '';
        precoFilter.value = '';
        quartosFilter.value = '';
        localizacaoFilter.value = '';
        
        // Limpar filtros ativos
        currentFilters = {};
        currentPage = 1;
        
        // Recarregar
        carregarImoveis();
    }
    
    function alterarVisualizacao(view) {
        currentView = view;
        
        // Atualizar botões
        viewButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Atualizar grid
        if (view === 'list') {
            imoveisGrid.classList.add('list-view');
        } else {
            imoveisGrid.classList.remove('list-view');
        }
    }
    
    function carregarImoveis() {
        // Mostrar loading
        mostrarLoading();
        
        // Construir parâmetros da API
        const params = new URLSearchParams();
        
        if (currentFilters.search) {
            params.append('search', currentFilters.search);
        }
        
        if (currentFilters.tipo) {
            params.append('tipo', currentFilters.tipo);
        }
        
        if (currentFilters.preco) {
            const [min, max] = currentFilters.preco.split('-');
            if (min) params.append('preco_min', min);
            if (max && max !== '+') params.append('preco_max', max);
        }
        
        if (currentFilters.quartos) {
            const quartos = currentFilters.quartos.replace('+', '');
            params.append('quartos', quartos);
        }
        
        if (currentFilters.localizacao) {
            params.append('search', currentFilters.localizacao);
        }
        
        params.append('page', currentPage);
        params.append('per_page', 6);
        
        // Fazer requisição para a API
        fetch(`/api/imoveis?${params}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                
                renderizarImoveis(data.imoveis);
                atualizarResultados(data.total);
                renderizarPaginacao(data.pages, currentPage);
            })
            .catch(error => {
                console.error('Erro ao carregar imóveis:', error);
                imoveisGrid.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Erro ao carregar imóveis. Tente novamente.</p>
                    </div>
                `;
            });
    }
    
    function filtrarImoveis(imoveis, filtros) {
        return imoveis.filter(imovel => {
            // Filtro por busca (título, localização, descrição)
            if (filtros.search) {
                const search = filtros.search.toLowerCase();
                const textoCompleto = `${imovel.titulo} ${imovel.localizacao} ${imovel.descricao}`.toLowerCase();
                if (!textoCompleto.includes(search)) {
                    return false;
                }
            }
            
            // Filtro por tipo
            if (filtros.tipo && imovel.tipo !== filtros.tipo) {
                return false;
            }
            
            // Filtro por preço
            if (filtros.preco) {
                const [min, max] = filtros.preco.split('-').map(p => p.replace('+', ''));
                const precoMin = parseInt(min) || 0;
                const precoMax = max ? parseInt(max) : Infinity;
                
                if (imovel.preco < precoMin || imovel.preco > precoMax) {
                    return false;
                }
            }
            
            // Filtro por quartos
            if (filtros.quartos) {
                const quartos = filtros.quartos.replace('+', '');
                if (quartos.includes('+')) {
                    if (imovel.quartos < parseInt(quartos)) {
                        return false;
                    }
                } else {
                    if (imovel.quartos !== parseInt(quartos)) {
                        return false;
                    }
                }
            }
            
            // Filtro por localização
            if (filtros.localizacao) {
                const localizacao = filtros.localizacao.toLowerCase();
                if (!imovel.localizacao.toLowerCase().includes(localizacao)) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    function paginarImoveis(imoveis, page, itemsPerPage) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalPages = Math.ceil(imoveis.length / itemsPerPage);
        
        return {
            imoveis: imoveis.slice(startIndex, endIndex),
            totalPages: totalPages,
            currentPage: page,
            total: imoveis.length
        };
    }
    
    function mostrarLoading() {
        imoveisGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando imóveis...</p>
            </div>
        `;
    }
    
    function renderizarImoveis(imoveis) {
        if (imoveis.length === 0) {
            imoveisGrid.innerHTML = `
                <div class="loading">
                    <i class="fas fa-search"></i>
                    <p>Nenhum imóvel encontrado com os filtros aplicados.</p>
                </div>
            `;
            return;
        }
        
        const html = imoveis.map(imovel => `
            <div class="imovel-card" onclick="verDetalhes(${imovel.id})">
                <div class="imovel-image">
                    ${imovel.imagem_principal ? 
                        `<img src="${imovel.imagem_principal}" alt="${imovel.titulo}">` :
                        `<div class="placeholder"><i class="fas fa-home"></i></div>`
                    }
                    <div class="imovel-price">${formatarPreco(imovel.preco)}/mês</div>
                </div>
                <div class="imovel-content">
                    <h3 class="imovel-title">${imovel.titulo}</h3>
                    <div class="imovel-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${imovel.endereco.completo}
                    </div>
                    <div class="imovel-details">
                        <div class="imovel-detail">
                            <i class="fas fa-bed"></i>
                            ${imovel.quartos} quartos
                        </div>
                        <div class="imovel-detail">
                            <i class="fas fa-bath"></i>
                            ${imovel.banheiros} banheiros
                        </div>
                        <div class="imovel-detail">
                            <i class="fas fa-ruler-combined"></i>
                            ${imovel.area}m²
                        </div>
                    </div>
                    <p class="imovel-description">${imovel.descricao}</p>
                    <div class="imovel-actions">
                        <button class="btn-contact" onclick="event.stopPropagation(); entrarEmContato(${imovel.id})">
                            <i class="fas fa-phone"></i> Contato
                        </button>
                        <button class="btn-details" onclick="event.stopPropagation(); verDetalhes(${imovel.id})">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        imoveisGrid.innerHTML = html;
    }
    
    function atualizarResultados(total) {
        resultsCount.textContent = `${total} imóveis encontrados`;
        
        if (currentFilters.search) {
            resultsTitle.textContent = `Resultados para "${currentFilters.search}"`;
        } else {
            resultsTitle.textContent = 'Imóveis Disponíveis';
        }
    }
    
    function renderizarPaginacao(totalPages, currentPageNum) {
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // Botão anterior
        html += `<button ${currentPageNum === 1 ? 'disabled' : ''} onclick="irParaPagina(${currentPageNum - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;
        
        // Páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPageNum) {
                html += `<button class="active">${i}</button>`;
            } else {
                html += `<button onclick="irParaPagina(${i})">${i}</button>`;
            }
        }
        
        // Botão próximo
        html += `<button ${currentPageNum === totalPages ? 'disabled' : ''} onclick="irParaPagina(${currentPageNum + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;
        
        pagination.innerHTML = html;
    }
    
    // Funções globais
    window.irParaPagina = function(page) {
        currentPage = page;
        carregarImoveis();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    window.verDetalhes = function(id) {
        window.location.href = `detalhes_imovel.html?id=${id}`;
    };
    
    window.entrarEmContato = function(id) {
        mostrarNotificacao('Funcionalidade de contato será implementada em breve!', 'info');
    };
});

