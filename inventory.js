document.addEventListener('DOMContentLoaded', () => {
    const inventoryGrid = document.getElementById('inventory-grid');

    function displayInventory() {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

        if (inventory.length === 0) {
            inventoryGrid.innerHTML = '<p>Ваш инвентарь пуст.</p>';
            return;
        }

        inventoryGrid.innerHTML = inventory.map(item => `
            <div class="inventory-item">
                <img src="" alt="${item.title}" class="inventory-image">
                <h2 class="inventory-title">${item.title}</h2>
            </div>
        `).join('');
    }

    displayInventory();
});