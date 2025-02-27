document.addEventListener('DOMContentLoaded', () => {
    const inventoryContainer = document.getElementById('inventory-container');

    function displayInventory(inventory) {
        inventoryContainer.innerHTML = ''; // Очищаем контейнер

        if (inventory && inventory.length > 0) {
            inventory.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('inventory-item'); // Добавляем класс для стилизации

                // Проверяем, существует ли item.name, и если нет, присваиваем значение по умолчанию
                const itemName = item.name !== undefined ? item.name : "Безымянный предмет";

                itemElement.innerHTML = `
                    <img src="" alt="${itemName}">
                    <p class="item-name">${itemName}</p>
                    <p class="item-price">Цена: ${item.price} ₽</p>
                    <button class="sell-button" data-item-id="${item.id}">Продать</button>
                `;
                inventoryContainer.appendChild(itemElement);

                // Обработчик для кнопки "Продать"
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
            balance += item.price; // Добавляем цену предмета к балансу
            localStorage.setItem('balance', balance.toFixed(2)); // Сохраняем баланс

            inventory.splice(itemIndex, 1); // Удаляем предмет из инвентаря
            saveInventoryToLocalStorage(inventory); // Сохраняем инвентарь

            displayInventory(getInventoryFromLocalStorage()); // Обновляем отображение

             alert(`Продано ${item.name} за ${item.price} ₽!`);
        } else {
            console.log(`Предмет с ID ${itemId} не найден в инвентаре.`);
        }
    }

    // Изначальное отображение инвентаря при загрузке страницы
    const initialInventory = getInventoryFromLocalStorage();
    displayInventory(initialInventory);
});
