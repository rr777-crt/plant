// Добавляем объект с промо-кодами
const promoCodes = {
    "1.0.2.0": {
        drops: 1000,
        suns: 10,
        used: false
    },
    "svetilii13": {
        drops: 2500,
        suns: 0,
        used: false
    },
    "superplant": {
        drops: 5000,
        suns: 25,
        used: false
    }
};

// Создаем интерфейс для ввода кодов
const promoContainer = document.createElement('div');
promoContainer.style.position = 'fixed';
promoContainer.style.top = '20px';
promoContainer.style.right = '20px';
promoContainer.style.zIndex = '1000';

const promoInput = document.createElement('input');
promoInput.type = 'text';
promoInput.placeholder = 'Введите промо-код';
promoInput.style.padding = '8px';
promoInput.style.borderRadius = '4px';
promoInput.style.border = '1px solid #ccc';

const promoButton = document.createElement('button');
promoButton.textContent = 'Активировать';
promoButton.style.padding = '8px 15px';
promoButton.style.marginLeft = '5px';
promoButton.style.backgroundColor = '#4CAF50';
promoButton.style.color = 'white';
promoButton.style.border = 'none';
promoButton.style.borderRadius = '4px';
promoButton.style.cursor = 'pointer';

promoContainer.appendChild(promoInput);
promoContainer.appendChild(promoButton);
document.body.appendChild(promoContainer);

// Обработчик активации кода
promoButton.onclick = function() {
    const code = promoInput.value.trim();
    
    if (!code) {
        showPromoMessage('Введите код!', 'red');
        return;
    }
    
    if (promoCodes[code] && !promoCodes[code].used) {
        // Активируем код
        promoCodes[code].used = true;
        
        if (promoCodes[code].drops > 0) {
            getScore(promoCodes[code].drops);
        }
        
        if (promoCodes[code].suns > 0) {
            getSuns(promoCodes[code].suns);
        }
        
        showPromoMessage(`Код активирован! +${promoCodes[code].drops} капель, +${promoCodes[code].suns} солнц`, 'green');
        promoInput.value = '';
        saveSystem.saveGame();
    } else if (promoCodes[code] && promoCodes[code].used) {
        showPromoMessage('Этот код уже использован!', 'orange');
    } else {
        showPromoMessage('Неверный код!', 'red');
    }
};

// Функция показа сообщения
function showPromoMessage(text, color) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.position = 'fixed';
    message.style.top = '60px';
    message.style.right = '20px';
    message.style.backgroundColor = color;
    message.style.color = 'white';
    message.style.padding = '10px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '1001';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 500);
    }, 3000);
}

// Модифицируем систему сохранений для кодов
const originalSaveGame = saveSystem.saveGame;
saveSystem.saveGame = function() {
    const data = {
        ...JSON.parse(localStorage.getItem('plantClickerSave') || '{}'),
        promoCodes: {}
    };
    
    // Сохраняем состояние каждого кода
    for (const [code, info] of Object.entries(promoCodes)) {
        data.promoCodes[code] = { used: info.used };
    }
    
    localStorage.setItem('plantClickerSave', JSON.stringify(data));
    originalSaveGame();
};

const originalLoadGame = saveSystem.loadGame;
saveSystem.loadGame = function() {
    originalLoadGame();
    const data = JSON.parse(localStorage.getItem('plantClickerSave') || '{}');
    
    if (data.promoCodes) {
        for (const [code, info] of Object.entries(data.promoCodes)) {
            if (promoCodes[code]) {
                promoCodes[code].used = info.used;
            }
        }
    }
};

// Добавляем стили для инпута при фокусе
promoInput.addEventListener('focus', function() {
    this.style.outline = '2px solid #4CAF50';
});

promoInput.addEventListener('blur', function() {
    this.style.outline = 'none';
});

// Автозагрузка при старте
document.addEventListener('DOMContentLoaded', function() {
    saveSystem.loadGame();
});
