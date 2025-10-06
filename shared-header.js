(function(global) {
  const ROLE_CONFIG = {
    SUPERADMIN: {
      links: [
        { href: 'dashboard.html', icon: 'fas fa-chart-line', label: 'Dashboard' },
        { href: 'index.html', icon: 'fas fa-network-wired', label: 'Operateri' },
        { action: 'add-operator', icon: 'fas fa-plus-circle', label: 'Dodaj operatera' },
        { href: 'user-management.html', icon: 'fas fa-users-cog', label: 'Upravljanje korisnicima' },
        { href: 'system-logs.html', icon: 'fas fa-clipboard-list', label: 'Sistemski logovi' }
      ],
      permissions: { manageOperators: true, importData: false, exportData: false }
    },
    ADMIN: {
      links: [
        { href: 'dashboard.html', icon: 'fas fa-chart-line', label: 'Dashboard' },
        { href: 'index.html', icon: 'fas fa-network-wired', label: 'Operateri' },
        { href: 'user-management.html', icon: 'fas fa-users', label: 'Korisnici agencije' },
        { href: 'system-logs.html', icon: 'fas fa-clipboard-list', label: 'Sistemski logovi' }
      ],
      permissions: { manageOperators: false, importData: false, exportData: false }
    },
    KORISNIK: {
      links: [
        { href: 'dashboard.html', icon: 'fas fa-chart-line', label: 'Dashboard' },
        { href: 'index.html', icon: 'fas fa-network-wired', label: 'Operateri' },
        { href: 'system-logs.html?tab=my', icon: 'fas fa-user-check', label: 'Moje aktivnosti' }
      ],
      permissions: { manageOperators: false, importData: false, exportData: false }
    }
  };

  const TEMPLATE = document.getElementById('atlasHeaderTemplate')
    ? document.getElementById('atlasHeaderTemplate').innerHTML
    : null;

  const actionHandlers = new Map();
  let documentClickHandler = null;

  function resolveHref(link) {
    if (!link || !link.href) {
      return '#';
    }

    const href = link.href;
    if (/^(?:https?:|mailto:|tel:|#|\/\/)/i.test(href)) {
      return href;
    }

    return href;
  }

  function ensureTemplateHTML() {
    const existing = document.querySelector('.atlas-header');
    if (existing) {
      return existing;
    }

    const mount = document.getElementById('atlasHeaderMount');
    const target = mount || document.body;
    const html = TEMPLATE || global.ATLAS_HEADER_TEMPLATE || `<!-- ATLAS Unified Header -->
<header class="atlas-header">
    <div class="atlas-header__main">
        <div class="atlas-header__branding">
            <i class="fas fa-satellite-dish"></i>
            <div class="atlas-header__title">
                <h1>ATLAS</h1>
                <span>Telekomunikacioni operateri BiH</span>
            </div>
        </div>
        <div class="atlas-header__actions" id="atlasHeaderActions">
            <button class="help-btn" id="atlasHelpBtn" type="button" title="Pomoć i uputstva">
                <i class="fas fa-question-circle"></i>
            </button>
        </div>
        <div class="atlas-header__user" id="atlasHeaderUser">
            <button class="user-chip" id="atlasUserChip" type="button">
                <span class="user-avatar"><i class="fas fa-user"></i></span>
                <span class="user-text">
                    <span class="user-name" id="atlasUserName">Korisnik</span>
                    <span class="user-role" id="atlasUserRole">Rola</span>
                </span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-dropdown" id="atlasUserDropdown">
                <div class="user-dropdown-section">
                    <strong id="atlasDropdownName">Korisnik</strong>
                    <small id="atlasDropdownEmail"></small>
                    <span class="user-dropdown-agency" id="atlasDropdownAgency"></span>
                </div>
                <div class="user-dropdown-links" id="atlasDropdownLinks"></div>
                <div class="user-dropdown-divider"></div>
                <div class="user-dropdown-footer" id="atlasDropdownFooter"></div>
                <button class="user-dropdown-logout" id="atlasLogoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    Odjavi se
                </button>
            </div>
        </div>
    </div>
</header>`;

    if (mount) {
      mount.innerHTML = html;
      return mount.querySelector('.atlas-header');
    }

    target.insertAdjacentHTML('afterbegin', html);
    return target.querySelector('.atlas-header');
  }

  function getRoleConfig(role) {
    return ROLE_CONFIG[role] || ROLE_CONFIG.KORISNIK;
  }

  function computePermissions(role) {
    return { ...ROLE_CONFIG.KORISNIK.permissions, ...(ROLE_CONFIG[role]?.permissions || {}) };
  }

  function renderHeaderUser(user) {
    const header = ensureTemplateHTML();
    if (!header) return;

    const userContainer = document.getElementById('atlasHeaderUser');
    if (!user) {
      if (userContainer) userContainer.style.display = 'none';
      return;
    }

    if (userContainer) userContainer.style.display = '';

    const userNameDisplay = document.getElementById('atlasUserName');
    const userRoleDisplay = document.getElementById('atlasUserRole');
    const dropdownName = document.getElementById('atlasDropdownName');
    const dropdownEmail = document.getElementById('atlasDropdownEmail');
    const dropdownAgency = document.getElementById('atlasDropdownAgency');

    if (userNameDisplay) {
      // Try Redis session format first (full_name), then fall back to legacy format (ime + prezime)
      const displayName = user.full_name || `${user.ime || ''} ${user.prezime || ''}`.trim() || user.username || 'Korisnik';
      userNameDisplay.textContent = displayName;
    }
    if (userRoleDisplay) userRoleDisplay.textContent = roleToDisplay(user.role);
    if (dropdownName) {
      // Try Redis session format first (full_name), then fall back to legacy format (ime + prezime)
      const displayName = user.full_name || `${user.ime || ''} ${user.prezime || ''}`.trim() || user.username || 'Korisnik';
      dropdownName.textContent = displayName;
    }
    if (dropdownEmail) dropdownEmail.textContent = user.email || 'Nije postavljeno';
    if (dropdownAgency) dropdownAgency.textContent = user.agencija_naziv || 'ATLAS sistem';

    renderRoleLinks(user.role);
    renderFooterLinks();
    initDropdown();
  }

  function renderRoleLinks(role) {
    const container = document.getElementById('atlasDropdownLinks');
    if (!container) return;

    const config = getRoleConfig(role);
    container.innerHTML = config.links.map(link => buildLinkHTML(link)).join('');

    container.querySelectorAll('[data-action]').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        handleAction(link.dataset.action);
      });
    });
  }

  function renderFooterLinks() {
    const footer = document.getElementById('atlasDropdownFooter');
    if (!footer) return;

    const profileLink = resolveHref({ href: 'moj-profil.html' });
    const settingsLink = resolveHref({ href: 'postavke.html' });

    footer.innerHTML = `
      <a href="${profileLink}" class="user-dropdown-link">
        <i class="fas fa-user-circle"></i>
        <span>Moj profil</span>
      </a>
      <a href="${settingsLink}" class="user-dropdown-link">
        <i class="fas fa-cog"></i>
        <span>Postavke</span>
      </a>
    `;
  }

  function initSharedHeader(user, options = {}) {
    ensureTemplateHTML();
    renderHeaderUser(user || null);
    if (options && Object.prototype.hasOwnProperty.call(options, 'actions')) {
      setActions(options.actions);
    }
    return computePermissions(user?.role);
  }

  function buildLinkHTML(link) {
    if (link.action) {
      return `<a href="#" class="user-dropdown-link" data-action="${link.action}">`
        + `<i class="${link.icon}"></i>`
        + `<span>${link.label}</span>`
        + `</a>`;
    }

    const href = resolveHref(link);
    return `<a href="${href}" class="user-dropdown-link">`
      + `<i class="${link.icon}"></i>`
      + `<span>${link.label}</span>`
      + `</a>`;
  }

  function initDropdown() {
    const userChip = document.getElementById('atlasUserChip');
    const dropdown = document.getElementById('atlasUserDropdown');
    if (!userChip || !dropdown) return;

    userChip.addEventListener('click', (event) => {
      event.stopPropagation();
      dropdown.classList.toggle('active');
    });

    dropdown.addEventListener('click', (event) => event.stopPropagation());

    if (documentClickHandler) {
      document.removeEventListener('click', documentClickHandler);
    }
    documentClickHandler = () => dropdown.classList.remove('active');
    document.addEventListener('click', documentClickHandler);

    const logoutBtn = document.getElementById('atlasLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await AuthSystem.logout();
      });
    }

    // Help button functionality
    const helpBtn = document.getElementById('atlasHelpBtn');
    if (helpBtn) {
      helpBtn.addEventListener('click', (event) => {
        event.preventDefault();
        showHelpModal();
      });
    }
  }

  function handleAction(action) {
    if (!action) return;
    if (actionHandlers.has(action)) {
      actionHandlers.get(action)();
      return;
    }

    if (action === 'add-operator') {
      global.location.href = 'index.html#add-operator';
      return;
    }

    global.dispatchEvent(new CustomEvent('atlas-header-action', { detail: { action } }));
  }

  function roleToDisplay(role) {
    const map = {
      SUPERADMIN: 'Super Administrator',
      ADMIN: 'Administrator',
      KORISNIK: 'Korisnik'
    };
    return map[role] || role;
  }

  function onAction(action, handler) {
    actionHandlers.set(action, handler);
  }

  function setActions(html) {
    const container = document.getElementById('atlasHeaderActions');
    if (!container) return;
    if (!html) {
      container.innerHTML = '';
      return;
    }
    if (typeof html === 'string') {
      container.innerHTML = html;
    } else if (html instanceof Element) {
      container.innerHTML = '';
      container.appendChild(html);
    } else if (Array.isArray(html)) {
      container.innerHTML = '';
      html.forEach(node => {
        if (typeof node === 'string') {
          container.insertAdjacentHTML('beforeend', node);
        } else if (node instanceof Element) {
          container.appendChild(node);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', ensureTemplateHTML);

  // Help Modal functionality
  function showHelpModal() {
    // Remove existing modal if present
    const existingModal = document.getElementById('atlasHelpModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Check if first-time visit (for pulse animation)
    const isFirstTime = !localStorage.getItem('atlasHelpVisited');
    if (isFirstTime) {
      localStorage.setItem('atlasHelpVisited', 'true');
    }

    // Create help modal
    const helpModal = document.createElement('div');
    helpModal.id = 'atlasHelpModal';
    helpModal.className = 'atlas-help-modal';
    helpModal.innerHTML = `
        <div class="help-modal-overlay"></div>
        <div class="help-modal-content">
          <div class="help-modal-header">
            <h2><i class="fas fa-life-ring"></i> ATLAS Pomoc i uputstvo</h2>
            <button class="help-modal-close" type="button" aria-label="Zatvori pomoc">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <!-- Tab Navigation -->
          <div class="help-tabs" role="tablist">
            <button class="help-tab active" data-tab="overview" role="tab" aria-selected="true">
              <i class="fas fa-home"></i>
              <span>Pregled</span>
            </button>
            <button class="help-tab" data-tab="roles" role="tab" aria-selected="false">
              <i class="fas fa-users-cog"></i>
              <span>Role</span>
            </button>
            <button class="help-tab" data-tab="features" role="tab" aria-selected="false">
              <i class="fas fa-toolbox"></i>
              <span>Funkcije</span>
            </button>
            <button class="help-tab" data-tab="faq" role="tab" aria-selected="false">
              <i class="fas fa-question-circle"></i>
              <span>FAQ</span>
            </button>
            <button class="help-tab" data-tab="contact" role="tab" aria-selected="false">
              <i class="fas fa-headset"></i>
              <span>Kontakt</span>
            </button>
          </div>

          <div class="help-content">
            <!-- Overview Tab -->
            <div class="help-tab-panel active" id="tab-overview" role="tabpanel">
              <div class="help-intro">
              <div class="help-logo">
                <i class="fas fa-satellite-dish"></i>
              </div>
              <h3>ATLAS</h3>
              <p class="help-subtitle">Advanced Telecommunication Legal Access System</p>
              <p>Centralizovani sistem za policijske agencije u BiH za brz, siguran i zakonski uskladjen pristup informacijama o telekom operaterima.</p>
              <div class="help-badges">
                <span class="help-badge"><i class="fas fa-lock"></i> Sigurni podaci</span>
                <span class="help-badge"><i class="fas fa-user-shield"></i> Role-based pristup</span>
                <span class="help-badge"><i class="fas fa-sync"></i> Real-time azuriranja</span>
              </div>
            </div>

            <div class="help-section">
              <h3><i class="fas fa-compass"></i> Brzi pregled sistema</h3>
              <div class="help-info-grid">
                <div class="help-info-card">
                  <h4><i class="fas fa-database"></i> Centralizacija informacija</h4>
                  <p>Jedinstvena baza svih operatera sa kontaktima, infrastrukturom, zonama pokrivanja i historijom azuriranja.</p>
                </div>
                <div class="help-info-card">
                  <h4><i class="fas fa-balance-scale-left"></i> Zakonske obaveze</h4>
                  <p>Pregled implementiranih presretanja, pristupa obracunskim podacima i rokova ispunjenja zakonskih zahtjeva.</p>
                </div>
                <div class="help-info-card">
                  <h4><i class="fas fa-shield-alt"></i> Audit trail</h4>
                  <p>Sve radnje se biljeze sa detaljima o korisniku, vremenu, IP adresi i statusu akcije radi sigurnosne revizije.</p>
                </div>
                <div class="help-info-card">
                  <h4><i class="fas fa-handshake"></i> Koordinacija agencija</h4>
                  <p>Role-based pristup i zajednicki standardi omogucavaju saradnju izmedu drzavnih, entitetskih i kantonalnih jedinica.</p>
                </div>
              </div>
            </div>

            <div class="help-section">
              <h3><i class="fas fa-compass"></i> Brzi pregled sistema</h3>
              <div class="help-info-grid">
                <div class="help-info-card">
                  <h4><i class="fas fa-database"></i> Centralizacija informacija</h4>
                  <p>Jedinstvena baza svih operatera sa kontaktima, infrastrukturom, zonama pokrivanja i historijom azuriranja.</p>
                </div>
                <div class="help-info-card">
                  <h4><i class="fas fa-balance-scale-left"></i> Zakonske obaveze</h4>
                  <p>Pregled implementiranih presretanja, pristupa obracunskim podacima i rokova ispunjenja zakonskih zahtjeva.</p>
                </div>
                <div class="help-info-card">
                  <h4><i class="fas fa-shield-alt"></i> Audit trail</h4>
                  <p>Sve radnje se biljeze sa detaljima o korisniku, vremenu, IP adresi i statusu akcije radi sigurnosne revizije.</p>
                </div>
                <div class="help-info-card">
                  <h4><i class="fas fa-handshake"></i> Koordinacija agencija</h4>
                  <p>Role-based pristup i zajednicki standardi omogucavaju saradnju izmedu drzavnih, entitetskih i kantonalnih jedinica.</p>
                </div>
              </div>
            </div>

            <div class="help-section">
              <h3><i class="fas fa-route"></i> Radni tok - korak po korak</h3>
              <div class="help-steps">
                <div class="help-step">
                  <span class="help-step-number">1</span>
                  <div>
                    <h4>Prijava i sigurnost</h4>
                    <p>Unesite korisnicko ime i lozinku, koristite opciju "Zapamti me" samo na sigurnim uredjajima.</p>
                  </div>
                </div>
                <div class="help-step">
                  <span class="help-step-number">2</span>
                  <div>
                    <h4>Dashboard i navigacija</h4>
                    <p>Koristite gornji meni i breadcrumb navigaciju za brz pristup.</p>
                  </div>
                </div>
                <div class="help-step">
                  <span class="help-step-number">3</span>
                  <div>
                    <h4>Pretraga operatera</h4>
                    <p>U search bar unesite naziv, grad ili tehnologiju.</p>
                  </div>
                </div>
                <div class="help-step">
                  <span class="help-step-number">4</span>
                  <div>
                    <h4>Rad sa podacima</h4>
                    <p>Dodajte, uredite ili pregledajte operatera kroz modal formu.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Roles Tab -->
          <div class="help-tab-panel" id="tab-roles" role="tabpanel">
            <div class="help-section">
              <h3><i class="fas fa-users-cog"></i> Korisnicke role i ovlastenja</h3>
              <div class="help-role-grid">
                <div class="help-role-card">
                  <h4><i class="fas fa-crown"></i> Super administrator</h4>
                  <p class="help-role-summary">Potpuna kontrola nad sistemom i bezbjednosnim politikama.</p>
                  <ul>
                    <li>Upravljanje svim operaterima i korisnicima</li>
                    <li>Pristup sistemskim logovima i audit trail zapisima</li>
                    <li>Import/Export podataka i podesavanje konfiguracije</li>
                  </ul>
                  <div class="help-role-expect">
                    <strong>Sta ocekivati:</strong>
                    <span>Dashboard sa globalnim statistikama, upozorenjima i brzim akcijama.</span>
                  </div>
                </div>
                <div class="help-role-card">
                  <h4><i class="fas fa-user-shield"></i> Administrator agencije</h4>
                  <p class="help-role-summary">Fokus na korisnike i aktivnosti svoje institucije.</p>
                  <ul>
                    <li>Upravljanje nalozima i rolama unutar agencije</li>
                    <li>Pregled operatera i logova (read-only)</li>
                    <li>Generisanje izvjestaja za nadredjene</li>
                  </ul>
                  <div class="help-role-expect">
                    <strong>Sta ocekivati:</strong>
                    <span>Statistike koristenja po agenciji i pregled najbitnijih aktivnosti.</span>
                  </div>
                </div>
                <div class="help-role-card">
                  <h4><i class="fas fa-user-check"></i> Operativni korisnik</h4>
                  <p class="help-role-summary">Brz pristup operaterima i licnim podacima.</p>
                  <ul>
                    <li>Detaljan pregled operatera i kontakata (read-only)</li>
                    <li>Koristenje naprednih filtera i eksport osnovnih izvjestaja</li>
                    <li>Upravljanje vlastitim profilom i pregled licnih aktivnosti</li>
                  </ul>
                  <div class="help-role-expect">
                    <strong>Sta ocekivati:</strong>
                    <span>Personalizovani dashboard i notifikacije o promjenama podataka.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Features Tab -->
          <div class="help-tab-panel" id="tab-features" role="tabpanel">
            <div class="help-section">
              <h3><i class="fas fa-toolbox"></i> Kljucne funkcionalnosti</h3>
              <div class="help-feature-grid">
                <div class="help-feature-card">
                  <h4><i class="fas fa-broadcast-tower"></i> Operateri</h4>
                  <ul>
                    <li>Detaljne karte pokrivanja, tehnicke specifikacije i kontakt informacije</li>
                    <li>Status zakonskih obaveza sa vizuelnim indikatorima</li>
                    <li>Export podataka za offline rad ili analizu</li>
                  </ul>
                </div>
                <div class="help-feature-card">
                  <h4><i class="fas fa-users"></i> Korisnici</h4>
                  <ul>
                    <li>Kreiranje novih naloga uz provjeru podataka u realnom vremenu</li>
                    <li>Dodjeljivanje rola i reset lozinki kroz siguran workflow</li>
                    <li>Historija izmjena rola i pristupnih prava</li>
                  </ul>
                </div>
                <div class="help-feature-card">
                  <h4><i class="fas fa-chart-line"></i> Dashboard</h4>
                  <ul>
                    <li>Kljucni indikatori: broj operatera, aktivne dozvole, recentne aktivnosti</li>
                    <li>Brze akcije za ceste zadatke i globalni search</li>
                    <li>Notifikacije o azuriranjima i compliance statusu</li>
                  </ul>
                </div>
                <div class="help-feature-card">
                  <h4><i class="fas fa-clipboard-list"></i> System logs</h4>
                  <ul>
                    <li>Audit zapis svake akcije sa korisnikom, vremenom, IP adresom i statusom</li>
                    <li>Filteri po roli, tipu akcije, vremenu i statusu</li>
                    <li>CSV export za dodatnu forenzicku analizu</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="help-section">
              <h3><i class="fas fa-shield-alt"></i> Sigurnosne smjernice</h3>
              <ul class="help-guidelines">
                <li>Redovno mijenjajte lozinku (najmanje svaka tri mjeseca) i odmah prijavite sumnjive aktivnosti.</li>
                <li>Koristite dvosmjernu autentifikaciju kada je dostupna i pratite aktivne sesije.</li>
                <li>Ne dijelite podatke iz sistema izvan ovlastenih kanala.</li>
                <li>Za hitne situacije koristite prioritetne kontakte operatera.</li>
              </ul>
            </div>
          </div>

          <!-- FAQ Tab -->
          <div class="help-tab-panel" id="tab-faq" role="tabpanel">
            <div class="help-section">
              <h3><i class="fas fa-question-circle"></i> Cesto postavljana pitanja</h3>
              <div class="help-faq">
                <div class="help-faq-item">
                  <button class="help-faq-question" type="button">
                    Ne mogu se prijaviti u sistem
                    <i class="fas fa-chevron-down help-faq-icon"></i>
                  </button>
                  <div class="help-faq-answer">
                    <p>Provjerite sledece:</p>
                    <ul>
                      <li>Da li unosite tacno korisnicko ime i lozinku</li>
                      <li>Da li je CapsLock ukljucen</li>
                      <li>Resetujte lozinku preko "Zaboravili ste lozinku?"</li>
                      <li>Kontaktirajte administratora nakon tri netacna pokusaja</li>
                    </ul>
                  </div>
                </div>

                <div class="help-faq-item">
                  <button class="help-faq-question" type="button">
                    Nema rezultata pretrage
                    <i class="fas fa-chevron-down help-faq-icon"></i>
                  </button>
                  <div class="help-faq-answer">
                    <p>Preporuceni koraci:</p>
                    <ul>
                      <li>Prosirite kriterije pretrage</li>
                      <li>Uklonite restriktivne filtere</li>
                      <li>Pokusajte alternativne kljucne rijeci</li>
                      <li>Provjerite tip operatera koji pretrazujete</li>
                    </ul>
                  </div>
                </div>

                <div class="help-faq-item">
                  <button class="help-faq-question" type="button">
                    Sporo ucitavanje podataka
                    <i class="fas fa-chevron-down help-faq-icon"></i>
                  </button>
                  <div class="help-faq-answer">
                    <p>Moguca rjesenja:</p>
                    <ul>
                      <li>Osvjezite stranicu (F5)</li>
                      <li>Ocistite cache preglednika</li>
                      <li>Provjerite internet konekciju</li>
                      <li>Prijavite IT podrsci ako se ponavlja</li>
                    </ul>
                  </div>
                </div>

                <div class="help-faq-item">
                  <button class="help-faq-question" type="button">
                    Pristup odbijen (403 greska)
                    <i class="fas fa-chevron-down help-faq-icon"></i>
                  </button>
                  <div class="help-faq-answer">
                    <p>Provjerite svoju rolu i dozvole. Za prosirenje pristupa obratite se administratoru ili super administratoru.</p>
                  </div>
                </div>

                <div class="help-faq-item">
                  <button class="help-faq-question" type="button">
                    Kako mijenjam podatke operatera?
                    <i class="fas fa-chevron-down help-faq-icon"></i>
                  </button>
                  <div class="help-faq-answer">
                    <p>Super administratori mogu:</p>
                    <ul>
                      <li>Kliknuti na operatera u listi</li>
                      <li>Izabrati "Uredi" dugme</li>
                      <li>Izmijeniti potrebna polja</li>
                      <li>Sacuvati promjene (automatski backup)</li>
                    </ul>
                  </div>
                </div>

                <div class="help-faq-item">
                  <button class="help-faq-question" type="button">
                    Kako exportovati podatke?
                    <i class="fas fa-chevron-down help-faq-icon"></i>
                  </button>
                  <div class="help-faq-answer">
                    <p>Koristite "Export" dugme na stranici operatera ili logs. Sve export akcije se bilježe u audit log radi sigurnosti.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Tab -->
          <div class="help-tab-panel" id="tab-contact" role="tabpanel">
            <div class="help-section">
              <h3><i class="fas fa-headset"></i> Kontakt i podrska</h3>
              <div class="help-contact-grid">
                <div class="help-contact-card">
                  <div class="help-contact-icon">
                    <i class="fas fa-tools"></i>
                  </div>
                  <h4>Tehnicka podrska</h4>
                  <p>Za tehnicke probleme i upite o sistemu</p>
                  <a href="mailto:admin@atlas.ba" class="help-contact-link">
                    <i class="fas fa-envelope"></i>
                    admin@atlas.ba
                  </a>
                </div>

                <div class="help-contact-card">
                  <div class="help-contact-icon">
                    <i class="fas fa-shield-alt"></i>
                  </div>
                  <h4>Sigurnosni incidenti</h4>
                  <p>Hitne linije za sigurnosne prijetnje</p>
                  <a href="mailto:security@atlas.ba" class="help-contact-link">
                    <i class="fas fa-exclamation-triangle"></i>
                    security@atlas.ba
                  </a>
                </div>

                <div class="help-contact-card">
                  <div class="help-contact-icon">
                    <i class="fas fa-graduation-cap"></i>
                  </div>
                  <h4>Obuka i edukacija</h4>
                  <p>Online treninzi i dodatni materijali</p>
                  <a href="mailto:training@atlas.ba" class="help-contact-link">
                    <i class="fas fa-book-reader"></i>
                    training@atlas.ba
                  </a>
                </div>
              </div>
            </div>

            <div class="help-section">
              <h3><i class="fas fa-balance-scale"></i> Zakonski okvir</h3>
              <ul class="help-guidelines">
                <li>Zakon o telekomunikacijama Bosne i Hercegovine</li>
                <li>Zakon o policijskim agencijama i internim sigurnosnim protokolima</li>
                <li>GDPR principi zastite podataka i nacionalni propisi o privatnosti</li>
                <li>Sve informacije su povjerljive i namijenjene iskljucivo sluzbenoj upotrebi</li>
              </ul>
            </div>
          </div>
        </div>
          <div class="help-modal-footer">
            <div class="help-footer-meta">
              <span><i class="fas fa-lock"></i> Povjerljivo - samo za ovlastene korisnike</span>
              <span>c 2025 ATLAS - Telekomunikacioni operateri BiH</span>
            </div>
            <button class="help-modal-action" type="button">Zatvori</button>
          </div>
        </div>
      `;

      document.body.appendChild(helpModal);

    // Event listeners for modal
    const overlay = helpModal.querySelector('.help-modal-overlay');
    const closeBtn = helpModal.querySelector('.help-modal-close');
    const actionBtn = helpModal.querySelector('.help-modal-action');

    const closeModal = () => {
      helpModal.classList.remove('active');
      setTimeout(() => helpModal.remove(), 300);
      document.body.style.overflow = '';
    };

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    if (actionBtn) {
      actionBtn.addEventListener('click', closeModal);
    }

    // Tab switching functionality
    const tabs = helpModal.querySelectorAll('.help-tab');
    const tabPanels = helpModal.querySelectorAll('.help-tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and panels
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const tabName = tab.getAttribute('data-tab');
        const targetPanel = helpModal.querySelector(`#tab-${tabName}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });

      // Keyboard navigation for tabs
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const tabsArray = Array.from(tabs);
          const currentIndex = tabsArray.indexOf(tab);
          let nextIndex;

          if (e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % tabsArray.length;
          } else {
            nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
          }

          tabsArray[nextIndex].click();
          tabsArray[nextIndex].focus();
        }
      });
    });

    // FAQ accordion functionality
    const faqQuestions = helpModal.querySelectorAll('.help-faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.closest('.help-faq-item');
        const isActive = faqItem.classList.contains('active');

        // Close all other FAQ items (optional: remove to allow multiple open)
        helpModal.querySelectorAll('.help-faq-item').forEach(item => {
          item.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          faqItem.classList.add('active');
        }
      });
    });

    // Show modal
    document.body.style.overflow = 'hidden';
    setTimeout(() => helpModal.classList.add('active'), 10);

    // ESC key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Add pulse animation to help button if first time
    if (isFirstTime) {
      const helpBtn = document.querySelector('.help-btn');
      if (helpBtn && !helpBtn.classList.contains('pulse')) {
        helpBtn.classList.add('pulse');
        // Remove pulse after modal is opened
        setTimeout(() => {
          helpBtn.classList.remove('pulse');
        }, 500);
      }
    }
  }

  global.SharedHeader = {
    mount: ensureTemplateHTML,
    init: initSharedHeader,
    renderHeaderUser,
    computePermissions,
    getRoleConfig,
    onAction,
    setActions
  };

  if (typeof global.dispatchEvent === 'function') {
    global.dispatchEvent(new Event('atlas-shared-header-ready'));
  }
})(window);















