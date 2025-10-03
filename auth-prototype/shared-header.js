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

  function ensureTemplateHTML() {
    if (document.querySelector('.atlas-header')) {
      return document.querySelector('.atlas-header');
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
        <div class="atlas-header__actions" id="atlasHeaderActions"></div>
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

    if (userNameDisplay) userNameDisplay.textContent = `${user.ime} ${user.prezime}`;
    if (userRoleDisplay) userRoleDisplay.textContent = roleToDisplay(user.role);
    if (dropdownName) dropdownName.textContent = `${user.ime} ${user.prezime}`;
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
    footer.innerHTML = `
      <a href="moj-profil.html" class="user-dropdown-link">
        <i class="fas fa-user-circle"></i>
        <span>Moj profil</span>
      </a>
      <a href="postavke.html" class="user-dropdown-link">
        <i class="fas fa-cog"></i>
        <span>Postavke</span>
      </a>
    `;
  }

  function buildLinkHTML(link) {
    if (link.action) {
      return `<a href="#" class="user-dropdown-link" data-action="${link.action}">` +
        `<i class="${link.icon}"></i>` +
        `<span>${link.label}</span>` +
        `</a>`;
    }
    return `<a href="${link.href}" class="user-dropdown-link">` +
      `<i class="${link.icon}"></i>` +
      `<span>${link.label}</span>` +
      `</a>`;
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
  }

  function handleAction(action) {
    if (!action) return;
    if (actionHandlers.has(action)) {
      actionHandlers.get(action)();
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

  global.SharedHeader = {
    mount: ensureTemplateHTML,
    renderHeaderUser,
    computePermissions,
    getRoleConfig,
    onAction,
    setActions
  };
})(window);
