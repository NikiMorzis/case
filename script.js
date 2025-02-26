document.addEventListener('DOMContentLoaded', () => {
    // === Данные из Local Storage или значения по умолчанию ===
    let balance = parseFloat(localStorage.getItem('balance')) || 1000;
    let bestWin = parseFloat(localStorage.getItem('bestWin')) || 0;
    let casesOpened = parseInt(localStorage.getItem('casesOpened')) || 0;
    let promoCodesUsed = JSON.parse(localStorage.getItem('promoCodesUsed')) || {};

    // === DOM-элементы ===
    const balanceElement = document.getElementById('balance');
    const bestWinElement = document.getElementById('best-win');
    const addBalanceButton = document.getElementById('add-balance-button');
    const caseGrid = document.getElementById('case-grid');
    const resultsContainer = document.getElementById('results-container');
    const coinContainer = document.getElementById('coin-container');
    const winNotification = document.getElementById('win-notification');
    const totalWinNotification = document.getElementById('total-win-notification');
    const caseModal = document.getElementById('case-modal');
    const closeModalButton = caseModal.querySelector('.close-button');
    const openCaseModalButton = document.getElementById('open-case-modal-button');
    const openCountInput = document.getElementById('open-count');
    const selectedCaseContent = document.getElementById('selected-case-content');
    const promoCodeInput = document.getElementById('promo-code-input');
    const activatePromoCodeButton = document.getElementById('activate-promo-code');
    const promoCodeMessage = document.getElementById('promo-code-message');

    let selectedCaseData = null;
    let lastAddBalanceTime = 0;

    // === Данные о кейсах ===
    const casesData = [
        { id: 1, title: "Деревянный сундук", cost: 50, superWinChance: 0.01, normalWinChance: 0.49, lowWinChance: 0.3, minWinChance: 0.2 },
        { id: 2, title: "Железный ящик", cost: 100, superWinChance: 0.01, normalWinChance: 0.49, lowWinChance: 0.3, minWinChance: 0.2 },
        { id: 3, title: "Серебряный ларец", cost: 500, superWinChance: 0.01, normalWinChance: 0.49, lowWinChance: 0.3, minWinChance: 0.2 },
        { id: 4, title: "Золотой саркофаг", cost: 1000, superWinChance: 0.01, normalWinChance: 0.49, lowWinChance: 0.3, minWinChance: 0.2 },
        { id: 5, title: "Алмазный кейс", cost: 5000, superWinChance: 0.01, normalWinChance: 0.49, lowWinChance: 0.3, minWinChance: 0.2 },
        { id: 6, title: "Рубиновый сундук", cost: 10000, superWinChance: 0.01, normalWinChance: 0.49, lowWinChance: 0.3, minWinChance: 0.2 },
        { id: 7, title: "Мистический ящик", cost: 50000, superWinChance: 0.01, normalWinChance: 0.49, lowWinChance: 0.3, minWinChance: 0.2 },
        { id: 8, title: "Божественный ларец", cost: 100000, superWinChance: 0.01, normalWinChance: 0.49, lowWinChance: 0.3, minWinChance: 0.2 }
    ];

    // === Функции для работы с данными ===
    function updateBalanceDisplay() {
        balanceElement.textContent = balance.toFixed(2);
    }

    function updateBestWinDisplay() {
        bestWinElement.textContent = bestWin.toFixed(2);
    }

    function animateCoin(x, y) {
        const coin = document.createElement('div');
        coin.classList.add('coin');
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        coinContainer.appendChild(coin);

        coin.addEventListener('animationend', () => {
            coin.remove();
        });
    }

    function showWinNotification(moneyWon) {
        winNotification.textContent = `Вы выиграли ${moneyWon.toFixed(2)} ₽!`;
        winNotification.classList.add('show');
        setTimeout(() => {
            winNotification.classList.remove('show');
        }, 3000);
    }

    function showTotalWinNotification(totalWon) {
        totalWinNotification.textContent = `Общий выигрыш: ${totalWon.toFixed(2)} ₽!`;
        totalWinNotification.classList.add('show');
        setTimeout(() => {
            totalWinNotification.classList.remove('show');
        }, 3000);
    }

    function displaySelectedCase(caseData) {
        selectedCaseContent.innerHTML = `
            <div class="case-title-modal">${caseData.title}</div>
            <div class="case-cost-modal">Цена: ${caseData.cost} ₽</div>
            <div id="total-cost-modal"></div> <!-- Место для отображения общей стоимости -->
        `;
        updateTotalCost(caseData);
          // Слушаем изменения в input с количеством кейсов внутри модалки (ДОБАВЛЕНО ЗДЕСЬ!)
          openCountInput.addEventListener('input', () => {
            if (selectedCaseData) {
                updateTotalCost(selectedCaseData);
            }
        });
    }

    function updateTotalCost(caseData) {
        const openCount = parseInt(openCountInput.value, 10) || 1; // Default to 1 if NaN
        const totalCost = caseData.cost * openCount;
        const totalCostModal = document.getElementById('total-cost-modal');
        if (totalCostModal) { // Добавлена проверка на существование элемента
            totalCostModal.textContent = `Общая стоимость: ${totalCost.toFixed(2)} ₽`;
        }
    }

    // Функция для применения промокода
    function applyPromoCode(promoCode) {
        const validPromoCodes = {
            "GAMES": 100000, // Пример промокода на 100000
            "START": 5000,
            "BONUS": 1000,
            "HELLO": 100,
        };
        if (validPromoCodes[promoCode] && !promoCodesUsed[promoCode]) {
            balance += validPromoCodes[promoCode];
            promoCodesUsed[promoCode] = true;
            localStorage.setItem('balance', balance);
            localStorage.setItem('promoCodesUsed', JSON.stringify(promoCodesUsed));
            updateBalanceDisplay();
            promoCodeMessage.textContent = `Промокод активирован! Получено ${validPromoCodes[promoCode]} ₽`;
            promoCodeMessage.style.color = 'green';
        } else if (promoCodesUsed[promoCode]) {
            promoCodeMessage.textContent = "Этот промокод уже был активирован.";
            promoCodeMessage.style.color = 'red';
        } else {
            promoCodeMessage.textContent = "Неверный промокод.";
            promoCodeMessage.style.color = 'red';
        }
    }

    function openCase(caseData, openCount) {
        const cost = parseFloat(caseData.cost);
        let totalWon = 0;

        for (let i = 0; i < openCount; i++) {
            if (balance >= cost) {
                balance -= cost;
                localStorage.setItem('balance', balance);
                updateBalanceDisplay();

                const superWinChance = caseData.superWinChance;
                const normalWinChance = caseData.normalWinChance;
                const randomValue = Math.random();
                let moneyWon = 0;

                if (randomValue < superWinChance) {
                    moneyWon = cost * (Math.floor(Math.random() * 100) + 50);
                } else if (randomValue < superWinChance + normalWinChance) {
                    moneyWon = cost * (Math.random() * 2 + 0.5);
                } else {
                    moneyWon = cost * (Math.random() * 0.1);
                }

                moneyWon = parseFloat(moneyWon.toFixed(2));

                balance += moneyWon;
                localStorage.setItem('balance', balance);
                updateBalanceDisplay();

                if (moneyWon > bestWin) {
                    bestWin = moneyWon;
                    localStorage.setItem('bestWin', bestWin);
                    updateBestWinDisplay();
                }

                const numCoins = Math.min(moneyWon / 5, 70);
                for (let j = 0; j < numCoins; j++) {
                    const startX = caseGrid.offsetLeft + caseGrid.offsetWidth / 2;
                    const startY = caseGrid.offsetTop + caseGrid.offsetHeight / 2;
                    animateCoin(startX, startY);
                }

                showWinNotification(moneyWon);
                totalWon += moneyWon;
            } else {
                alert('Недостаточно средств!');
                break;
            }
        }

        if (totalWon > 0) {
            showTotalWinNotification(totalWon);
        }

        return totalWon; // Возвращаем общий выигрыш
    }

    function generateCaseHTML(caseData) {
        return `
            <div class="case" data-case-id="${caseData.id}">
                <div class="case-content">
                    <div class="case-title">${caseData.title}</div>
                </div>
                <p>Цена: <span class="case-cost">${caseData.cost}</span> ₽</p>
            </div>
        `;
    }

    function populateCaseGrid() {
        casesData.forEach(caseData => {
            const caseHTML = generateCaseHTML(caseData);
            caseGrid.innerHTML += caseHTML;
        });
    }

    function addBalance() {
        const currentTime = Date.now();
        const timeSinceLastAdd = currentTime - lastAddBalanceTime;

        if (timeSinceLastAdd >= 60000) {
            balance += 1000;
            localStorage.setItem('balance', balance);
            updateBalanceDisplay();
            lastAddBalanceTime = currentTime;
            updateAddBalanceButton();
        }

        updateAddBalanceButton();
    }

    function updateAddBalanceButton() {
        const currentTime = Date.now();
        const timeSinceLastAdd = currentTime - lastAddBalanceTime;

        if (timeSinceLastAdd >= 60000) {
            addBalanceButton.textContent = "+1000 ₽ (доступно)";
            addBalanceButton.disabled = false;
        } else {
            const timeLeft = (60000 - timeSinceLastAdd) / 1000;
            addBalanceButton.textContent = `+1000 ₽ (через ${timeLeft.toFixed(0)}с)`;
            addBalanceButton.disabled = true;
        }
    }

    // === Инициализация страницы и обработчики событий ===
    populateCaseGrid();
    updateBalanceDisplay();
    updateBestWinDisplay();
    updateAddBalanceButton();

    // Обработчик для кнопки добавления баланса
    addBalanceButton.addEventListener('click', () => {
        addBalance();
    });

    // Обработчик для открытия модального окна кейса
    caseGrid.addEventListener('click', (event) => {
        const caseElement = event.target.closest('.case');
        if (caseElement) {
            const caseId = parseInt(caseElement.dataset.caseId, 10);
            selectedCaseData = casesData.find(c => c.id === caseId);

            if (selectedCaseData) {
                displaySelectedCase(selectedCaseData);
                  // Слушаем изменения в input с количеством кейсов внутри модалки (ДОБАВЛЕНО ЗДЕСЬ!)
                openCountInput.addEventListener('input', () => {
                  updateTotalCost(selectedCaseData);
                });
                caseModal.style.display = 'block';
            }
        }
    });

    // Обработчик для закрытия модального окна
    closeModalButton.addEventListener('click', () => {
        caseModal.style.display = 'none';
    });

    // Обработчик для открытия кейса из модального окна
    openCaseModalButton.addEventListener('click', () => {
        if (selectedCaseData) {
            const openCount = parseInt(openCountInput.value, 10) || 1; // Use value or default to 1
            const totalWon = openCase(selectedCaseData, openCount); // Открываем кейс и получаем общий выигрыш
            caseModal.style.display = 'none'; // Закрываем модальное окно после открытия кейса
            if (totalWon > 0) {
                showTotalWinNotification(totalWon); // Показываем уведомление об общем выигрыше
            }
        }
    });

    // Обработчик для активации промокода
    activatePromoCodeButton.addEventListener('click', () => {
        const promoCode = promoCodeInput.value.trim().toUpperCase();
        applyPromoCode(promoCode);
    });
});
