document.addEventListener('DOMContentLoaded', () => {
    const carGrid = document.getElementById('car-grid');
    const cars = [
        {
            id: 'e34',
            title: 'BMW E34',
            price: 550000,
            image: 'e34.jpg' // Замени на путь к изображению
        },
        {
            id: 'lada2107',
            title: 'Lada 2107',
            price: 150000,
            image: 'lada2107.jpg' // Замени на путь к изображению
        },
        {
            id: 'toyotasupra',
            title: 'Toyota Supra',
            price: 1700000,
            image: 'toyotasupra.jpg' // Замени на путь к изображению
        },
        {
            id: 'ferrari',
            title: 'Ferrari 599',
            price: 10000000, // 10 миллионов
            image: 'ferrari.jpg' // Замени на путь к изображению
        }
        // Добавь больше автомобилей здесь
    ];

    function displayCars() {
        carGrid.innerHTML = cars.map(car => `
            <div class="car-card">
                <img src="" alt="${car.title}" class="car-image">
                <h2 class="car-title">${car.title}</h2>
                <p class="car-price">${car.price.toLocaleString()} ₽</p>
                <button class="buy-button" data-car-id="${car.id}">Купить</button>
            </div>
        `).join('');

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

        let balance = parseFloat(localStorage.getItem('balance')) || 1000; // Получаем баланс из Local Storage

        if (balance >= car.price) {
            balance -= car.price;
            localStorage.setItem('balance', balance.toFixed(2)); // Обновляем баланс в Local Storage

            // Добавляем автомобиль в инвентарь
            addCarToInventory(car);

            alert(`Вы купили ${car.title}!`);
            // Обновляем баланс на странице (если у тебя есть элемент для отображения баланса на этой странице)
            // Например: document.getElementById('balance').textContent = balance.toFixed(2);
        } else {
            alert('Недостаточно средств.');
        }
    }

    function addCarToInventory(car) {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        inventory.push(car);
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    displayCars();
});