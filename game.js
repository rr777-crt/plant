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
const runnerConfig = {
    speed: 5,
    jumpForce: 12,
    gravity: 0.5,
    rewardDrops: 10,
    rewardSuns: 1,
    obstacles: ['🪨', '🌵', '🧱', '🪵'],
    spawnRate: 0.005, // Было 0.01 (в 2 раза реже)
    maxPlaysPerHour: 3,
    speedBoost: {
        duration: 3000, // 3 сек ускорения
        multiplier: 1.5, // x1.5 скорости
        chance: 0.2 // 20% шанс появления
    }
};

// ================ НОВЫЕ ПЕРЕМЕННЫЕ ================
let playsCount = 0;
let lastPlayTime = 0;
let isSpeedBoostActive = false;
let speedBoostEndTime = 0;

// ================ ОБНОВЛЁННЫЙ СПАВН ПРЕПЯТСТВИЙ ================
function trySpawnObstacle() {
    // Уменьшенный шанс спавна (spawnRate)
    if (Math.random() < runnerConfig.spawnRate * (1 + survivalTime / 100)) {
        createObstacle();
        
        // С шансом 20% создаём буст скорости вместо препятствия
        if (Math.random() < runnerConfig.speedBoost.chance) {
            createSpeedBoost();
        }
    }
}

// ================ БУСТ СКОРОСТИ ================
function createSpeedBoost() {
    const boost = document.createElement('div');
    boost.textContent = '⚡';
    boost.style.cssText = `
        position: absolute;
        right: -30px;
        bottom: 50px;
        font-size: 25px;
        z-index: 2;
        animation: float 2s infinite;
    `;
    
    const xPos = window.innerWidth + 50;
    const boostObj = {
        element: boost,
        x: xPos,
        width: 30,
        height: 30
    };
    
    runnerContainer.appendChild(boost);
    obstacles.push(boostObj);
    
    // Проверка сбора буста
    const checkBoost = setInterval(() => {
        if (!runnerGameActive) {
            clearInterval(checkBoost);
            return;
        }
        
        boostObj.x -= runnerSpeed;
        boost.style.right = `${window.innerWidth - boostObj.x}px`;
        
        // Коллизия с игроком
        if (
            boostObj.x < 80 && 
            boostObj.x > 30 &&
            runnerPlayerY < 30
        ) {
            activateSpeedBoost();
            runnerContainer.removeChild(boost);
            clearInterval(checkBoost);
        }
        
        if (boostObj.x < -30) {
            runnerContainer.removeChild(boost);
            clearInterval(checkBoost);
        }
    }, 16);
}

function activateSpeedBoost() {
    isSpeedBoostActive = true;
    speedBoostEndTime = Date.now() + runnerConfig.speedBoost.duration;
    
    // Эффект
    runnerPlayer.style.boxShadow = '0 0 15px yellow';
    const particles = setInterval(() => {
        if (!isSpeedBoostActive) {
            clearInterval(particles);
            return;
        }
        createParticle();
    }, 200);
    
    setTimeout(() => {
        isSpeedBoostActive = false;
        runnerPlayer.style.boxShadow = '';
    }, runnerConfig.speedBoost.duration);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.textContent = '✨';
    particle.style.cssText = `
        position: absolute;
        left: 40px;
        bottom: ${20 - runnerPlayerY}px;
        font-size: 16px;
        animation: particleFade 1s forwards;
    `;
    
    runnerContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
}

// ================ ЛИМИТ ИГР ================
function canPlayGame() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    // Если прошёл час - сбрасываем счётчик
    if (lastPlayTime < oneHourAgo) {
        playsCount = 0;
        lastPlayTime = now;
        return true;
    }
    
    return playsCount < runnerConfig.maxPlaysPerHour;
}

function startRunnerGame() {
    if (!canPlayGame()) {
        const nextPlayTime = new Date(lastPlayTime + 3600000).toLocaleTimeString();
        showMessage(`Лимит игр! Следующая игра в ${nextPlayTime}`, 'red');
        return;
    }
    
    playsCount++;
    lastPlayTime = Date.now();
    updatePlayButton();
    
    // ... остальной код старта игры ...
}

function updatePlayButton() {
    const playsLeft = runnerConfig.maxPlaysPerHour - playsCount;
    runnerStartButton.textContent = `GAME POM (${playsLeft}/3)`;
    runnerStartButton.style.background = playsLeft > 0 ? '#FF5722' : '#999';
}

// ================ ОБНОВЛЁННЫЙ ГЕЙМЛУП ================
function runnerGameLoop(timestamp) {
    if (!runnerGameActive) return;
    
    // Применяем буст скорости если активен
    const currentSpeed = isSpeedBoostActive ? 
        runnerSpeed * runnerConfig.speedBoost.multiplier : 
        runnerSpeed;
    
    // ... остальной код ...
    
    // Обновляем спавн с новым параметром spawnRate
    trySpawnObstacle();
    
    // ... остальное ...
}

// ================ ДОБАВЛЯЕМ СТИЛИ ================
const boostStyles = document.createElement('style');
boostStyles.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    @keyframes particleFade {
        0% { opacity: 1; transform: translate(0, 0); }
        100% { opacity: 0; transform: translate(-20px, -30px); }
    }
`;
document.head.appendChild(boostStyles);

// ================ ИНТЕГРАЦИЯ С СОХРАНЕНИЯМИ ================
saveSystem.saveRunnerGame = function() {
    const data = JSON.parse(localStorage.getItem('plantClickerSave') || '{}');
    data.runnerStats = {
        bestScore: Math.max(data.runnerStats?.bestScore || 0, runnerScore),
        lastPlayTime: lastPlayTime,
        playsCount: playsCount
    };
    localStorage.setItem('plantClickerSave', JSON.stringify(data));
};

saveSystem.loadRunnerGame = function() {
    const data = JSON.parse(localStorage.getItem('plantClickerSave') || '{}');
    if (data.runnerStats) {
        lastPlayTime = data.runnerStats.lastPlayTime || 0;
        playsCount = data.runnerStats.playsCount || 0;
        updatePlayButton();
    }
};
