document.addEventListener('DOMContentLoaded', () => {
    let balance = parseFloat(localStorage.getItem('balance'));
    if (isNaN(balance)) {
        balance = 1000;
    }

    let bestWin = parseFloat(localStorage.getItem('bestWin'));
    if (isNaN(bestWin)) {
        bestWin = 0;
    }

    let results = JSON.parse(localStorage.getItem('results')) || [];

    const balanceElement = document.getElementById('balance');
    const bestWinElement = document.getElementById('best-win');
    const addBalanceButton = document.getElementById('add-balance-button');
    const caseGrid = document.getElementById('case-grid');
    const resultsContainer = document.getElementById('results-container');
    const coinContainer = document.getElementById('coin-container');
    const winNotification = document.getElementById('win-notification');
    const totalWinNotification = document.getElementById('total-win-notification');
    const clickerButton = document.getElementById('clicker-button');
    const caseModal = document.getElementById('case-modal');
    const closeModalButton = caseModal.querySelector('.close-button');
    const openCaseModalButton = document.getElementById('open-case-modal-button');
    const openCountInput = document.getElementById('open-count');
    const selectedCaseContent = document.getElementById('selected-case-content');
    let selectedCaseData = null;
    let lastAddBalanceTime = 0;

    // Case Data
    const casesData = [
        { id: 1, title: "Начальный", cost: 100, superWinChance: 0.02 },
        { id: 2, title: "Бронзовый", cost: 150, superWinChance: 0.015 },
        { id: 3, title: "Серебряный", cost: 200, superWinChance: 0.01 },
        { id: 4, title: "Золотой", cost: 300, superWinChance: 0.008 },
        { id: 5, title: "Платиновый", cost: 500, superWinChance: 0.005 },
        { id: 6, title: "Легендарный", cost: 1000, superWinChance: 0.003 },
        { id: 7, title: "Эпический", cost: 10000, superWinChance: 0.001 },
        { id: 8, title: "Мифический", cost: 25000, superWinChance: 0.0005 },
        { id: 9, title: "Божественный", cost: 50000, superWinChance: 0.0001 },
        { id: 10, title: "Космический", cost: 100000, superWinChance: 0.00005 }
    ];

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

    function animateCaseOpening(caseElement) {
        return new Promise((resolve, reject) => {
            caseElement.classList.add('case-opening');

            const animationEndHandler = () => {
                caseElement.classList.remove('case-opening');
                caseElement.removeEventListener('animationend', animationEndHandler);
                caseElement.removeEventListener('animationcancel', animationCancelHandler);
                resolve();
            };

            const animationCancelHandler = () => {
                caseElement.classList.remove('case-opening');
                caseElement.removeEventListener('animationend', animationEndHandler);
                caseElement.removeEventListener('animationcancel', animationCancelHandler);
                reject("Анимация отменена");
            };

            caseElement.addEventListener('animationend', animationEndHandler);
            caseElement.addEventListener('animationcancel', animationCancelHandler);
        });
    }

    function animateBalanceChange(newBalance) {
        const startBalance = parseFloat(balanceElement.textContent);
        const duration = 1000;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentValue = startBalance + (newBalance - startBalance) * progress;

            balanceElement.textContent = currentValue.toFixed(2);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }

    function displayResult(caseName, moneyWon) {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `Кейс "${caseName}": Вы выиграли ${moneyWon.toFixed(2)} ₽!`;
        resultsContainer.appendChild(resultItem);

        results.push({ caseId: caseName, moneyWon: moneyWon.toFixed(2) });
        localStorage.setItem('results', JSON.stringify(results));

        resultItem.style.opacity = 0;
        resultItem.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
            resultItem.style.opacity = 1;
        }, 50);
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

    function displaySelectedCase(caseData) {
        selectedCaseContent.innerHTML = `
            <div class="case-title-modal">${caseData.title}</div>
            <div class="case-cost-modal">Цена: ${caseData.cost} ₽</div>
        `;
    }

    async function openCase(caseData, openCount) {
        const cost = parseFloat(caseData.cost);
        let totalWon = 0;
        for (let i = 0; i < openCount; i++) {
            if (balance >= cost) {
                balance -= cost;
                localStorage.setItem('balance', balance);
                animateBalanceChange(balance);

                await new Promise(resolve => setTimeout(resolve, 300));

                const superWinChance = caseData.superWinChance;
                const normalWinChance = 0.45;
                const lowWinChance = 0.3;
                const randomValue = Math.random();
                let moneyWon = 0;

                if (randomValue < superWinChance) {
                    moneyWon = cost * (Math.floor(Math.random() * 100) + 50);
                    console.log("СУПЕР ВЫИГРЫШ!", moneyWon);
                } else if (randomValue < superWinChance + normalWinChance) {
                    moneyWon = cost * (Math.random() * 2 + 0.5);
                    console.log("ОБЫЧНЫЙ ВЫИГРЫШ!", moneyWon);
                } else if (randomValue < superWinChance + normalWinChance + lowWinChance) {
                    moneyWon = cost * (Math.random() * 0.4 + 0.1);
                    console.log("НЕБОЛЬШОЙ ВЫИГРЫШ", moneyWon);
                } else {
                    moneyWon = cost * (Math.random() * 0.1);
                    console.log("МИНИМАЛЬНЫЙ ВЫИГРЫШ", moneyWon);
                }

                moneyWon = parseFloat(moneyWon.toFixed(2));
                console.log("Выигрыш:", moneyWon);

                balance += moneyWon;
                localStorage.setItem('balance', balance);
                animateBalanceChange(balance);

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

                displayResult(caseData.title, moneyWon);
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
    }

    function addBalance() {
        const currentTime = Date.now();
        const timeSinceLastAdd = currentTime - lastAddBalanceTime;

        if (timeSinceLastAdd >= 60000) {
            balance += 1000;
            localStorage.setItem('balance', balance);
            animateBalanceChange(balance);
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
    setInterval(updateAddBalanceButton, 1000);

    addBalanceButton.addEventListener('click', () => {
        addBalance();
    });

    caseGrid.addEventListener('click', (event) => {
        if (event.target.closest('.case')) {
            const caseElement = event.target.closest('.case');
            const caseId = parseInt(caseElement.dataset.caseId, 10);
            selectedCaseData = casesData.find(c => c.id === caseId);

            if (selectedCaseData) {
                displaySelectedCase(selectedCaseData);
                caseModal.style.display = 'block';
            }
        }
    });

    closeModalButton.addEventListener('click', () => {
        caseModal.style.display = 'none';
    });

    openCaseModalButton.addEventListener('click', () => {
        if (selectedCaseData) {
            const openCount = parseInt(openCountInput.value, 10);
            if (isNaN(openCount) || openCount < 1) {
                alert("Пожалуйста, введите корректное количество (минимум 1).");
                return;
            }
            openCase(selectedCaseData, openCount);
            caseModal.style.display = 'none';
        }
    });

    clickerButton.addEventListener('click', () => {
        balance += 5;
        localStorage.setItem('balance', balance);
        animateBalanceChange(balance);
        showWinNotification(5);
    });

    // Initialize the case grid
    populateCaseGrid();
    updateBalanceDisplay();
    updateBestWinDisplay();
    updateAddBalanceButton();
    results.forEach(result => {
        displayResult(result.caseId, result.moneyWon);
    });
});
