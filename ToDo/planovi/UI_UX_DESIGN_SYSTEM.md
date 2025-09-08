# ATLAS v2.0 - UI/UX Design System

## 🎨 Design Philosophy

ATLAS v2.0 dizajn se zasniva na principima **Clean Design**, **Mobile-First** pristupa i **Accessibility** standarda. Fokus je na funkcionalnosti, čitljivosti i intuitivnom korisničkom iskustvu.

### Core Design Principles
- **Clarity over Cleverness** - Jednostavnost u dizajnu
- **Progressive Disclosure** - Prikazivanje informacija po potrebi
- **Consistent Interactions** - Konzistentno ponašanje kroz aplikaciju
- **Responsive by Default** - Mobile-first pristup
- **Accessible for All** - WCAG 2.1 AA compliance

---

## 🖼️ Visual Wireframes

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        Header                               │
│  ┌─────────┐  ATLAS Logo           ┌──────────┐ ┌─────────┐ │
│  │   ☰     │                       │ Add New  │ │  Theme  │ │
│  │  Menu   │                       │ Operator │ │ Toggle  │ │
│  └─────────┘                       └──────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     Search & Filter Bar                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  🔍  Search operators...                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│ [All Categories ▼] [All Status ▼] [All Priority ▼] [More▼] │
├─────────────────────────────────────────────────────────────┤
│                    Statistics Dashboard                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│ │   📊     │ │    ✅    │ │    ❌    │ │      ⭐      │    │
│ │  Total   │ │ Active   │ │Inactive  │ │ High Priority│    │
│ │   26     │ │   19     │ │    7     │ │      8       │    │
│ └──────────┘ └──────────┘ └──────────┘ └──────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                      Content Area                          │
│ ┌─ View Toggle ─────────────────────────────────────────┐   │
│ │ [📋 Table] [🔲 Cards] [📊 Analytics]                 │   │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│        Dynamic Content Area (Table/Cards/Analytics)        │
│                                                             │
│ ┌──────────────────────────────────────────────────────────┐│
│ │                   Operator Items                        ││
│ │  [Pagination/Infinite Scroll Controls]                 ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌─────────────────────┐
│      Header         │
│ ☰ ATLAS    🌓 + Op  │
├─────────────────────┤
│    Search Bar       │
│ 🔍 Search...        │
├─────────────────────┤
│   Quick Stats       │
│ Total: 26  Active:19│
├─────────────────────┤
│    Filter Chips     │
│[All][Active][ISP]   │
├─────────────────────┤
│   Operator Cards    │
│ ┌─────────────────┐ │
│ │ BH Telecom      │ │
│ │ Dominantni      │ │
│ │ ✅ Active  ⭐⭐⭐ │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ m:tel           │ │
│ │ Dominantni      │ │
│ │ ✅ Active  ⭐⭐⭐ │ │
│ └─────────────────┘ │
│      [Load More]    │
└─────────────────────┘
```

---

## 🎯 Component Specifications

### 1. Header Component

```javascript
// components/layout/Header.js
class Header extends BaseComponent {
    constructor(element, options) {
        super(element, {
            sticky: true,
            showSearch: true,
            showUserMenu: false,
            ...options
        });
    }
    
    render() {
        return `
            <header class="atlas-header">
                <div class="header-left">
                    <button class="menu-toggle" aria-label="Toggle menu">
                        <i class="icon-menu"></i>
                    </button>
                    <div class="logo">
                        <i class="icon-satellite"></i>
                        <h1>ATLAS</h1>
                        <span class="subtitle">Telecom Operators BiH</span>
                    </div>
                </div>
                
                <div class="header-right">
                    <button class="btn btn-primary" data-action="add-operator">
                        <i class="icon-plus"></i>
                        <span class="btn-text">Add Operator</span>
                    </button>
                    <button class="theme-toggle" aria-label="Toggle theme">
                        <i class="icon-theme"></i>
                    </button>
                </div>
            </header>
        `;
    }
}
```

### 2. Search & Filter Component

```javascript
// components/operators/SearchBar.js
class SearchBar extends BaseComponent {
    constructor(element, options) {
        super(element, {
            placeholder: 'Search operators...',
            debounceDelay: 300,
            showAdvancedFilters: true,
            ...options
        });
        
        this.searchTimeout = null;
    }
    
