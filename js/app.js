(function() {
'use strict';

const WHATSAPP_NUMBER = '5585996807771';
let todosProdutos = [];
let produtosAtuaisVitrine = [];

// Utilitário: previne injeção de HTML em conteúdo dinâmico
function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', async () => {
    // Carrega o "banco de dados"
    try {
        const resp = await fetch('data/produtos.json');
        todosProdutos = await resp.json();
        
        // Identifica qual página o browser está mostrando agora
        const page = document.body.dataset.page;
        const urlParams = new URLSearchParams(window.location.search);

        if (page === 'home') {
            renderizarDestaquesHome();
        } 
        else if (page === 'secoes') {
            const genero = urlParams.get('genero');
            renderizarSecoes(genero);
        }
        else if (page === 'vitrine') {
            const categoria = urlParams.get('categoria'); 
            const genero = urlParams.get('genero'); 
            const busca = urlParams.get('q');
            renderizarVitrine(categoria, genero, busca);

            // Adiciona listeners aos botões de ordenação
            document.querySelectorAll('.sort-link[data-sort]').forEach(btn => {
                btn.addEventListener('click', () => retomarOrdenacao(btn.dataset.sort));
            });
        }
        else if (page === 'produto') {
            const nome = urlParams.get('nome');
            renderizarProduto(nome);
        }

    } catch(err) {
        console.error("Erro ao carregar loja:", err);
        document.querySelectorAll('.grid-placeholder').forEach(el => {
            el.textContent = 'Erro ao carregar os produtos. Tente recarregar a página.';
        });
        const singleRoot = document.getElementById('single-product-root');
        if (singleRoot) singleRoot.innerHTML = '<p>Erro ao carregar os detalhes. Tente recarregar a página.</p>';
    }
});

// Funções Específicas de cada Página //

// HOME
function renderizarDestaquesHome() {
    const container = document.getElementById('highlights-grid');
    if (!container) return;

    // Pega só os que tem destaque: true
    const destaques = todosProdutos.filter(p => p.destaque === true).slice(0, 6); // Máximo de 6 destaques

    container.innerHTML = destaques.map(prod => formatarCardGenerico(prod)).join('');
}


// SEÇÕES (Meninos ou Meninas)
function renderizarSecoes(genero) {
    const container = document.getElementById('categories-grid');
    const titulo = document.getElementById('secao-title');
    if (!container) return;

    let categorias = [];
    if (genero === 'menino') {
        titulo.textContent = "Mundo Nino";
        document.title = "Catálogo - Mundo Nino";
    } else {
        titulo.textContent = "Mundo Nina";
        document.title = "Catálogo - Mundo Nina";
    }

    // Filtra os produtos pelo gênero selecionado e pega suas categorias únicas.
    const produtosDoGenero = todosProdutos.filter(p => p.genero === genero);
    categorias = [...new Set(produtosDoGenero.map(p => p.categoria))];

    if (categorias.length === 0) {
        container.innerHTML = `<p class="grid-placeholder">Nenhuma categoria encontrada.</p>`;
        return;
    }

    container.innerHTML = categorias.map(cat => `
        <a href="vitrine.html?genero=${genero}&categoria=${cat}" class="category-card">
            ${cat}
        </a>
    `).join('');
}


// VITRINE (A Categoria Específica ou Resultados de Busca)
function renderizarVitrine(categoria, genero, busca) {
    const container = document.getElementById('products-grid');
    const titulo = document.getElementById('vitrine-title');
    if (!container) return;

    let filtrados = [];

    if (busca) {
        titulo.textContent = `Resultados para: "${busca}"`;
        document.title = `Busca: ${busca}`;
        
        // Normaliza removendo acentos e converte para minúsculo
        const normalizar = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const termo = normalizar(busca);
        filtrados = todosProdutos.filter(p => 
            normalizar(p.nome).includes(termo) || 
            normalizar(p.categoria).includes(termo)
        );
    } else {
        titulo.textContent = `${categoria}`;
        document.title = `${categoria} - Mundo ${genero === 'menino' ? 'Nino' : 'Nina'}`;
        filtrados = todosProdutos.filter(p => p.genero === genero && p.categoria === categoria);
    }

    produtosAtuaisVitrine = filtrados;
    retomarOrdenacao('alfa'); // padrão
}

