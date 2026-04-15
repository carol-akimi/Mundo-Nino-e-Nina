let produtosMemoria = [];
let categoriasDisponiveis = new Set();
let termoBuscado = '';


document.getElementById('btn-login').addEventListener('click', () => {
    const senha = document.getElementById('pass-input').value;
    if (senha === 'lojista123') {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        carregarDados();
    } else {
        alert('Senha incorreta!');
    }
});

async function carregarDados() {
    try {
        const resposta = await fetch('data/produtos.json');
        produtosMemoria = await resposta.json();

        extrairCategorias();
        renderizarLista();
    } catch (e) {
        alert('Erro ao carregar banco local.');
    }
}

function extrairCategorias() {
    produtosMemoria.forEach(p => {
        if (p.categoria) categoriasDisponiveis.add(p.categoria);
    });
    renderizarCategorias();
}

function renderizarCategorias() {
    const select = document.getElementById('novo-categoria-select');
    select.innerHTML = '';

    categoriasDisponiveis.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });

    const novaOpt = document.createElement('option');
    novaOpt.value = 'nova_categoria';
    novaOpt.textContent = 'Criar Nova...';
    select.appendChild(novaOpt);
}

window.toggleNovaCategoria = function () {
    const select = document.getElementById('novo-categoria-select');
    const input = document.getElementById('novo-categoria-input');
    if (select.value === 'nova_categoria') {
        input.classList.remove('hidden');
        input.required = true;
    } else {
        input.classList.add('hidden');
        input.required = false;
    }
}

window.filtrarProdutos = function () {
    termoBuscado = document.getElementById('search-product').value.toLowerCase();
    renderizarLista();
}

function renderizarLista() {
    const scrollPos = window.scrollY;
    const container = document.getElementById('admin-products-list');
    container.innerHTML = '';

    const produtosFiltrados = produtosMemoria.filter(p => p.nome.toLowerCase().includes(termoBuscado));

    produtosFiltrados.forEach((produto) => {
        const div = document.createElement('div');
        div.className = 'admin-product-card';

        //previne que caracteres especiais quebrem o html
        const safeNome = produto.nome.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

        let headerHTML = ` 
            <div class="product-header product-header--top">
                <div class="product-header-info">
                   <h3 class="admin-product-title">${produto.nome}</h3>
                   <span class="product-meta">
                        ${produto.genero} | ${produto.categoria} 
                        <span class="price-wrapper"><span class="hide-on-mobile"> | </span>R$
                            <input type="number" step="0.01" min="0" class="input-sm no-spin input-price" value="${parseFloat(produto.preco).toFixed(2)}" onchange="setarPreco(this.dataset.nome, this.value)" data-nome="${safeNome}" title="Editar Preço">
                        </span>
                   </span>
                   <textarea class="admin-input admin-desc-inline" rows="2" onchange="setarDescricao(this.dataset.nome, this.value)" data-nome="${safeNome}" title="Editar Descrição" placeholder="Descrição do produto">${produto.descricao || ''}</textarea>
                </div>
                <div class="hide-on-mobile product-header-actions">
                    <button onclick="salvarProduto(this.dataset.nome)" data-nome="${safeNome}" class="admin-btn admin-btn--success admin-btn--md">Salvar</button>
                    <button onclick="removerProduto(this.dataset.nome)" data-nome="${safeNome}" class="admin-btn admin-btn--danger admin-btn--md">Deletar</button>
                </div>
            </div>
        `;

        let tamanhosHTML = '';
        produto.tamanhos.forEach((tam, indexTam) => {
            tamanhosHTML += `
                <div class="size-pill">
                    <strong>Tam: ${tam.tamanho}</strong> 
                    <button class="admin-btn admin-btn--muted admin-btn--xs" onclick="alterarQtd(this.dataset.nome, ${indexTam}, -1)" data-nome="${safeNome}">-</button>
                    <input type="number" class="input-sm no-spin size-qty-inline" value="${tam.estoque}" min="0" onchange="setarQtd(this.dataset.nome, ${indexTam}, this.value)" data-nome="${safeNome}">
                    <button class="admin-btn admin-btn--muted admin-btn--xs" onclick="alterarQtd(this.dataset.nome, ${indexTam}, 1)" data-nome="${safeNome}">+</button>
                    <button class="admin-btn admin-btn--danger admin-btn--xs" onclick="removerTamanho(this.dataset.nome, ${indexTam})" data-nome="${safeNome}" title="Remover Tamanho">x</button>
                </div>
            `;
        });

        let addSizeHTML = `
            <div class="add-size-container add-size-container--bottom">
                 <input type="text" placeholder="Ex: 10" class="input-sm">
                 <button onclick="adicionarTamanhoGrade(this.dataset.nome, this.previousElementSibling)" data-nome="${safeNome}" class="admin-btn admin-btn--primary admin-btn--sm">Adicionar Tamanho</button>
            </div>
        `;

        let temImagem = produto.imagem && !produto.imagem.includes('Sem+Foto');

        let imgControls = temImagem
            ? `<button class="admin-btn admin-btn--primary admin-btn--sm" onclick="removerImagem(this.dataset.nome)" data-nome="${safeNome}">Excluir Imagem</button>`
            : `<label class="admin-btn admin-btn--primary admin-btn--sm">
                  <input type="file" accept="image/*" class="hidden" onchange="adicionarImagem(this.dataset.nome)" data-nome="${safeNome}">
                  Adicionar Imagem
               </label>`;

        let bodyHTML = `
            <div class="product-card-body">
                <div class="product-image-section">
                    <img src="${produto.imagem || 'https://placehold.co/400x500/eaeaea/555555?text=Sem+Foto'}" class="admin-product-image" alt="Produto">
                    ${imgControls}
                </div>
                <div class="product-details-section">
                    ${headerHTML}
                    <div>
                        ${tamanhosHTML}
                    </div>
                    ${addSizeHTML}
                    <div class="show-on-mobile mobile-actions">
                        <button onclick="salvarProduto(this.dataset.nome)" data-nome="${safeNome}" class="admin-btn admin-btn--success admin-btn--lg mobile-btn">Salvar</button>
                        <button onclick="removerProduto(this.dataset.nome)" data-nome="${safeNome}" class="admin-btn admin-btn--danger admin-btn--lg mobile-btn">Deletar Produto</button>
                    </div>
                </div>
            </div>
        `;

        div.innerHTML = bodyHTML;
        container.appendChild(div);
    });

    window.scrollTo(0, scrollPos);
}

