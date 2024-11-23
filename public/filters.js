function createFilterControls() {
    const container = document.querySelector('.product-catalog .container .row > div');
    
    // Create filter controls container
    const filterControlsDiv = document.createElement('div');
    filterControlsDiv.className = 'filter-controls mb-4';
    filterControlsDiv.innerHTML = `
        <div id="filter-range" class="form-group">
            <label for="price-range">Price Range: € <span id="min-price-display">0</span> - € <span id="max-price-display">100</span></label>
            <input type="range" id="price-range" class="form-control-range" min="0" max="100" value="100">
        </div>
    `;

    // Insert filter controls before the product grid
    container.insertBefore(filterControlsDiv, document.getElementById('items-container').parentNode);

    // Add event listener
    document.getElementById('price-range').addEventListener('input', updatePriceDisplay);
}

function updatePriceDisplay() {
    const priceRange = document.getElementById('price-range');
    const minPriceDisplay = document.getElementById('min-price-display');
    const maxPriceDisplay = document.getElementById('max-price-display');

    minPriceDisplay.textContent = '0';
    maxPriceDisplay.textContent = priceRange.value;
    
    applyFilters();
}

function applyFilters() {
    fetchStoreItems().then(items => {
        if (!items) return;

        // Get filter value
        const maxPrice = parseFloat(document.getElementById('price-range').value);

        // Apply price filter
        let filteredItems = items.filter(item => (item.priceInCents / 100) <= maxPrice);

        // Display filtered items
        displayStoreItems(filteredItems);
    });
}

// Modify existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Create filter controls
    createFilterControls();
});




