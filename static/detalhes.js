// JavaScript para a página de detalhes do imóvel

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loadingContainer = document.getElementById('loadingContainer');
    const imovelContainer = document.getElementById('imovelContainer');
    const agendamentoForm = document.getElementById('agendamentoForm');
    
    // Estado da aplicação
    let currentImovel = null;
    let map = null;
    
    // Inicialização
    init();
    
    function init() {
        // Obter ID do imóvel da URL
        const urlParams = new URLSearchParams(window.location.search);
        const imovelId = urlParams.get('id');
        
        if (!imovelId) {
            showError('ID do imóvel não encontrado na URL');
            return;
        }
        
        // Carregar dados do imóvel
        carregarImovel(imovelId);
        
        // Event listeners
        setupEventListeners();
        
        // Configurar data mínima para agendamento (hoje)
        const hoje = new Date().toISOString().split('T')[0];
        document.getElementById('dataVisita').min = hoje;
    }
    
    function setupEventListeners() {
        // Form de agendamento
        agendamentoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            agendarVisita();
        });
        
        // Botões de compartilhamento
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.classList[1]; // facebook, twitter, etc.
                compartilhar(type);
            });
        });
        
        // Data change para carregar horários disponíveis
        document.getElementById('dataVisita').addEventListener('change', function() {
            carregarHorariosDisponiveis();
        });
    }
    
    function carregarImovel(id) {
        fetch(`/api/imoveis/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Imóvel não encontrado');
                }
                return response.json();
            })
            .then(imovel => {
                currentImovel = imovel;
                renderizarImovel(imovel);
                loadingContainer.style.display = 'none';
                imovelContainer.style.display = 'block';
                
                // Carregar mapa se houver coordenadas
                if (imovel.coordenadas.latitude && imovel.coordenadas.longitude) {
                    carregarMapa(imovel.coordenadas.latitude, imovel.coordenadas.longitude);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar imóvel:', error);
                showError('Erro ao carregar detalhes do imóvel');
            });
    }
    
    function renderizarImovel(imovel) {
        // Breadcrumb
        document.getElementById('breadcrumbTitle').textContent = imovel.titulo;
        
        // Título da página
        document.title = `${imovel.titulo} - UrbanNest`;
        
        // Imagem principal
        const mainImage = document.getElementById('mainImage');
        if (imovel.imagem_principal) {
            mainImage.src = imovel.imagem_principal;
            mainImage.alt = imovel.titulo;
        } else {
            mainImage.style.display = 'none';
            // Mostrar placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = '<i class="fas fa-home"></i><p>Sem imagem disponível</p>';
            mainImage.parentNode.appendChild(placeholder);
        }
        
        // Preço e status
        document.getElementById('priceTag').textContent = formatarPreco(imovel.preco) + '/mês';
        document.getElementById('statusTag').textContent = imovel.status === 'disponivel' ? 'Disponível' : 'Indisponível';
        
        // Informações básicas
        document.getElementById('imovelTitulo').textContent = imovel.titulo;
        document.getElementById('imovelEndereco').textContent = imovel.endereco.completo;
        document.getElementById('quartos').textContent = imovel.quartos;
        document.getElementById('banheiros').textContent = imovel.banheiros;
        document.getElementById('area').textContent = imovel.area;
        document.getElementById('tipo').textContent = imovel.tipo.charAt(0).toUpperCase() + imovel.tipo.slice(1);
        
        // Descrição
        document.getElementById('descricao').textContent = imovel.descricao || 'Descrição não disponível.';
        
        // Galeria de imagens (se houver)
        if (imovel.imagens_adicionais) {
            try {
                const imagens = JSON.parse(imovel.imagens_adicionais);
                renderizarGaleria(imagens);
            } catch (e) {
                console.warn('Erro ao parsear imagens adicionais:', e);
            }
        }
    }
    
    function renderizarGaleria(imagens) {
        const gallery = document.getElementById('thumbnailGallery');
        gallery.innerHTML = '';
        
        imagens.forEach((imagem, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            thumbnail.innerHTML = `<img src="${imagem}" alt="Imagem ${index + 1}">`;
            
            thumbnail.addEventListener('click', function() {
                document.getElementById('mainImage').src = imagem;
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
            
            gallery.appendChild(thumbnail);
        });
        
        // Marcar primeira como ativa
        if (gallery.firstChild) {
            gallery.firstChild.classList.add('active');
        }
    }
    
    function carregarMapa(lat, lng) {
        // Verificar se o Google Maps está disponível
        if (typeof google === 'undefined') {
            // Carregar Google Maps API
            carregarGoogleMapsAPI().then(() => {
                inicializarMapa(lat, lng);
            }).catch(error => {
                console.error('Erro ao carregar Google Maps:', error);
                mostrarPlaceholderMapa();
            });
        } else {
            inicializarMapa(lat, lng);
        }
    }
    
    function carregarGoogleMapsAPI() {
        return new Promise((resolve, reject) => {
            // Para um projeto real, você precisaria de uma chave de API válida
            // const API_KEY = 'SUA_CHAVE_GOOGLE_MAPS_API';
            
            // Para demonstração, vamos simular o carregamento
            setTimeout(() => {
                // Simular que a API não está disponível (para demonstração)
                reject(new Error('Google Maps API não configurada'));
            }, 1000);
            
            // Código real seria:
            // const script = document.createElement('script');
            // script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
            // script.async = true;
            // script.defer = true;
            // document.head.appendChild(script);
            // window.initMap = resolve;
        });
    }
    
    function inicializarMapa(lat, lng) {
        const mapElement = document.getElementById('map');
        const placeholder = document.getElementById('mapPlaceholder');
        
        // Esconder placeholder
        placeholder.style.display = 'none';
        mapElement.style.display = 'block';
        
        // Inicializar mapa
        map = new google.maps.Map(mapElement, {
            center: { lat: lat, lng: lng },
            zoom: 15,
            styles: [
                // Estilo personalizado do mapa
            ]
        });
        
        // Adicionar marcador
        new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            title: currentImovel.titulo,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="12" fill="#4285f4" stroke="white" stroke-width="2"/>
                        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12">🏠</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32)
            }
        });
    }
    
    function mostrarPlaceholderMapa() {
        const placeholder = document.getElementById('mapPlaceholder');
        placeholder.innerHTML = `
            <i class="fas fa-map-marked-alt"></i>
            <p>Mapa não disponível</p>
            <small>Google Maps API não configurada</small>
            <div style="margin-top: 1rem; padding: 1rem; background: #f0f0f0; border-radius: 6px;">
                <strong>Endereço:</strong><br>
                ${currentImovel.endereco.completo}
            </div>
        `;
    }
    
    function carregarHorariosDisponiveis() {
        const dataVisita = document.getElementById('dataVisita').value;
        const horaSelect = document.getElementById('horaVisita');
        
        if (!dataVisita || !currentImovel) return;
        
        // Limpar opções atuais
        horaSelect.innerHTML = '<option value="">Carregando...</option>';
        
        fetch(`/api/agendamentos/horarios-disponiveis?imovel_id=${currentImovel.id}&data_visita=${dataVisita}`)
            .then(response => response.json())
            .then(data => {
                horaSelect.innerHTML = '<option value="">Selecione um horário</option>';
                
                data.horarios_disponiveis.forEach(horario => {
                    const option = document.createElement('option');
                    option.value = horario;
                    option.textContent = horario;
                    horaSelect.appendChild(option);
                });
                
                if (data.horarios_disponiveis.length === 0) {
                    horaSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar horários:', error);
                horaSelect.innerHTML = '<option value="">Erro ao carregar horários</option>';
            });
    }
    
    function agendarVisita() {
        const formData = new FormData(agendamentoForm);
        
        const agendamento = {
            imovel_id: currentImovel.id,
            nome_interessado: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            data_visita: formData.get('dataVisita'),
            hora_visita: formData.get('horaVisita'),
            mensagem: formData.get('mensagem') || ''
        };
        
        // Validação básica
        if (!agendamento.nome_interessado || !agendamento.email || !agendamento.telefone || 
            !agendamento.data_visita || !agendamento.hora_visita) {
            mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Desabilitar botão
        const submitBtn = agendamentoForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Agendando...';
        submitBtn.disabled = true;
        
        fetch('/api/agendamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(agendamento)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            mostrarNotificacao('Visita agendada com sucesso! Entraremos em contato em breve.', 'success');
            agendamentoForm.reset();
            
            // Recarregar horários disponíveis
            if (agendamento.data_visita) {
                document.getElementById('dataVisita').value = agendamento.data_visita;
                carregarHorariosDisponiveis();
            }
        })
        .catch(error => {
            console.error('Erro ao agendar visita:', error);
            mostrarNotificacao(error.message || 'Erro ao agendar visita. Tente novamente.', 'error');
        })
        .finally(() => {
            // Reabilitar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
    
    function compartilhar(type) {
        const url = window.location.href;
        const title = currentImovel ? currentImovel.titulo : 'Imóvel no UrbanNest';
        const text = `Confira este imóvel: ${title}`;
        
        switch (type) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    mostrarNotificacao('Link copiado para a área de transferência!', 'success');
                }).catch(() => {
                    mostrarNotificacao('Erro ao copiar link', 'error');
                });
                break;
        }
    }
    
    function showError(message) {
        loadingContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <a href="imoveis.html" class="btn-primary" style="margin-top: 1rem; display: inline-block; text-decoration: none;">
                    Voltar para Imóveis
                </a>
            </div>
        `;
    }
    
    // Carregar mapa quando a página carregar
    window.addEventListener('load', function() {
        if (currentImovel && currentImovel.coordenadas.latitude && currentImovel.coordenadas.longitude) {
            // Tentar carregar mapa novamente se não foi carregado
            if (!map) {
                mostrarPlaceholderMapa();
            }
        }
    });
});