function retomarOrdenacao(ordem) {
    const container = document.getElementById('products-grid');
    if (!container) return;

    let lista = [...produtosAtuaisVitrine];

    if (ordem === 'alfa') {
        lista.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordem === 'cresc') {
        lista.sort((a, b) => a.preco - b.preco);
    } else if (ordem === 'decresc') {
        lista.sort((a, b) => b.preco - a.preco);
    }

    if (lista.length === 0) {
        container.innerHTML = `<p class="grid-placeholder">Nenhum produto encontrado.</p>`;
    } else {
        container.innerHTML = lista.map(prod => formatarCardGenerico(prod)).join('');
    }
}


// PRODUTO (Detalhes e WhatsApp)
function renderizarProduto(nomeProdutoStr) {
    const container = document.getElementById('single-product-root');
    if (!container) return;

    if (!nomeProdutoStr) {
        container.innerHTML = `<p>Produto não encontrado.</p>`;
        return;
    }

    const produto = todosProdutos.find(p => p.nome === nomeProdutoStr);

    if (!produto) {
        container.innerHTML = `<p>Produto não encontrado.</p>`;
        return;
    }

    document.title = produto.nome;

    const precoFmt = produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const nomeSafe = escapeHTML(produto.nome);
    const descSafe = escapeHTML(produto.descricao);

    let sizesHtml = produto.tamanhos.map(t => {
        const disabled = t.estoque === 0 ? 'disabled' : '';
        return `<button class="size-btn" data-tam="${escapeHTML(t.tamanho)}" ${disabled}>${escapeHTML(t.tamanho)}</button>`;
    }).join('');

    container.innerHTML = `
        <img class="single-product-img" src="${escapeHTML(produto.imagem)}" alt="${nomeSafe}">
        <div>
            <h2>${nomeSafe}</h2>
            <p class="product-price single-product-price">${precoFmt}</p>
            <p class="single-desc">${descSafe}</p>
            <p class="size-label">Tamanhos Disponíveis:</p>
            <div class="size-grid">${sizesHtml}</div>
            <button class="btn-buy" id="checkout-btn" disabled>Selecione um tamanho</button>
        </div>
    `;

    // Lógica do botão
    const sizeBtns = container.querySelectorAll('.size-btn:not(:disabled)');
    const btnBuy = document.getElementById('checkout-btn');
    let tamanhoSelecionado = null;

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            sizeBtns.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            tamanhoSelecionado = e.target.getAttribute('data-tam');
            btnBuy.disabled = false;
            btnBuy.textContent = "Comprar pelo WhatsApp";
        });
    });

    btnBuy.addEventListener('click', () => {
        if (!tamanhoSelecionado) return;
        const urlProduto = window.location.href;
        const textoBase = `Olá! Tenho interesse no produto: "${produto.nome}", tamanho ${tamanhoSelecionado}. Você pode me passar mais detalhes?\n\nLink do produto: ${urlProduto}`;
        const msg = encodeURIComponent(textoBase);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    });
}


//  FUNÇÃO UTILITÁRIA  //
// Gera a caixinha do produto que leva para tela de Detalhes
function formatarCardGenerico(produto) {
    const preco = produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const nome = escapeHTML(produto.nome);
    return `
        <a class="product-card" href="produto.html?nome=${encodeURIComponent(produto.nome)}">
            <img class="product-image" src="${escapeHTML(produto.imagem)}" alt="${nome}">
            <div class="product-info">
                <h3 class="product-title">${nome}</h3>
                <p class="product-price">${preco}</p>
            </div>
        </a>
    `;
}

})();
