document.addEventListener('DOMContentLoaded', () => {
    const carGrid = document.getElementById('car-grid');
    const cars = [
        {
            id: 'e34',
            title: 'BMW E34',
            price: 550000,
            image: 'e34.jpg',
            canBuy: true // Флаг, указывающий, можно ли купить автомобиль
        },
        {
            id: 'lada2107',
            title: 'Lada 2107',
            price: 150000,
            image: 'lada2107.jpg',
            canBuy: true
        },
        {
            id: 'toyotasupra',
            title: 'Toyota Supra',
            price: 1700000,
            image: 'toyotasupra.jpg',
            canBuy: true
        },
        {
            id: 'ferrari',
            title: 'Ferrari (какая-нибудь)',
            price: 10000000,
            image: 'ferrari.jpg',
            canBuy: true
        }
    ];

    function displayCars() {
        carGrid.innerHTML = cars.map(car => {
            const buttonText = car.canBuy ? 'Купить' : 'Продано';
            const buttonClass = car.canBuy ? 'buy-button' : 'sold-button';

            return `
                <div class="car-card">
                    <img src="" alt="${car.title}" class="car-image">
                    <h2 class="car-title">${car.title}</h2>
                    <p class="car-price">${car.price.toLocaleString()} ₽</p>
                    <button class="${buttonClass}" data-car-id="${car.id}" ${car.canBuy ? '' : 'disabled'}>${buttonText}</button>
                </div>
            `;
        }).join('');

        // Добавляем обработчики событий после добавления карточек в DOM
        const buyButtons = document.querySelectorAll('.buy-button');
        buyButtons.forEach(button => {
            button.addEventListener('click', buyCar);
        });
    }

    function buyCar(event) {
        const carId = event.target.dataset.carId;
        const car = cars.find(car => car.id === carId);

        if (!car) {
            alert('Автомобиль не найден.');
            return;
        }

        if (!car.canBuy) {
            return; // Нельзя купить, если уже куплено
        }

        let balance = parseFloat(localStorage.getItem('balance')) || 1000;

        if (balance >= car.price) {
            balance -= car.price;
            localStorage.setItem('balance', balance.toFixed(2));
            updateBalanceDisplay(); // предполагается, что у тебя есть функция updateBalanceDisplay()

            // Добавляем автомобиль в инвентарь
            addCarToInventory(car);

            // Отмечаем, что автомобиль больше нельзя купить
            car.canBuy = false;
            displayCars(); // Перерисовываем карточки, чтобы кнопка изменилась

            alert(`Вы купили ${car.title}!`);
        } else {
            alert('Недостаточно средств.');
        }
    }

    function addCarToInventory(car) {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

        // Проверяем, есть ли уже такой автомобиль в инвентаре
        const carExists = inventory.some(item => item.id === car.id);

        if (!carExists) {
            inventory.push({...car, canSell: true}); // Добавляем флаг canSell для возможности продажи
            localStorage.setItem('inventory', JSON.stringify(inventory));
        }
    }

    // Предполагаем, что у тебя есть функция updateBalanceDisplay()
    function updateBalanceDisplay() {
        const balanceElement = document.getElementById('balance'); // Получаем элемент баланса
        if (balanceElement) { // Проверяем, что элемент существует
            balanceElement.textContent = balance.toFixed(2); // Обновляем отображение баланса
        }
    }


    displayCars();
    updateBalanceDisplay();
});
