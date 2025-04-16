// Добавляем объект с предметами
const shopItems = {
    sunGenerator: {
        name: "☀️ Маленькое солнце",
        description: "+1 солнце каждые 5 сек",
        price: 10,
        priceType: 'suns',
        owned: 0,
        effect: function() {
            addSuns += 1;
        }
    },
    dropBooster: {
        name: "💧 Капельный усилитель", 
        description: "+100 капель каждые 10 сек",
        price: 100,
        priceType: 'drops',
        owned: 0,
        effect: function() {
            score += 100;
            scoreText.innerText = score;
        }
    }
};

// Функция создания магазина
function initShop() {
    const shopContainer = document.getElementById('shop-container');
    
    for (const [key, item] of Object.entries(shopItems)) {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p class="price">Цена: ${item.price} ${item.priceType === 'drops' ? 'капель' : 'солнц'}</p>
            <button class="buy-btn" data-item="${key}">Купить (${item.owned})</button>
        `;
        shopContainer.appendChild(itemElement);
    }
    
    // Обновляем кнопки
    updateShopButtons();
}

// Функция обновления кнопок магазина
function updateShopButtons() {
    document.querySelectorAll('.buy-btn').forEach(btn => {
        const item = shopItems[btn.dataset.item];
        const canAfford = item.priceType === 'drops' 
            ? score >= item.price 
            : suns >= item.price;
        
        btn.disabled = !canAfford;
        btn.textContent = `Купить (${item.owned})`;
    });
}

// Обработчик покупки
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('buy-btn')) {
        const itemKey = e.target.dataset.item;
        const item = shopItems[itemKey];
        
        // Проверяем возможность покупки
        if (item.priceType === 'drops' && score >= item.price) {
            getScore(-item.price);
        } else if (item.priceType === 'suns' && suns >= item.price) {
            getSuns(-item.price);
        } else {
            return;
        }
        
        // Применяем эффект
        item.effect();
        item.owned++;
        
        // Обновляем интерфейс
        e.target.textContent = `Купить (${item.owned})`;
        updateShopButtons();
        saveSystem.saveGame();
        
        // Показываем сообщение
        showMessage(`Куплено: ${item.name}`);
    }
});

// Функция показа сообщения
function showMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'shop-message';
    msg.textContent = text;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// Добавляем интервалы для эффектов
setInterval(() => {
    if (shopItems.sunGenerator.owned > 0) {
        getSuns(shopItems.sunGenerator.owned);
    }
}, 5000);

setInterval(() => {
    if (shopItems.dropBooster.owned > 0) {
        getScore(shopItems.dropBooster.owned * 100);
    }
}, 10000);

// Модифицируем систему сохранений
const originalSaveGame = saveSystem.saveGame;
saveSystem.saveGame = function() {
    const data = {
        ...JSON.parse(localStorage.getItem('plantClickerSave') || '{}'),
        shopItems: {
            sunGenerator: { owned: shopItems.sunGenerator.owned },
            dropBooster: { owned: shopItems.dropBooster.owned }
        }
    };
    localStorage.setItem('plantClickerSave', JSON.stringify(data));
    originalSaveGame();
};

const originalLoadGame = saveSystem.loadGame;
saveSystem.loadGame = function() {
    originalLoadGame();
    const data = JSON.parse(localStorage.getItem('plantClickerSave') || '{}');
    if (data.shopItems) {
        shopItems.sunGenerator.owned = data.shopItems.sunGenerator?.owned || 0;
        shopItems.dropBooster.owned = data.shopItems.dropBooster?.owned || 0;
    }
};

// Инициализация магазина
document.addEventListener('DOMContentLoaded', initShop);
