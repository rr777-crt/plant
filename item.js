'use strict';

// Добавляем объект с предметами
const shopItems = {
    sunGenerator: {
        name: "☀️ Маленькое солнце",
        description: "Дает +1 солнце каждые 20 секунд",
        price: 10, // цена в солнцах
        owned: 0,
        effect: function() {
            addSuns += 1; // +1 солнце
        }
    },
    sunGeneratorPro: {
        name: "🔥 Большое солнце",
        description: "Дает +5 солнц каждые 20 секунд",
        price: 50, // цена в солнцах
        owned: 0,
        effect: function() {
            addSuns += 5; // +5 солнц
        }
    },
    dropBooster: {
        name: "💧 Капельный усилитель",
        description: "Дает +100 капель каждые 10 секунд",
        price: 100, // цена в каплях
        priceType: 'drops', // тип валюты (по умолчанию - солнца)
        owned: 0,
        effect: function() {
            score += 100; // +100 капель
            scoreText.innerText = score;
        }
    },
    dropBoosterPro: {
        name: "🌊 Мощный капельный усилитель",
        description: "Дает +1000 капель каждые 10 секунд",
        price: 1000, // цена в каплях
        priceType: 'drops',
        owned: 0,
        effect: function() {
            score += 1000; // +1000 капель
            scoreText.innerText = score;
        }
    }
};

// Создаем интерфейс магазина
function createShop() {
    const shopDiv = document.createElement('div');
    shopDiv.id = 'shop';
    shopDiv.style.position = 'fixed';
    shopDiv.style.right = '20px';
    shopDiv.style.top = '20px';
    shopDiv.style.backgroundColor = '#333';
    shopDiv.style.padding = '15px';
    shopDiv.style.borderRadius = '10px';
    shopDiv.style.color = 'white';
    shopDiv.style.zIndex = '1000';
    
    const shopTitle = document.createElement('h2');
    shopTitle.textContent = '🛒 Магазин предметов';
    shopDiv.appendChild(shopTitle);
    
    // Создаем элементы для каждого предмета
    for (const [key, item] of Object.entries(shopItems)) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        itemDiv.style.margin = '10px 0';
        itemDiv.style.padding = '10px';
        itemDiv.style.border = '1px solid #555';
        itemDiv.style.borderRadius = '5px';
        
        const itemName = document.createElement('h3');
        itemName.textContent = `${item.name} (${item.owned} куплено)`;
        itemName.style.margin = '0 0 5px 0';
        
        const itemDesc = document.createElement('p');
        itemDesc.textContent = item.description;
        itemDesc.style.margin = '0 0 5px 0';
        itemDesc.style.fontSize = '14px';
        itemDesc.style.color = '#ccc';
        
        const itemPrice = document.createElement('p');
        const priceType = item.priceType === 'drops' ? 'капель' : 'солнц';
        itemPrice.textContent = `Цена: ${item.price} ${priceType}`;
        itemPrice.style.margin = '0 0 5px 0';
        itemPrice.style.fontWeight = 'bold';
        
        const buyButton = document.createElement('button');
        buyButton.textContent = 'Купить';
        buyButton.style.padding = '5px 10px';
        buyButton.style.cursor = 'pointer';
        
        // Проверяем, хватает ли валюты
        const canAfford = () => {
            if (item.priceType === 'drops') {
                return score >= item.price;
            } else {
                return suns >= item.price;
            }
        };
        
        // Обновляем состояние кнопки
        const updateButtonState = () => {
            if (canAfford()) {
                buyButton.disabled = false;
                buyButton.style.backgroundColor = '#4CAF50';
            } else {
                buyButton.disabled = true;
                buyButton.style.backgroundColor = '#555';
            }
        };
        
        updateButtonState();
        
        // Обработчик покупки
        buyButton.onclick = function() {
            if (canAfford()) {
                // Вычитаем цену
                if (item.priceType === 'drops') {
                    getScore(-item.price);
                } else {
                    getSuns(-item.price);
                }
                
                // Применяем эффект
                item.effect();
                
                // Увеличиваем счетчик купленных
                item.owned++;
                itemName.textContent = `${item.name} (${item.owned} куплено)`;
                
                // Показываем сообщение
                alert(`Вы купили ${item.name}!`);
                
                // Обновляем состояние кнопки
                updateButtonState();
                
                // Сохраняем игру
                saveSystem.saveGame();
            }
        };
        
        itemDiv.appendChild(itemName);
        itemDiv.appendChild(itemDesc);
        itemDiv.appendChild(itemPrice);
        itemDiv.appendChild(buyButton);
        shopDiv.appendChild(itemDiv);
    }
    
    document.body.appendChild(shopDiv);
}

// Модифицируем систему сохранений для предметов
const saveSystem = {
    saveGame: function() {
        const gameData = {
            score: score,
            addPerClick: addPerClick,
            addPerSecond: addPerSecond,
            suns: suns,
            addSuns: addSuns,
            casePrice: casePrice,
            casePriceo: casePriceo,
            shopItems: {}
        };
        
        // Сохраняем состояние магазина
        for (const [key, item] of Object.entries(shopItems)) {
            gameData.shopItems[key] = {
                owned: item.owned
            };
        }
        
        localStorage.setItem('plantClickerSave', JSON.stringify(gameData));
        console.log('Игра сохранена');
    },
    
    loadGame: function() {
        const savedData = localStorage.getItem('plantClickerSave');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            
            // Восстанавливаем основные значения
            score = gameData.score || 0;
            addPerClick = gameData.addPerClick || 1;
            addPerSecond = gameData.addPerSecond || 0;
            suns = gameData.suns || 0;
            addSuns = gameData.addSuns || 0.01;
            casePrice = gameData.casePrice || 1;
            casePriceo = gameData.casePriceo || 2;
            
            // Восстанавливаем предметы
            if (gameData.shopItems) {
                for (const [key, itemData] of Object.entries(gameData.shopItems)) {
                    if (shopItems[key]) {
                        shopItems[key].owned = itemData.owned || 0;
                        // Применяем эффекты купленных предметов
                        for (let i = 0; i < itemData.owned; i++) {
                            shopItems[key].effect();
                        }
                    }
                }
            }
            
            // Обновляем интерфейс
            scoreText.innerText = score;
            addText.innerText = addPerClick;
            sunsDiv.innerText = suns.toFixed(2);
            checkBGImage();
            
            console.log('Игра загружена');
            return true;
        }
        console.log('Сохранение не найдено');
        return false;
    },
    // ... остальные методы saveSystem
};

// Добавляем интервалы для эффектов предметов
setInterval(() => {
    // Применяем эффекты генераторов солнц
    const sunGenerators = [shopItems.sunGenerator, shopItems.sunGeneratorPro];
    sunGenerators.forEach(item => {
        if (item.owned > 0) {
            getSuns((item.effect.toString().includes('+= 1') ? 1 : 5) * item.owned);
        }
    });
}, 5000); // Каждые 5 секунд

setInterval(() => {
    // Применяем эффекты усилителей капель
    const dropBoosters = [shopItems.dropBooster, shopItems.dropBoosterPro];
    dropBoosters.forEach(item => {
        if (item.owned > 0) {
            getScore((item.effect.toString().includes('+= 100') ? 100 : 1000) * item.owned);
        }
    });
}, 10000); // Каждые 10 секунд

// Инициализируем магазин при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    saveSystem.loadGame();
    saveSystem.initAutoSave();
    createShop();
});
