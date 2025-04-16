'use script'
// ================ КОНФИГУРАЦИЯ ИГРЫ ================
const runnerConfig = {
    speed: 5,       // начальная скорость
    jumpForce: 12,  // высота прыжка
    gravity: 0.5,   // гравитация
    rewardDrops: 10,// капли за секунду
    rewardSuns: 1,  // солнца за 10 секунд
    obstacles: ['🪨', '🌵', '🧱', '🪵'] // виды препятствий
};

// ================ ПЕРЕМЕННЫЕ ИГРЫ ================
let runnerGameActive = false;
let runnerScore = 0;
let runnerVelocityY = 0;
let runnerPlayerY = 0;
let runnerSpeed = runnerConfig.speed;
let lastFrameTime = 0;
let survivalTime = 0;
let isJumping = false;

// ================ ЭЛЕМЕНТЫ ИНТЕРФЕЙСА ================
const runnerContainer = document.createElement('div');
runnerContainer.id = 'runner-game';
runnerContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, #87CEEB, #E0F7FA);
    display: none;
    z-index: 1002;
    overflow: hidden;
`;

const runnerGround = document.createElement('div');
runnerGround.style.cssText = `
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 20px;
    background: #8BC34A;
`;

const runnerPlayer = document.createElement('div');
runnerPlayer.style.cssText = `
    position: absolute;
    left: 50px;
    bottom: 20px;
    width: 30px;
    height: 50px;
    background: #FF5722;
    border-radius: 5px;
    transition: transform 0.1s;
`;

const runnerScoreDisplay = document.createElement('div');
runnerScoreDisplay.style.cssText = `
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 24px;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    font-family: Arial, sans-serif;
`;

const runnerStartButton = document.createElement('button');
runnerStartButton.textContent = 'GAME POM';
runnerStartButton.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    padding: 10px 20px;
    background: #FF5722;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    z-index: 1000;
`;

// ================ СОЗДАЕМ ИГРУ ================
// Добавляем элементы на страницу
runnerContainer.appendChild(runnerPlayer);
runnerContainer.appendChild(runnerGround);
runnerContainer.appendChild(runnerScoreDisplay);
document.body.appendChild(runnerContainer);
document.body.appendChild(runnerStartButton);

// Массив препятствий
let obstacles = [];

// Функция создания препятствия
function createObstacle() {
    const obstacle = document.createElement('div');
    const type = runnerConfig.obstacles[Math.floor(Math.random() * runnerConfig.obstacles.length)];
    
    obstacle.textContent = type;
    obstacle.style.cssText = `
        position: absolute;
        right: -50px;
        bottom: 20px;
        font-size: 30px;
        line-height: 1;
    `;
    
    runnerContainer.appendChild(obstacle);
    obstacles.push({
        element: obstacle,
        x: window.innerWidth,
        width: 40,
        height: 40,
        type: type
    });
}

// Функция прыжка
function jump() {
    if (!isJumping) {
        isJumping = true;
        runnerVelocityY = -runnerConfig.jumpForce;
        runnerPlayer.style.transform = 'scale(1.1, 0.9)';
        setTimeout(() => runnerPlayer.style.transform = '', 100);
    }
}

// Обработчик кликов (прыжок)
runnerContainer.onclick = jump;

