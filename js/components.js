document.addEventListener('DOMContentLoaded', () => {
    // Injetar TopBar (Header)
    const headerHTML = `
        <header class="topbar">
            <a href="index.html" class="topbar-logo">
                <img src="data/logo.jpg" alt="Logo" class="topbar-logo-img">
                <div class="topbar-logo-text">
                    <span>Mundo Nino</span>
                    <span>& Nina</span>
                </div>
            </a>
            
            <div class="topbar-search">
                <form action="vitrine.html" method="GET">
                    <input type="text" name="q" placeholder="Buscar produto..." required>
                    <button type="submit">Buscar</button>
                </form>
            </div>
            <div class="topbar-icons">
                <!-- Icone IG Nino -->
                <a href="https://www.instagram.com/lojamundonino/" target="_blank" title="Instagram Mundo Nino" aria-label="Instagram Mundo Nino">
                    <svg class="icon icon-nino" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                </a>
                <!-- Icone IG Nina -->
                <a href="https://www.instagram.com/lojamundonina/" target="_blank" title="Instagram Mundo Nina" aria-label="Instagram Mundo Nina">
                    <svg class="icon icon-nina" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                </a>
                <!-- Icone WPP -->
                <a href="https://wa.me/5585996807771?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20loja%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida." target="_blank" title="Nosso WhatsApp" aria-label="WhatsApp">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                </a>
            </div>
        </header>
    `;

    // Injetar Footer
    const footerHTML = `
    <footer>
    <div class="footer-wrap">
        <div class="brand">Mundo Nino & Nina</div>
        <div class="footer-grid">

        <div class="footer-col">
            <h4>Contato</h4>
            <a href="https://wa.me/5585996807771?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20loja%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida." target="_blank">(85) 99680-7771</a>
            <span class="muted">WhatsApp / Telefone</span>
            <a href="https://www.instagram.com/lojamundonino/" target="_blank" class="instagram">@lojamundonino</a>
            <a href="https://www.instagram.com/lojamundonina/" target="_blank">@lojamundonina</a>
            <span class="muted">Instagram</span>
            </div>

        <div class="footer-col">
            <h4>Endereço</h4>
            <span>Rua Oswaldo Cruz, 2200</span>
            <span>Prédio Coigra</span>
        </div>

        <div class="footer-col">
            <h4>Atendimento</h4>
            <span>Segunda a sexta</span>
            <span class="horario">8h – 17h</span>
            <span class="muted">Atendimento presencial somente com hora marcada</span>
        </div>

        <div class="footer-col">
            <h4>Políticas</h4>
            <a href="politicas.html">Políticas de Troca e Frete</a>
        </div>

        </div>

        <div class="footer-bottom">
        <span>© 2025 Mundo Nino & Nina</span>
        <div class="footer-bottom-links">
            <a href="admin.html">Lojista</a>
        </div>
        </div>
    </div>
    </footer>
    `;

    // Acha os placeholders e injeta
    const rootHeader = document.getElementById('global-header');
    if (rootHeader) rootHeader.innerHTML = headerHTML;

    const rootFooter = document.getElementById('global-footer');
    if (rootFooter) rootFooter.innerHTML = footerHTML;

    // Script da Newsletter via alerta
    const formNl = document.getElementById('nl-form');
    if (formNl) {
        formNl.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Obrigado por se inscrever!");
            formNl.reset();
        });
    }
});
