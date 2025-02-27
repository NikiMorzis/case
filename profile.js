document.addEventListener('DOMContentLoaded', () => {
    const profileBalanceElement = document.getElementById('profile-balance');
    const promoCodeInput = document.getElementById('promo-code-input');
    const activatePromoCodeButton = document.getElementById('activate-promo-code');
    const promoCodeMessage = document.getElementById('promo-code-message');

    // === Данные из Local Storage или значения по умолчанию ===
    let balance = parseFloat(localStorage.getItem('balance')) || 1000;
    let promoCodesUsed = JSON.parse(localStorage.getItem('promoCodesUsed')) || {};

    // === Функции ===
    function updateBalanceDisplay() {
        profileBalanceElement.textContent = balance.toFixed(2);
    }

    // Функция для применения промокода
    function applyPromoCode(promoCode) {
        const validPromoCodes = {
            "NIKIMORZIS": 25000, 
            "SOSAL": 10000,

        };

        if (validPromoCodes[promoCode] && !promoCodesUsed[promoCode]) {
            balance += validPromoCodes[promoCode];
            promoCodesUsed[promoCode] = true;
            localStorage.setItem('balance', balance.toFixed(2));
            localStorage.setItem('promoCodesUsed', JSON.stringify(promoCodesUsed));
            updateBalanceDisplay();
            promoCodeMessage.textContent = `Промокод активирован! Получено ${validPromoCodes[promoCode]} ₽`;
            promoCodeMessage.style.color = 'green';
            promoCodeInput.value = ''; // Очищаем поле ввода
        } else if (promoCodesUsed[promoCode]) {
            promoCodeMessage.textContent = "Этот промокод уже был активирован.";
            promoCodeMessage.style.color = 'red';
        } else {
            promoCodeMessage.textContent = "Неверный промокод.";
            promoCodeMessage.style.color = 'red';
        }
    }

    // === Обработчики событий ===
    activatePromoCodeButton.addEventListener('click', () => {
        const promoCode = promoCodeInput.value.trim().toUpperCase();
        applyPromoCode(promoCode);
    });

    // === Инициализация ===
    updateBalanceDisplay();
});