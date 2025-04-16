'use script'
// ================ ДОБАВЛЯЕМ МАГАЗИН УЛУЧШЕНИЙ ================
const runnerUpgrades = {
    speedBoost: {
        name: "⚡ Ускорение +5",
        description: "Постоянно увеличивает базовую скорость в раннер-игре",
        price: 1000,
        bought: false,
        apply: function() {
            runnerConfig.speed += 5;
        }
    },
    jumpBoost: {
        name: "🦘 Высота прыжка +3",
        description: "Увеличивает силу прыжка",
        price: 800,
        bought: false,
        apply: function() {
            runnerConfig.jumpForce += 3;
        }
    }
};

// ================ СОЗДАЕМ ИНТЕРФЕЙС МАГАЗИНА ================
function createRunnerShop() {
    const shopModal = document.createElement('div');
    shopModal.id = 'runner-shop';
    shopModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        padding: 20px;
        border-radius: 10px;
        color: white;
        z-index: 1004;
        display: none;
        max-width: 80%;
        width: 300px;
    `;

    const shopTitle = document.createElement('h2');
    shopTitle.textContent = '🏪 Магазин улучшений';
    shopTitle.style.textAlign = 'center';
    shopModal.appendChild(shopTitle);

    // Кнопка закрытия
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрыть';
    closeBtn.onclick = () => shopModal.style.display = 'none';
    closeBtn.style.cssText = `
        display: block;
        margin: 15px auto 0;
        padding: 8px 15px;
        background: #FF5722;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;

    // Добавляем элементы улучшений
    for (const [key, upgrade] of Object.entries(runnerUpgrades)) {
        const item = document.createElement('div');
        item.className = 'shop-item';
        item.style.margin = '10px 0';
        item.style.padding = '10px';
        item.style.border = '1px solid #444';
        item.style.borderRadius = '5px';

        const itemName = document.createElement('h3');
        itemName.textContent = upgrade.name;
        itemName.style.margin = '0 0 5px 0';
        itemName.style.color = '#FFD700';

        const itemDesc = document.createElement('p');
        itemDesc.textContent = upgrade.description;
        itemDesc.style.margin = '0 0 5px 0';
        itemDesc.style.fontSize = '14px';
        itemDesc.style.color = '#aaa';

        const itemPrice = document.createElement('p');
        itemPrice.textContent = `Цена: ${upgrade.price} капель`;
        itemPrice.style.margin = '0 0 5px 0';
        itemPrice.style.color = '#88f';

        const buyBtn = document.createElement('button');
        buyBtn.textContent = upgrade.bought ? 'Куплено' : 'Купить';
        buyBtn.disabled = upgrade.bought;
        buyBtn.style.cssText = `
            padding: 5px 10px;
            background: ${upgrade.bought ? '#555' : '#4CAF50'};
            color: white;
            border: none;
            border-radius: 3px;
            cursor: ${upgrade.bought ? 'default' : 'pointer'};
            width: 100%;
        `;

        if (!upgrade.bought) {
            buyBtn.onclick = function() {
                if (score >= upgrade.price) {
                    getScore(-upgrade.price);
                    upgrade.bought = true;
                    upgrade.apply();
                    buyBtn.textContent = 'Куплено';
                    buyBtn.disabled = true;
                    buyBtn.style.background = '#555';
                    saveSystem.saveGame();
                    showMessage(`Улучшение "${upgrade.name}" активировано!`);
                } else {
                    showMessage('Недостаточно капель!', 'red');
                }
            };
        }

        item.appendChild(itemName);
        item.appendChild(itemDesc);
        item.appendChild(itemPrice);
        item.appendChild(buyBtn);
        shopModal.appendChild(item);
    }

    shopModal.appendChild(closeBtn);
    document.body.appendChild(shopModal);
    return shopModal;
}

// ================ КНОПКА ДОСТУПА К МАГАЗИНУ ================
const runnerShopBtn = document.createElement('button');
runnerShopBtn.textContent = 'Улучшения';
runnerShopBtn.style.cssText = `
    position: fixed;
    bottom: 130px;
    right: 20px;
    padding: 10px 15px;
    background: linear-gradient(135deg, #673AB7, #9C27B0);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

// ================ ОБНОВЛЕННАЯ СИСТЕМА СОХРАНЕНИЙ ================
saveSystem.saveGame = function() {
    const data = {
        // ... (существующие данные) ...
        runnerUpgrades: {
            speedBoost: runnerUpgrades.speedBoost.bought,
            jumpBoost: runnerUpgrades.jumpBoost.bought
        },
        runnerStats: {
            speed: runnerConfig.speed,
            jumpForce: runnerConfig.jumpForce
        }
    };
    localStorage.setItem('plantClickerSave', JSON.stringify(data));
};

saveSystem.loadGame = function() {
    const data = JSON.parse(localStorage.getItem('plantClickerSave') || '{}');
    if (data.runnerUpgrades) {
        runnerUpgrades.speedBoost.bought = data.runnerUpgrades.speedBoost || false;
        runnerUpgrades.jumpBoost.bought = data.runnerUpgrades.jumpBoost || false;
        
        if (runnerUpgrades.speedBoost.bought) {
            runnerConfig.speed = data.runnerStats?.speed || runnerConfig.speed;
        }
        if (runnerUpgrades.jumpBoost.bought) {
            runnerConfig.jumpForce = data.runnerStats?.jumpForce || runnerConfig.jumpForce;
        }
    }
};

// ================ ИНИЦИАЛИЗАЦИЯ ================
document.addEventListener('DOMContentLoaded', function() {
    // Создаем магазин
    const runnerShop = createRunnerShop();
    
    // Вешаем обработчик на кнопку магазина
    runnerShopBtn.onclick = function() {
        runnerShop.style.display = 'block';
    };
    
    // Добавляем кнопку магазина
    document.body.appendChild(runnerShopBtn);
    
    // Загружаем сохранения
    saveSystem.loadGame();
});
