// ================ ОБНОВЛЁННЫЙ КОНФИГ ================
const eliteConfig = {
    crystalPrice: 1000000000000, // 1 триллион капель = 1 кристалл
    boost: {
        price: 5, // 5 кристаллов
        multiplier: 2, // x2 капель
        duration: 10000 // 10 секунд
    },
    musicTracks: {
        // ... (ваши музыкальные треки) ...
    }
};

// ================ ОБНОВЛЁННЫЙ ИНТЕРФЕЙС ================
// Перемещаем кристаллы в левый верхний угол
crystalDisplay.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    font-size: 24px;
    color: #00BCD4;
    text-shadow: 0 0 5px rgba(0,188,212,0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 5px;
`;

// Добавляем кнопку буста
const boostBtn = document.createElement('button');
boostBtn.innerHTML = '⚡ x2 Буст';
boostBtn.style.cssText = `
    position: fixed;
    bottom: 280px;
    right: 20px;
    padding: 10px 15px;
    background: linear-gradient(135deg, #FFC107, #FF9800);
    color: #333;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

// ================ ЛОГИКА БУСТА ================
let isBoostActive = false;
let boostEndTime = 0;

function activateBoost() {
    if (isBoostActive) {
        showMessage(`Буст уже активен! Осталось: ${Math.ceil((boostEndTime - Date.now())/1000)}сек`, '#FF9800');
        return;
    }
    
    if (crystals >= eliteConfig.boost.price) {
        crystals -= eliteConfig.boost.price;
        isBoostActive = true;
        boostEndTime = Date.now() + eliteConfig.boost.duration;
        updateCrystalDisplay();
        saveSystem.saveGame();
        
        // Визуальные эффекты
        document.body.style.animation = 'pulse 0.5s infinite';
        showMessage(`Буст x${eliteConfig.boost.multiplier} активирован на 10 сек!`, '#FFC107');
        
        // Автоматическое отключение
        setTimeout(() => {
            isBoostActive = false;
            document.body.style.animation = '';
            showMessage('Буст закончился!', '#888');
        }, eliteConfig.boost.duration);
    } else {
        showMessage(`Нужно ещё ${eliteConfig.boost.price - crystals} кристаллов!`, 'red');
    }
}

// Стили для анимации буста
const boostStyle = document.createElement('style');
boostStyle.textContent = `
    @keyframes pulse {
        0% { background-color: rgba(255,193,7,0.05); }
        50% { background-color: rgba(255,193,7,0.15); }
        100% { background-color: rgba(255,193,7,0.05); }
    }
`;
document.head.appendChild(boostStyle);

// ================ ОБНОВЛЁННАЯ СИСТЕМА КАПЕЛЬ ================
const originalGetScore = getScore;
getScore = function(n) {
    const multiplier = isBoostActive ? eliteConfig.boost.multiplier : 1;
    originalGetScore(n * multiplier);
};

// ================ ИНИЦИАЛИЗАЦИЯ ================
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем кнопку буста
    document.body.appendChild(boostBtn);
    boostBtn.onclick = activateBoost;
    
    // Обновляем отображение кристаллов
    updateCrystalDisplay();
});

// ================ ОБНОВЛЁННЫЕ СОХРАНЕНИЯ ================
saveSystem.saveGame = function() {
    const data = {
        // ... (ваши существующие данные) ...
        crystals: crystals,
        boost: {
            active: isBoostActive,
            endTime: boostEndTime
        }
    };
    localStorage.setItem('plantClickerSave', JSON.stringify(data));
};

saveSystem.loadGame = function() {
    const data = JSON.parse(localStorage.getItem('plantClickerSave') || '{}');
    crystals = data.crystals || 0;
    
    if (data.boost && data.boost.active) {
        if (Date.now() < data.boost.endTime) {
            isBoostActive = true;
            boostEndTime = data.boost.endTime;
            const remainingTime = data.boost.endTime - Date.now();
            document.body.style.animation = 'pulse 0.5s infinite';
            
            setTimeout(() => {
                isBoostActive = false;
                document.body.style.animation = '';
            }, remainingTime);
        }
    }
};
