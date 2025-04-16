'use strict';

// Добавляем переменные для системы удержания кнопки
let buttonHoldTimer = null;
let isButtonHeld = false;
const HOLD_DURATION = 5000; // 5 секунд в миллисекундах
const HOLD_MULTIPLIER = 3; // Множитель за удержание

// Модифицируем обработчики кнопки
button.onmousedown = function() {
    // Запускаем таймер удержания
    buttonHoldTimer = setTimeout(() => {
        isButtonHeld = true;
        console.log('Кнопка удержана 5 секунд - активирован множитель x3!');
    }, HOLD_DURATION);
};

button.onmouseup = function() {
    // Если таймер активен (не достигли 5 секунд), очищаем его
    if (buttonHoldTimer) {
        clearTimeout(buttonHoldTimer);
        buttonHoldTimer = null;
    }
    
    // Если кнопка была удержана 5 секунд
    if (isButtonHeld) {
        // Даем бонус
        const bonus = addPerClick * (HOLD_MULTIPLIER - 1); // Дополнительные 2x от базового
        getScore(bonus);
        getSuns(addSuns * (HOLD_MULTIPLIER - 1));
        
        // Показываем анимацию бонуса
        showHoldBonus(bonus);
        
        // Сбрасываем флаг удержания
        isButtonHeld = false;
    }
};

// Обработчик для случая, когда курсор уходит с кнопки
button.onmouseleave = function() {
    if (buttonHoldTimer) {
        clearTimeout(buttonHoldTimer);
        buttonHoldTimer = null;
    }
    isButtonHeld = false;
};

// Функция для показа анимации бонуса
function showHoldBonus(bonus) {
    const bonusElement = document.createElement('div');
    bonusElement.className = 'hold-bonus';
    bonusElement.textContent = `+${bonus} (x3!)`;
    bonusElement.style.position = 'absolute';
    bonusElement.style.color = 'gold';
    bonusElement.style.fontWeight = 'bold';
    bonusElement.style.fontSize = '24px';
    bonusElement.style.animation = 'floatUp 1.5s ease-out';
    
    // Позиционируем относительно кнопки
    const buttonRect = button.getBoundingClientRect();
    bonusElement.style.left = `${buttonRect.left + buttonRect.width/2 - 50}px`;
    bonusElement.style.top = `${buttonRect.top - 20}px`;
    
    document.body.appendChild(bonusElement);
    
    // Удаляем элемент после анимации
    setTimeout(() => {
        bonusElement.remove();
    }, 1500);
}

// Добавляем CSS для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
