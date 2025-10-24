// JavaScript para a página de termos e política de privacidade

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se há uma aba específica na URL
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    if (tab === 'privacidade') {
        showTab('privacidade');
    }
});

function showTab(tabName) {
    // Esconder todas as abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remover classe active de todos os botões
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar a aba selecionada
    document.getElementById(tabName).classList.add('active');
    
    // Adicionar classe active ao botão correspondente
    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Atualizar URL sem recarregar a página
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('tab', tabName);
    window.history.replaceState({}, '', newUrl);
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