    render() {
        return `
            <div class="search-filter-container">
                <div class="search-input-wrapper">
                    <i class="icon-search"></i>
                    <input 
                        type="text" 
                        class="search-input"
                        placeholder="${this.options.placeholder}"
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <button class="clear-search hidden" aria-label="Clear search">
                        <i class="icon-x"></i>
                    </button>
                </div>
                
                <div class="filter-controls">
                    <select class="filter-select" data-filter="category">
                        <option value="">All Categories</option>
                        <option value="dominantni">🏢 Dominant Operators</option>
                        <option value="mobilni_mvno">📱 Mobile/MVNO</option>
                        <option value="regionalni_isp">🌐 Regional ISP</option>
                        <option value="enterprise_b2b">💼 Enterprise/B2B</option>
                    </select>
                    
                    <select class="filter-select" data-filter="status">
                        <option value="">All Status</option>
                        <option value="aktivan">✅ Active</option>
                        <option value="neaktivan">❌ Inactive</option>
                    </select>
                    
                    <select class="filter-select" data-filter="priority">
                        <option value="">All Priority</option>
                        <option value="visok">⭐ High</option>
                        <option value="srednji">⚡ Medium</option>
                        <option value="nizak">💡 Low</option>
                    </select>
                    
                    <button class="advanced-filters-toggle">
                        <i class="icon-filter"></i>
                        More Filters
                    </button>
                </div>
            </div>
        `;
    }
}
```

### 3. Statistics Dashboard

```javascript
// components/operators/StatsDashboard.js
class StatsDashboard extends BaseComponent {
    render() {
        const { operators } = this.props;
        const stats = this.calculateStats(operators);
        
        return `
            <div class="stats-dashboard">
                <div class="stat-card total">
                    <div class="stat-icon">
                        <i class="icon-building"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.total}</div>
                        <div class="stat-label">Total Operators</div>
                    </div>
                </div>
                
                <div class="stat-card active">
                    <div class="stat-icon">
                        <i class="icon-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.active}</div>
                        <div class="stat-label">Active</div>
                        <div class="stat-percentage">${stats.activePercentage}%</div>
                    </div>
                </div>
                
                <div class="stat-card inactive">
                    <div class="stat-icon">
                        <i class="icon-x-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.inactive}</div>
                        <div class="stat-label">Inactive</div>
                        <div class="stat-percentage">${stats.inactivePercentage}%</div>
                    </div>
                </div>
                
                <div class="stat-card priority">
                    <div class="stat-icon">
                        <i class="icon-star"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.highPriority}</div>
                        <div class="stat-label">High Priority</div>
                        <div class="stat-trend ${stats.priorityTrend}">${stats.priorityTrendIcon}</div>
                    </div>
                </div>
            </div>
        `;
    }
}
```

### 4. Operator Card Component

```javascript
// components/operators/OperatorCard.js
class OperatorCard extends BaseComponent {
    render() {
        const { operator } = this.props;
        
        return `
            <div class="operator-card" data-id="${operator.id}">
                <div class="card-header">
                    <div class="operator-info">
                        <h3 class="operator-name">${operator.naziv}</h3>
                        ${operator.komercijalni_naziv ? 
                            `<p class="commercial-name">${operator.komercijalni_naziv}</p>` : ''}
                    </div>
                    <div class="operator-status">
                        <span class="status-badge status-${operator.status}">
                            ${operator.status}
                        </span>
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="operator-details">
                        <div class="detail-item">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${this.truncate(operator.tip, 30)}</span>
                        </div>
                        
                        <div class="detail-item">
                            <span class="detail-label">ATLAS Status:</span>
                            <span class="atlas-status ${this.getAtlasStatusClass(operator.atlas_status)}">
                                ${operator.atlas_status}
                            </span>
                        </div>
                        
                        <div class="detail-item">
                            <span class="detail-label">Priority:</span>
                            <span class="priority-badge priority-${operator.prioritet}">
                                ${this.getPriorityIcon(operator.prioritet)} ${operator.prioritet}
                            </span>
                        </div>
                        
                        <div class="detail-item">
                            <span class="detail-label">Completeness:</span>
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${operator.kompletnost}%"></div>
                                </div>
                                <span class="progress-text">${operator.kompletnost}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="contact-info">
                        ${operator.telefon ? `
                            <div class="contact-item">
                                <i class="icon-phone"></i>
                                <span>${operator.telefon}</span>
                            </div>
                        ` : ''}
                        
                        ${operator.email ? `
                            <div class="contact-item">
                                <i class="icon-mail"></i>
                                <span>${operator.email}</span>
                            </div>
                        ` : ''}
                        
                        ${operator.web ? `
                            <div class="contact-item">
                                <i class="icon-globe"></i>
                                <a href="${operator.web}" target="_blank">${operator.web}</a>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="card-footer">
                    <div class="card-actions">
                        <button class="action-btn view" data-action="view" data-id="${operator.id}">
                            <i class="icon-eye"></i>
                            <span>View</span>
                        </button>
                        <button class="action-btn edit" data-action="edit" data-id="${operator.id}">
                            <i class="icon-edit"></i>
                            <span>Edit</span>
                        </button>
                        <button class="action-btn delete" data-action="delete" data-id="${operator.id}">
                            <i class="icon-trash"></i>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}
```

### 5. Enhanced Table Component

```javascript
// components/operators/OperatorTable.js
class OperatorTable extends BaseComponent {
    constructor(element, options) {
        super(element, {
            sortable: true,
            selectable: true,
            pagination: true,
            itemsPerPage: 20,
            ...options
        });
    }
    