function indiceDoProduto(nome) {
    return produtosMemoria.findIndex(p => p.nome === nome);
}

window.alterarQtd = function (nome, tamIdx, mudanca) {
    let idx = indiceDoProduto(nome);
    if (idx === -1) return;
    let q = produtosMemoria[idx].tamanhos[tamIdx].estoque + mudanca;
    if (q < 0) q = 0;
    produtosMemoria[idx].tamanhos[tamIdx].estoque = q;
    renderizarLista();
}

window.setarQtd = function (nome, tamIdx, valor) {
    let idx = indiceDoProduto(nome);
    if (idx === -1) return;
    let q = parseInt(valor);
    if (isNaN(q) || q < 0) q = 0;
    produtosMemoria[idx].tamanhos[tamIdx].estoque = q;
    renderizarLista();
}

window.salvarProduto = function (nome) {
    let idx = indiceDoProduto(nome);
    if (idx === -1) return;
    console.log("Produto (Nome: " + nome + ") salvo no banco de dados. (sqn)");
}

window.removerProduto = function (nome) {
    let idx = indiceDoProduto(nome);
    if (idx === -1) return;
    if (confirm("Certeza que deseja remover a roupa do catálogo?")) {
        produtosMemoria.splice(idx, 1);
        renderizarLista();
    }
}

window.removerImagem = function (nome) {
    let idx = indiceDoProduto(nome);
    if (idx === -1) return;
    if (confirm("Remover imagem deste produto?")) {
        produtosMemoria[idx].imagem = 'https://placehold.co/400x500/eaeaea/555555?text=Sem+Foto';
        renderizarLista();
    }
}

window.adicionarImagem = function (nome) {
    let idx = indiceDoProduto(nome);
    if (idx === -1) return;
    produtosMemoria[idx].imagem = 'https://placehold.co/400x500/25d366/ffffff?text=Nova+Foto';
    renderizarLista();
}

window.setarPreco = function (nome, valor) {
    let idx = indiceDoProduto(nome);
    if (idx === -1) return;
    let p = parseFloat(valor);
    if (isNaN(p) || p < 0) p = 0;
    produtosMemoria[idx].preco = p;
    renderizarLista();
}

window.setarDescricao = function (nome, text) {
    let idx = indiceDoProduto(nome);
    if (idx === -1) return;
    produtosMemoria[idx].descricao = text.trim();
    renderizarLista();
}

window.removerTamanho = function (nome, tamIdx) {
    let idx = indiceDoProduto(nome);
    if (idx === -1) return;
    if (confirm("Remover este tamanho?")) {
        produtosMemoria[idx].tamanhos.splice(tamIdx, 1);
        renderizarLista();
    }
}

window.adicionarTamanhoGrade = function (nome, inputElement) {
    let idx = indiceDoProduto(nome);
    if (idx === -1) return;
    if (!inputElement || inputElement.value.trim() === '') return;

    produtosMemoria[idx].tamanhos.push({
        tamanho: inputElement.value.trim(),
        estoque: 1
    });
    renderizarLista();
}

// logica principal de criacao de formulario 
document.getElementById('form-novo').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('novo-nome').value.trim();

    // previne nomes iguais
    if (indiceDoProduto(nome) !== -1) {
        alert("Já existe um produto cadastrado com esse nome! Escolha um nome único.");
        return;
    }

    const preco = parseFloat(document.getElementById('novo-preco').value);
    const genero = document.getElementById('novo-genero').value;
    const desc = document.getElementById('novo-descricao').value;

    let categoria = document.getElementById('novo-categoria-select').value;
    if (categoria === 'nova_categoria') {
        categoria = document.getElementById('novo-categoria-input').value.trim();
        if (categoria !== '') {
            categoriasDisponiveis.add(categoria);
            renderizarCategorias();
        }
    }

    const obj = {
        nome: nome,
        preco: preco,
        descricao: desc,
        genero: genero,
        categoria: categoria || "Nova Categoria",
        imagem: "https://placehold.co/400x500/eaeaea/555555?text=Sem+Foto",
        destaque: false,
        tamanhos: []
    };

    produtosMemoria.unshift(obj);
    renderizarLista();
    document.getElementById('form-novo').reset();
    document.getElementById('novo-categoria-select').value = categoria;
    toggleNovaCategoria();
});
