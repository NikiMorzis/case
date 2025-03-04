document.addEventListener('DOMContentLoaded', () => {
    const profileBalanceElement = document.getElementById('profile-balance');
    const promoCodeInput = document.getElementById('promo-code-input');
    const activatePromoCodeButton = document.getElementById('activate-promo-code');
    const promoCodeMessage = document.getElementById('promo-code-message');
    const bestWinRankingElement = document.getElementById('best-win-ranking');
    const profileTotalCasesOpenedElement = document.getElementById('profile-total-cases-opened');

    // === Данные из Local Storage или значения по умолчанию ===
    let balance = parseFloat(localStorage.getItem('balance')) || 1000;
    let promoCodesUsed = JSON.parse(localStorage.getItem('promoCodesUsed')) || {};
    let bestWin = parseFloat(localStorage.getItem('bestWin')) || 0;
    let casesOpened = parseInt(localStorage.getItem('casesOpened')) || 0;

    // === Функции ===
    function updateBalanceDisplay() {
        profileBalanceElement.textContent = balance.toFixed(2);
    }

    function updateBestWinRankingDisplay() {
        let rankings = JSON.parse(localStorage.getItem('rankings')) || [];
        rankings.sort((a, b) => b.bestWin - a.bestWin);

        const userIndex = rankings.findIndex(user => user.id === 'current_user');
        let rankingText = 'Нет данных';

        if (userIndex !== -1) {
            rankingText = `${userIndex + 1} место из ${rankings.length}`;
        }
        bestWinRankingElement.textContent = rankingText;
    }

    function applyPromoCode(promoCode) {
        const validPromoCodes = {
            "NIKIMORZIS": 25000,
            "SOSAL": 10000,
            "NIKIMORZISTOP1337": 100000,
        };

        if (validPromoCodes[promoCode] && !promoCodesUsed[promoCode]) {
            balance += validPromoCodes[promoCode];
            promoCodesUsed[promoCode] = true;
            localStorage.setItem('balance', balance.toFixed(2));
            localStorage.setItem('promoCodesUsed', JSON.stringify(promoCodesUsed));
            updateBalanceDisplay();
            promoCodeMessage.textContent = `Промокод активирован! Получено ${validPromoCodes[promoCode]} ₽`;
            promoCodeMessage.style.color = 'green';
            promoCodeInput.value = '';
        } else if (promoCodesUsed[promoCode]) {
            promoCodeMessage.textContent = "Этот промокод уже был активирован.";
            promoCodeMessage.style.color = 'red';
        } else {
            promoCodeMessage.textContent = "Неверный промокод.";
            promoCodeMessage.style.color = 'red';
        }
    }

    function updateRankings() {
        let rankings = JSON.parse(localStorage.getItem('rankings')) || [];
        const userIndex = rankings.findIndex(user => user.id === 'current_user');

        if (userIndex === -1) {
            rankings.push({ id: 'current_user', bestWin: bestWin });
        } else {
            rankings[userIndex].bestWin = bestWin;
        }
        localStorage.setItem('rankings', JSON.stringify(rankings));
        updateBestWinRankingDisplay();
    }

    function updateTotalCasesOpenedDisplay() {
        casesOpened = parseInt(localStorage.getItem('casesOpened')) || 0;
        if (profileTotalCasesOpenedElement) {
            profileTotalCasesOpenedElement.textContent = casesOpened;
        }
    }

    // === Инициализация ===
    updateBalanceDisplay();
    updateRankings();
    updateBestWinRankingDisplay();
    updateTotalCasesOpenedDisplay();

    // === Обработчик события storage ===
    window.addEventListener('storage', (event) => {
        if (event.key === 'casesOpened') {
            updateTotalCasesOpenedDisplay();
        }
    });

    // === ОБРАБОТЧИК ДЛЯ АКТИВАЦИИ ПРОМОКОДА ===
    activatePromoCodeButton.addEventListener('click', () => {
        const promoCode = promoCodeInput.value.trim().toUpperCase();
        applyPromoCode(promoCode);
    });
});