    render() {
        const { operators, sortBy, sortDirection } = this.props;
        
        return `
            <div class="table-container">
                <div class="table-header">
                    <div class="table-controls">
                        <div class="selected-count ${this.getSelectedCount() > 0 ? 'visible' : ''}">
                            ${this.getSelectedCount()} selected
                            <button class="bulk-action" data-action="bulk-delete">Delete</button>
                            <button class="bulk-action" data-action="bulk-export">Export</button>
                        </div>
                        
                        <div class="view-options">
                            <button class="density-toggle" data-density="compact">Compact</button>
                            <button class="density-toggle" data-density="comfortable">Comfortable</button>
                            <button class="columns-toggle">Columns</button>
                        </div>
                    </div>
                </div>
                
                <table class="operators-table">
                    <thead>
                        <tr>
                            <th class="select-column">
                                <input type="checkbox" class="select-all">
                            </th>
                            <th class="sortable" data-sort="naziv">
                                Name
                                ${this.getSortIcon('naziv', sortBy, sortDirection)}
                            </th>
                            <th class="sortable" data-sort="tip">
                                Type
                                ${this.getSortIcon('tip', sortBy, sortDirection)}
                            </th>
                            <th class="sortable" data-sort="status">
                                Status
                                ${this.getSortIcon('status', sortBy, sortDirection)}
                            </th>
                            <th data-sort="atlas_status">ATLAS Status</th>
                            <th class="sortable" data-sort="prioritet">
                                Priority
                                ${this.getSortIcon('prioritet', sortBy, sortDirection)}
                            </th>
                            <th class="sortable" data-sort="kompletnost">
                                Completeness
                                ${this.getSortIcon('kompletnost', sortBy, sortDirection)}
                            </th>
                            <th>Contact</th>
                            <th class="actions-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${operators.map(operator => this.renderTableRow(operator)).join('')}
                    </tbody>
                </table>
                
                ${this.options.pagination ? this.renderPagination() : ''}
            </div>
        `;
    }
}
```

---

## 🎨 CSS Design System

### Color System

```css
/* Light Theme */
:root {
    /* Primary Colors */
    --color-primary: #2563eb;
    --color-primary-hover: #1d4ed8;
    --color-primary-light: #dbeafe;
    
    /* Semantic Colors */
    --color-success: #10b981;
    --color-success-light: #d1fae5;
    --color-warning: #f59e0b;
    --color-warning-light: #fef3c7;
    --color-error: #ef4444;
    --color-error-light: #fee2e2;
    --color-info: #06b6d4;
    --color-info-light: #cffafe;
    
    /* Neutral Colors */
    --color-background: #ffffff;
    --color-background-secondary: #f8fafc;
    --color-surface: #ffffff;
    --color-surface-hover: #f1f5f9;
    --color-border: #e2e8f0;
    --color-border-strong: #cbd5e1;
    
    /* Text Colors */
    --color-text-primary: #0f172a;
    --color-text-secondary: #475569;
    --color-text-tertiary: #94a3b8;
    --color-text-inverse: #ffffff;
}

/* Dark Theme */
[data-theme="dark"] {
    --color-background: #0f172a;
    --color-background-secondary: #1e293b;
    --color-surface: #1e293b;
    --color-surface-hover: #334155;
    --color-border: #334155;
    --color-border-strong: #475569;
    
    --color-text-primary: #f8fafc;
    --color-text-secondary: #cbd5e1;
    --color-text-tertiary: #64748b;
    --color-text-inverse: #0f172a;
}
```

### Component Styles

```css
/* Operator Card */
.operator-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: var(--space-6);
    transition: all 0.2s ease;
    cursor: pointer;
}

