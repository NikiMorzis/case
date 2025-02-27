document.addEventListener('DOMContentLoaded', () => {
    const inventoryGrid = document.getElementById('inventory-grid');

    function displayInventory() {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

        if (inventory.length === 0) {
            inventoryGrid.innerHTML = '<p>Ваш инвентарь пуст.</p>';
            return;
        }

        inventoryGrid.innerHTML = inventory.map(item => {
            const sellPrice = Math.floor(item.price * 0.7); // Цена продажи (70% от начальной)
            return `
                <div class="inventory-item">
                    <img src="" alt="${item.title}" class="inventory-image">
                    <h2 class="inventory-title">${item.title}</h2>
                    <p>Цена продажи: ${sellPrice.toLocaleString()} ₽</p>
                    <button class="sell-button" data-car-id="${item.id}">Продать</button>
                </div>
            `;
        }).join('');

        // Добавляем обработчики событий для кнопок "Продать"
        const sellButtons = document.querySelectorAll('.sell-button');
        sellButtons.forEach(button => {
            button.addEventListener('click', sellCar);
        });
    }

    function sellCar(event) {
        const carId = event.target.dataset.carId;
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const carIndex = inventory.findIndex(item => item.id === carId);

        if (carIndex === -1) {
            alert('Автомобиль не найден в инвентаре.');
            return;
        }

        const car = inventory[carIndex];
        const sellPrice = Math.floor(car.price * 0.7); // Рассчитываем цену продажи
        let balance = parseFloat(localStorage.getItem('balance')) || 1000;

        balance += sellPrice;
        localStorage.setItem('balance', balance.toFixed(2));
        localStorage.setItem('inventory', JSON.stringify(inventory)); // Обновляем инвентарь в localStorage
        updateBalanceDisplay(); // предполагается, что у тебя есть функция updateBalanceDisplay()

        // Удаляем автомобиль из инвентаря
        inventory.splice(carIndex, 1); // Удаляем элемент из массива
        localStorage.setItem('inventory', JSON.stringify(inventory));
        displayInventory(); // Обновляем отображение инвентаря

        alert(`Вы продали ${car.title} за ${sellPrice.toLocaleString()} ₽!`);
    }

    // Предполагаем, что у тебя есть функция updateBalanceDisplay()
    function updateBalanceDisplay() {
        const balanceElement = document.getElementById('balance'); // Получаем элемент баланса
        if (balanceElement) { // Проверяем, что элемент существует
            balanceElement.textContent = balance.toFixed(2); // Обновляем отображение баланса
        }
    }

    displayInventory();
    updateBalanceDisplay();
});