// Основной игровой цикл
function runnerGameLoop(timestamp) {
    if (!runnerGameActive) return;
    
    // Расчет времени между кадрами
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    
    // Обновление времени выживания
    survivalTime += deltaTime / 1000;
    
    // Награда за время
    if (Math.floor(survivalTime) > runnerScore) {
        runnerScore = Math.floor(survivalTime);
        getScore(runnerConfig.rewardDrops);
        
        if (runnerScore % 10 === 0) {
            getSuns(runnerConfig.rewardSuns);
        }
    }
    
    // Обновление счета
    runnerScoreDisplay.textContent = `Выжил: ${runnerScore} сек | +${runnerConfig.rewardDrops} капель/сек | +${runnerConfig.rewardSuns} солнц/10сек`;
    
    // Физика прыжка
    runnerVelocityY += runnerConfig.gravity;
    runnerPlayerY += runnerVelocityY;
    
    // Проверка земли
    if (runnerPlayerY > 0) {
        runnerPlayerY = 0;
        runnerVelocityY = 0;
        isJumping = false;
    }
    
    // Применяем позицию игрока
    runnerPlayer.style.bottom = `${20 - runnerPlayerY}px`;
    
    // Генерация препятствий
    if (Math.random() < 0.01 * runnerSpeed) {
        createObstacle();
    }
    
    // Движение препятствий
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= runnerSpeed;
        obstacle.element.style.right = `${window.innerWidth - obstacle.x}px`;
        
        // Проверка столкновений
        if (
            obstacle.x < 50 + 30 && 
            obstacle.x + obstacle.width > 50 &&
            20 - runnerPlayerY < obstacle.height
        ) {
            endRunnerGame();
            return;
        }
        
        // Удаление за пределами экрана
        if (obstacle.x + obstacle.width < 0) {
            runnerContainer.removeChild(obstacle.element);
            obstacles.splice(index, 1);
        }
    });
    
    // Увеличение сложности
    runnerSpeed = runnerConfig.speed + Math.floor(survivalTime / 10);
    
    requestAnimationFrame(runnerGameLoop);
}

// Функция начала игры
function startRunnerGame() {
    runnerGameActive = true;
    runnerScore = 0;
    survivalTime = 0;
    runnerPlayerY = 0;
    runnerVelocityY = 0;
    runnerSpeed = runnerConfig.speed;
    obstacles = [];
    
    runnerContainer.style.display = 'block';
    runnerScoreDisplay.textContent = 'Прыгайте кликом!';
    lastFrameTime = performance.now();
    requestAnimationFrame(runnerGameLoop);
}

// Функция завершения игры
function endRunnerGame() {
    runnerGameActive = false;
    runnerContainer.style.display = 'none';
    
    // Эффект "взрыва" игрока
    const explosion = document.createElement('div');
    explosion.textContent = '💥';
    explosion.style.cssText = `
        position: absolute;
        left: 20px;
        bottom: 20px;
        font-size: 50px;
        animation: fadeOut 1s forwards;
    `;
    
    document.body.appendChild(explosion);
    setTimeout(() => explosion.remove(), 1000);
    
    showMessage(`Игра окончена! Выжил: ${runnerScore} сек. Получено: ${runnerScore * runnerConfig.rewardDrops} капель и ${Math.floor(runnerScore / 10) * runnerConfig.rewardSuns} солнц!`);
}

// Запуск игры по кнопке
runnerStartButton.onclick = startRunnerGame;

// Функция показа сообщений
function showMessage(text) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1003;
        animation: fadeOut 2s ease-out 2s forwards;
    `;
    
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 4000);
}

// Добавляем анимации
const runnerStyle = document.createElement('style');
runnerStyle.textContent = `
    @keyframes fadeOut {
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
    #runner-game {
        cursor: pointer;
    }
`;
document.head.appendChild(runnerStyle);

// ================ ИНТЕГРАЦИЯ С СОХРАНЕНИЯМИ ================
// (Добавь эти методы в твой существующий saveSystem)
saveSystem.saveRunnerGame = function() {
    const data = JSON.parse(localStorage.getItem('plantClickerSave') || '{}');
    data.runnerBestScore = Math.max(data.runnerBestScore || 0, runnerScore);
    localStorage.setItem('plantClickerSave', JSON.stringify(data));
};

saveSystem.loadRunnerGame = function() {
    const data = JSON.parse(localStorage.getItem('plantClickerSave') || '{}');
    if (data.runnerBestScore) {
        runnerStartButton.textContent = `GAME POM (рекорд: ${data.runnerBestScore}сек)`;
    }
};

// Обновляем при загрузке
document.addEventListener('DOMContentLoaded', saveSystem.loadRunnerGame);
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