.operator-card:hover {
    border-color: var(--color-primary);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
    transform: translateY(-2px);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-4);
}

.operator-name {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text-primary);
    margin: 0 0 var(--space-1) 0;
}

/* Status Badges */
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-3);
    border-radius: 9999px;
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    text-transform: uppercase;
}

.status-aktivan {
    background: var(--color-success-light);
    color: var(--color-success);
}

.status-neaktivan {
    background: var(--color-error-light);
    color: var(--color-error);
}

/* Priority Badges */
.priority-visok {
    background: var(--color-error-light);
    color: var(--color-error);
}

.priority-srednji {
    background: var(--color-warning-light);
    color: var(--color-warning);
}

.priority-nizak {
    background: var(--color-info-light);
    color: var(--color-info);
}
```

### Responsive Grid System

```css
/* Grid Container */
.operators-grid {
    display: grid;
    gap: var(--space-6);
    padding: var(--space-6);
}

/* Responsive Grid Columns */
@media (min-width: 640px) {
    .operators-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .operators-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1280px) {
    .operators-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* Table Responsive */
.table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

@media (max-width: 767px) {
    .operators-table {
        min-width: 800px;
    }
    
    .operators-table th,
    .operators-table td {
        font-size: var(--text-sm);
        padding: var(--space-2) var(--space-3);
    }
}
```

---

## 📱 Mobile-First Patterns

### Mobile Navigation

```css
/* Mobile Menu */
@media (max-width: 767px) {
    .atlas-header .header-right .btn-text {
        display: none;
    }
    
    .mobile-menu {
        position: fixed;
        top: 0;
        left: -100%;
        width: 280px;
        height: 100vh;
        background: var(--color-surface);
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        transition: left 0.3s ease;
        z-index: 1000;
    }
    
    .mobile-menu.open {
        left: 0;
    }
    
    .mobile-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .mobile-overlay.active {
        opacity: 1;
        visibility: visible;
    }
}
```

### Touch-Friendly Interactions

```css
/* Touch Targets */
.touch-target {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Swipe Actions */
.operator-card {
    position: relative;
    transform: translateX(0);
    transition: transform 0.2s ease;
}

.operator-card.swiped {
    transform: translateX(-80px);
}

.swipe-actions {
    position: absolute;
    right: -80px;
    top: 0;
    bottom: 0;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-error);
    color: var(--color-text-inverse);
}
```

---

## ⚡ Performance Considerations

### Lazy Loading Images

```css
.operator-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--color-surface-hover);
    transition: opacity 0.3s ease;
}

