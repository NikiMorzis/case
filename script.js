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
    const caseGrid = document.querySelector('.case-grid');
    const resultsContainer = document.getElementById('results-container');
    const coinContainer = document.getElementById('coin-container');
    let lastAddBalanceTime = 0;

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
            // Additional animations here for a better opening effect

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
        const duration = 1000; // ms
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

    function displayResult(caseId, moneyWon) {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `Кейс ${caseId}: Вы выиграли ${moneyWon.toFixed(2)} ₽!`;
        resultsContainer.appendChild(resultItem);

        results.push({ caseId: caseId, moneyWon: moneyWon.toFixed(2) });
        localStorage.setItem('results', JSON.stringify(results));

        // Add fade-in animation
        resultItem.style.opacity = 0;
        resultItem.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
            resultItem.style.opacity = 1;
        }, 50); // Small delay to ensure transition is applied
    }

    async function openCase(caseId, cost, caseElement) {
        if (!caseElement) {
            console.error("Ошибка: caseElement не найден!");
            alert("Произошла ошибка при открытии кейса. Пожалуйста, попробуйте еще раз.");
            return;
        }

        if (balance >= cost) {
            console.log("Баланс перед снятием:", balance);
            balance -= cost;
            localStorage.setItem('balance', balance);
            animateBalanceChange(balance);

            // Add a small delay before the case opening animation
            setTimeout(async () => {
                try {
                    await animateCaseOpening(caseElement);

                    let moneyWon = 0;
                    const superWinChance = 0.01;
                    const normalWinChance = 0.5;

                    console.log(`Кейс ${caseId}: cost=${cost}, superWinChance=${superWinChance}, normalWinChance=${normalWinChance}`);

                    if (Math.random() < superWinChance) {
                        moneyWon = cost * (Math.floor(Math.random() * 100) + 50);
                        console.log("СУПЕР ВЫИГРЫШ!", moneyWon);
                    } else if (Math.random() < normalWinChance) {
                        moneyWon = cost * (Math.random() * 3);
                        console.log("ОБЫЧНЫЙ ВЫИГРЫШ!", moneyWon);
                    } else {
                        moneyWon = cost * (Math.random() * 0.2);
                        console.log("МАЛЕНЬКИЙ ВЫИГРЫШ!", moneyWon);
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

                    // Animate more coins
                    const numCoins = Math.min(moneyWon / 5, 70); // Increase coin count
                    for (let j = 0; j < numCoins; j++) {
                        const startX = caseElement.offsetLeft + caseElement.offsetWidth / 2;
                        const startY = caseElement.offsetTop + caseElement.offsetHeight / 2;
                        animateCoin(startX, startY);
                    }

                    displayResult(caseId, moneyWon);

                } catch (error) {
                    console.error("Ошибка при открытии кейса:", error);
                    alert("Произошла ошибка при открытии кейса. Пожалуйста, попробуйте еще раз.");
                }
            }, 300); // Adjust delay as needed

        } else {
            alert('Недостаточно средств!');
        }
    }

    function addBalance() {
        balance += 1000;
        localStorage.setItem('balance', balance);
        animateBalanceChange(balance);
    }

    function updateAddBalanceButton() {
        addBalanceButton.textContent = "+1000 ₽";
    }

    addBalanceButton.addEventListener('click', () => {
        addBalance();
    });

    caseGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('open-case')) {
            const caseElement = event.target.closest('.case');
            if (!caseElement) {
                console.error("Ошибка: caseElement не найден!");
                alert("Произошла ошибка при открытии кейса. Пожалуйста, попробуйте еще раз.");
                return;
            }
            const caseId = caseElement.dataset.caseId;
            const caseCost = parseFloat(caseElement.querySelector('.case-cost').textContent);

            openCase(caseId, caseCost, caseElement);
        }
    });

    updateBalanceDisplay();
    updateBestWinDisplay();
    updateAddBalanceButton();

    results.forEach(result => {
        displayResult(result.caseId, result.moneyWon);
    });
});