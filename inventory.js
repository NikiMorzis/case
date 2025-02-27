document.addEventListener('DOMContentLoaded', () => {
    const inventoryContainer = document.getElementById('inventory-container');

    const SELL_PRICE_FACTOR = 0.7; // Коэффициент цены продажи

    function displayInventory(inventory) {
        inventoryContainer.innerHTML = '';

        if (inventory && inventory.length > 0) {
            inventory.forEach(item => {
                console.log("Предмет в инвентаре:", item);
                const itemElement = document.createElement('div');
                itemElement.classList.add('inventory-item');

                const sellPrice = (item.price * SELL_PRICE_FACTOR).toFixed(2); // Вычисляем цену продажи

                itemElement.innerHTML = `
                    <img src="" alt="${item.title}" class="inventory-image">
                    <p class="inventory-title">${item.title}</p>
                    <p class="item-price">Цена: ${item.price} ₽</p>
                    <p class="sell-price">Цена продажи: ${sellPrice} ₽</p>
                    <button class="sell-button" data-item-id="${item.id}">Продать</button>
                `;
                inventoryContainer.appendChild(itemElement);

                const sellButton = itemElement.querySelector('.sell-button');
                sellButton.addEventListener('click', () => {
                    sellItem(item.id);
                });
            });
        } else {
            inventoryContainer.innerHTML = '<p>Инвентарь пуст.</p>';
        }
    }

    function getInventoryFromLocalStorage() {
        try {
            const inventoryString = localStorage.getItem('inventory');
            return inventoryString ? JSON.parse(inventoryString) : [];
        } catch (error) {
            console.error("Ошибка при получении инвентаря из localStorage:", error);
            return [];
        }
    }

    function saveInventoryToLocalStorage(inventory) {
        try {
            localStorage.setItem('inventory', JSON.stringify(inventory));
        } catch (error) {
            console.error("Ошибка при сохранении инвентаря в localStorage:", error);
        }
    }

    function sellItem(itemId) {
        let inventory = getInventoryFromLocalStorage();
        const itemIndex = inventory.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            const item = inventory[itemIndex];
            let balance = parseFloat(localStorage.getItem('balance')) || 0;

            const sellPrice = item.price * SELL_PRICE_FACTOR; // Вычисляем цену продажи

            balance += sellPrice;
            localStorage.setItem('balance', balance.toFixed(2));

            inventory.splice(itemIndex, 1);
            saveInventoryToLocalStorage(inventory);

            displayInventory(getInventoryFromLocalStorage());

            alert(`Продано ${item.title} за ${sellPrice.toFixed(2)} ₽!`);

            let cars = JSON.parse(localStorage.getItem('cars')) || [];
            const carIndex = cars.findIndex(car => car.id === itemId);
            if (carIndex !== -1) {
                cars[carIndex].canBuy = true;
                localStorage.setItem('cars', JSON.stringify(cars));
                updateCarAvailability(itemId, true);
            }

        } else {
            console.log(`Предмет с ID ${itemId} не найден в инвентаре.`);
        }
    }

    function updateCarAvailability(carId, canBuy) {
        let carData = JSON.parse(localStorage.getItem('carData')) || {};
        carData[carId] = { canBuy: canBuy };
        localStorage.setItem('carData', JSON.stringify(carData));
    }

    const initialInventory = getInventoryFromLocalStorage();
    displayInventory(initialInventory);
});