.operator-avatar[data-src] {
    opacity: 0.5;
}

.operator-avatar.loaded {
    opacity: 1;
}
```

### Skeleton Loading

```css
.skeleton {
    background: linear-gradient(90deg, 
        var(--color-surface-hover) 25%, 
        transparent 50%, 
        var(--color-surface-hover) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.operator-card.loading {
    .operator-name { @extend .skeleton; height: 24px; }
    .commercial-name { @extend .skeleton; height: 16px; }
    .operator-details { @extend .skeleton; height: 80px; }
}
```

---

## 🎯 Accessibility Features

### ARIA Labels and Roles

```html
<!-- Search with proper ARIA -->
<div role="search" aria-label="Search operators">
    <input 
        type="text"
        role="searchbox"
        aria-label="Search operators by name, type, or location"
        aria-describedby="search-help"
        autocomplete="off"
    >
    <div id="search-help" class="sr-only">
        Search through all telecommunications operators in Bosnia and Herzegovina
    </div>
</div>

<!-- Table with proper ARIA -->
<table role="table" aria-label="Telecommunications operators">
    <thead>
        <tr role="row">
            <th role="columnheader" aria-sort="ascending">Name</th>
            <th role="columnheader" aria-sort="none">Type</th>
        </tr>
    </thead>
</table>
```

### Keyboard Navigation

```css
/* Focus States */
.focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

/* Skip Links */
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--color-primary);
    color: var(--color-text-inverse);
    padding: 8px;
    border-radius: 4px;
    text-decoration: none;
    z-index: 1000;
    transition: top 0.2s;
}

.skip-link:focus {
    top: 6px;
}
```

---

## 🚀 Animation & Transitions

### Micro-interactions

```css
/* Hover Effects */
.operator-card {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.operator-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Loading States */
.btn.loading {
    position: relative;
    color: transparent;
}

.btn.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

### Page Transitions

```css
/* Route Transitions */
.page-enter {
    opacity: 0;
    transform: translateX(30px);
}

.page-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: all 0.3s ease-out;
}

.page-exit {
    opacity: 1;
    transform: translateX(0);
}

.page-exit-active {
    opacity: 0;
    transform: translateX(-30px);
    transition: all 0.3s ease-in;
}
```

---

## 📋 Implementation Checklist

### UI Components
- [ ] Header with responsive navigation
- [ ] Search bar with advanced filters
- [ ] Statistics dashboard with animations
- [ ] Operator cards with hover effects
- [ ] Enhanced table with sorting/pagination
- [ ] Modal dialogs for CRUD operations
- [ ] Toast notifications system
- [ ] Loading states and skeletons

### Responsive Design
- [ ] Mobile-first CSS architecture
- [ ] Flexible grid system
- [ ] Touch-friendly interactions
- [ ] Adaptive typography scale
- [ ] Cross-device testing

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation support
- [ ] Screen reader optimization
- [ ] High contrast theme support
- [ ] Focus management

### Performance
- [ ] CSS optimization and minification
- [ ] Image lazy loading
- [ ] Component lazy loading
- [ ] Animation performance optimization
- [ ] Bundle size optimization

---

**Dokument verzija**: 1.0  
**Datum kreiranja**: 31. jul 2025  
**Autor**: ATLAS UI/UX Team  
**Status**: Design specifikacija 🎨