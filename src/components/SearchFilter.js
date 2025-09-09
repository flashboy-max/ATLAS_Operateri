/**
 * Search and filtering component for ATLAS operators
 * Handles search functionality, filtering by status/type/category, and quick filters
 */
export class SearchFilter {
    constructor(app, notificationManager) {
        this.app = app;
        this.notificationManager = notificationManager;
        this.currentFilters = {
            search: '',
            status: '',
            type: '',
            category: ''
        };
    }

    /**
     * Handle search input - filter operators by search term
     * @param {string} searchTerm - The search term to filter by
     */
    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        // Clear any existing highlights
        this.clearSearchHighlights();

        if (term === '') {
            this.app.filteredOperators = [...this.app.operators];
            // Reset search filter buttons
            this.resetQuickFilters();
            // Hide clear button and results info
            this.app.elements.clearSearchBtn.style.display = 'none';
            this.app.elements.searchResults.style.display = 'none';
        } else {
            this.app.filteredOperators = this.app.operators.filter(operator => {
                return (
                    operator.naziv.toLowerCase().includes(term) ||
                    (operator.komercijalni_naziv && operator.komercijalni_naziv.toLowerCase().includes(term)) ||
                    operator.tip.toLowerCase().includes(term) ||
                    operator.adresa.toLowerCase().includes(term) ||
                    operator.email.toLowerCase().includes(term) ||
                    operator.kontakt_osoba.toLowerCase().includes(term)
                );
            });

            // Highlight search term in results
            this.app.highlightSearchTerm = term;

            // Show clear button and results info
            this.app.elements.clearSearchBtn.style.display = 'block';
            this.app.elements.searchResults.style.display = 'flex';

            // Update results info
            const resultsCount = this.app.filteredOperators.length;
            const totalCount = this.app.operators.length;
            this.app.elements.searchResultsText.textContent =
                `${resultsCount} od ${totalCount} operatera • "${term}"`;
        }

        this.applyFilters();
    }

    /**
     * Clear search highlights from the DOM
     */
    clearSearchHighlights() {
        this.app.highlightSearchTerm = null;
        // Remove existing highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
    }

    /**
     * Highlight search term in text
     * @param {string} text - Text to highlight
     * @param {string} searchTerm - Term to highlight
     * @returns {string} - HTML with highlighted text
     */
    highlightText(text, searchTerm) {
        if (!searchTerm || !text) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    /**
     * Clear search input and reset filters
     */
    clearSearch() {
        this.app.elements.searchInput.value = '';
        this.clearSearchHighlights();
        this.resetQuickFilters();
        this.app.elements.clearSearchBtn.style.display = 'none';
        this.app.elements.searchResults.style.display = 'none';
        this.app.filteredOperators = [...this.app.operators];
        this.applyFilters();
    }

    /**
     * Reset quick filter buttons to default state
     */
    resetQuickFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
    }

    /**
     * Apply filters based on current filter selections
     */
    applyFilters() {
        console.log('🔍 === APPLY FILTERS DEBUG START ===');
        let filtered = this.app.filteredOperators.length > 0 ? [...this.app.filteredOperators] : [...this.app.operators];
        console.log('📊 Početni broj operatera za filtriranje:', filtered.length);

        // Status filter
        const statusFilter = this.app.elements.statusFilter.value;
        console.log('📋 Status filter vrednost:', statusFilter);
        if (statusFilter) {
            const beforeCount = filtered.length;
            filtered = filtered.filter(op => op.status === statusFilter);
            console.log(`   Status filter: ${beforeCount} → ${filtered.length} operatera`);
        }

        // Category filter
        const categoryFilter = this.app.elements.categoryFilter.value;
        console.log('📋 Category filter vrednost:', categoryFilter);
        if (categoryFilter) {
            const beforeCount = filtered.length;
            filtered = filtered.filter(op => this.app.getCategoryClass(op) === categoryFilter);
            console.log(`   Category filter: ${beforeCount} → ${filtered.length} operatera`);
        }

        // Type filter
        const typeFilter = this.app.elements.typeFilter.value;
        console.log('📋 Type filter vrednost:', typeFilter);
        if (typeFilter) {
            const beforeCount = filtered.length;

            // Koristimo direktno tip operatera
            filtered = filtered.filter(op => op.tip.includes(typeFilter));
            console.log(`   Type filter: ${beforeCount} → ${filtered.length} operatera`);
            console.log('   Filtrirani operateri:', filtered.map(op => `${op.naziv} (${op.tip})`));
        }

        console.log('📊 Finalni broj operatera:', filtered.length);
        console.log('🔍 === APPLY FILTERS DEBUG END ===');
        this.app.renderOperators(filtered);
    }

    /**
     * Handle quick category filter
     * @param {string} category - Category to filter by
     */
    handleQuickFilter(category) {
        console.log('🔍 === QUICK FILTER DEBUG START ===');
        console.log('📥 Primljena kategorija:', category);
        console.log('📊 Ukupno operatera u aplikaciji:', this.app.operators.length);
        console.log('📋 Trenutno filtrirani operateri (search):', this.app.filteredOperators.length);

        // Reset search filters when using quick filter
        this.app.filteredOperators = [...this.app.operators];
        this.app.elements.searchInput.value = '';
        this.app.highlightSearchTerm = '';
        console.log('🔄 Search resetovan - sada koristimo sve operatere');

        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        const filterBtn = document.querySelector(`[data-category="${category}"]`);
        if (filterBtn) {
            filterBtn.classList.add('active');
            console.log('✅ Filter dugme aktivirano za kategoriju:', category);
        } else {
            console.warn('❌ Filter dugme za kategoriju "' + category + '" nije pronađeno');
            return;
        }

        // Filter operators
        if (category === 'all') {
            this.app.renderOperators();
            console.log('📋 Prikazani svi operateri (', this.app.operators.length, ')');
        } else {
            console.log('🔎 Filtriranje operatera po kategoriji "' + category + '"...');

            // Debug: prikaz kategorizacije za sve operatere
            this.app.operators.forEach(op => {
                const opCategory = this.app.getCategoryClass(op);
                console.log(`   - ${op.naziv}: kategorija="${opCategory}", tip="${op.tip}"`);
            });

            const filtered = this.app.operators.filter(op => this.app.getCategoryClass(op) === category);
            console.log('📊 Filtrirano operatera:', filtered.length);
            console.log('📋 Filtrirani operateri:', filtered.map(op => op.naziv));

            this.app.renderOperators(filtered);
        }
        console.log('🔍 === QUICK FILTER DEBUG END ===');
    }
}
