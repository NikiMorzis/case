document.addEventListener('DOMContentLoaded', () => {
    const carGrid = document.getElementById('car-grid');
    const cars = [
        {
            id: 'e34',
            title: 'BMW E34',
            price: 550000,
            image: 'e34.jpg',
            canBuy: true,
            type: 'car' // Добавляем тип для классификации (car, motorcycle, etc.)
        },
        {
            id: 'lada2107',
            title: 'Lada 2107',
            price: 150000,
            image: 'lada2107.jpg',
            canBuy: true,
            type: 'car'
        },
        {
            id: 'toyotasupra',
            title: 'Toyota Supra',
            price: 1700000,
            image: 'toyotasupra.jpg',
            canBuy: true,
            type: 'car'
        },
        {
            id: 'ferrari',
            title: 'Ferrari (какая-нибудь)',
            price: 10000000,
            image: 'ferrari.jpg',
            canBuy: true,
            type: 'car'
        },
        {
            id: 'kawasakiH2R',
            title: 'KAWASAKI H2R',
            price: 7700000,
            image: 'kawasakiH2R.jpg', // Нужно добавить изображение
            canBuy: true,
            type: 'motorcycle'
        },
        {
            id: 'yamahaR1',
            title: 'Yamaha R1',
            price: 1100000,
            image: 'yamahaR1.jpg',  // Нужно добавить изображение
            canBuy: true,
            type: 'motorcycle'
        },
        {
            id: 'rollsRoyceSpectre',
            title: 'Rolls-Royce Spectre',
            price: 70000000,
            image: 'rollsRoyceSpectre.jpg', // Нужно добавить изображение
            canBuy: true,
            type: 'rollsRoyce'
        },
         {
            id: 'rollsRoyceCulliman',
            title: 'Rolls-Royce Culliman',
            price: 150000000,
            image: 'rollsRoyceCulliman.jpg', // Нужно добавить изображение
            canBuy: true,
            type: 'rollsRoyce'
        },
         {
            id: 'bugattiVeyron',
            title: 'Bugatti Veyron',
            price: 350000000,
            image: 'bugattiVeyron.jpg', // Нужно добавить изображение
            canBuy: true,
            type: 'bugatti'
        }
    ];

    // Добавляем элементы фильтрации и сортировки в HTML (см. ниже)
    const filterSelect = document.getElementById('filter-select');
    const sortSelect = document.getElementById('sort-select');

    function displayCars() {
      // Получаем выбранные значения фильтра и сортировки
        const filterValue = filterSelect.value;
        const sortValue = sortSelect.value;

        // Фильтруем автомобили
        let filteredCars = cars;
        if (filterValue !== 'all') {
            filteredCars = cars.filter(car => car.type === filterValue); // Предполагаем, что у вас есть поле type в данных об автомобиле
        }

        // Сортируем автомобили
        let sortedCars = filteredCars;
        if (sortValue !== 'default') {
            sortedCars = filteredCars.slice().sort((a, b) => { // Создаем копию массива для сортировки, чтобы не менять исходный массив
                if (sortValue === 'price-asc') {
                    return a.price - b.price;
                } else if (sortValue === 'price-desc') {
                    return b.price - a.price;
                }
                return 0;
            });
        }

        // Отображаем отфильтрованные и отсортированные автомобили
        carGrid.innerHTML = sortedCars.map(car => {
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

      // Добавляем обработчики событий после добавления карточек в DOM (как и раньше)
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

            // Отмечаем, что автомобиль больше нельзя купить (и сохраняем)
            car.canBuy = false;
            updateCarAvailability(carId, false); // Функция для обновления canBuy в localStorage

            displayCars(); // Перерисовываем карточки, чтобы кнопка изменилась

            alert(`Вы купили ${car.title}!`);
        } else {
            alert('Недостаточно средств.');
        }
    }

    function addCarToInventory(car) {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

        // Проверяем, есть ли уже такой автомобиль в инвентаре (независимо от canSell)
        const carExists = inventory.some(item => item.id === car.id);

        if (!carExists) {
            inventory.push({...car, canSell: true}); // Добавляем флаг canSell для возможности продажи
            localStorage.setItem('inventory', JSON.stringify(inventory));
        }
    }

    // Функция для обновления canBuy в localStorage
    function updateCarAvailability(carId, canBuy) {
        let carData = JSON.parse(localStorage.getItem('carData')) || {};
        carData[carId] = { canBuy: canBuy };
        localStorage.setItem('carData', JSON.stringify(carData));
    }


    // Предполагаем, что у тебя есть функция updateBalanceDisplay()
    function updateBalanceDisplay() {
        const balanceElement = document.getElementById('balance'); // Получаем элемент баланса
        if (balanceElement) { // Проверяем, что элемент существует
            balanceElement.textContent = parseFloat(localStorage.getItem('balance')).toFixed(2); // Обновляем отображение баланса
        }
    }

    // Функция для восстановления состояния canBuy при загрузке страницы
    function restoreCarAvailability() {
        let carData = JSON.parse(localStorage.getItem('carData')) || {};
        cars.forEach(car => {
            if (carData[car.id] && carData[car.id].canBuy !== undefined) {
                car.canBuy = carData[car.id].canBuy;
            }
        });
    }

    // Добавляем обработчики событий для фильтра и сортировки
    filterSelect.addEventListener('change', displayCars);
    sortSelect.addEventListener('change', displayCars);

    restoreCarAvailability(); // Восстанавливаем состояние canBuy при загрузке
    displayCars();
    updateBalanceDisplay();
});
