const runnerConfig = {
    speed: 5,       // начальная скорость
    jumpForce: 12,  // высота прыжка
    gravity: 0.5,   // гравитация
    rewardDrops: 10,// капли за секунду
    rewardSuns: 1,  // солнца за 10 секунд
    gameCost: 75,   // стоимость запуска игры
    obstacleSpawnRate: 0.007, // уменьшенный шанс спавна препятствий
    obstacles: ['🪨', '🌵', '🧱', '🪵'], // виды препятствий
    buffs: {
        invincible: {
            chance: 0.05, // 5% шанс спавна
            duration: 2000, // 2 секунды
            icon: '🛡️'
        }
    }
};
function startRunnerGame() {
    if (score < runnerConfig.gameCost) {
        showMessage(`Нужно ${runnerConfig.gameCost} капель для запуска!`);
        return;
    }
    
    getScore(-runnerConfig.gameCost); // Снимаем стоимость игры
    
    runnerGameActive = true;
    runnerScore = 0;
    survivalTime = 0;
    runnerPlayerY = 0;
    runnerVelocityY = 0;
    runnerSpeed = runnerConfig.speed;
    obstacles = [];
    activeBuffs = [];
    
    runnerContainer.style.display = 'block';
    runnerScoreDisplay.textContent = `Игра началась! (-${runnerConfig.gameCost} капель)`;
    lastFrameTime = performance.now();
    requestAnimationFrame(runnerGameLoop);
}
let obstacles = [];
let activeBuffs = []; // Активные баффы
let isInvincible = false; // Флаг неуязвимости
function createObstacle() {
    // Спавн баффа вместо препятствия с небольшим шансом
    if (Math.random() < runnerConfig.buffs.invincible.chance) {
        createBuff('invincible');
        return;
    }
    
    // Обычный спавн препятствия (с уменьшенной частотой)
    if (Math.random() < runnerConfig.obstacleSpawnRate * runnerSpeed) {
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
}

// Функция создания баффа
function createBuff(type) {
    const buff = document.createElement('div');
    buff.textContent = runnerConfig.buffs[type].icon;
    buff.style.cssText = `
        position: absolute;
        right: -50px;
        bottom: ${50 + Math.random() * 100}px;
        font-size: 30px;
        line-height: 1;
        animation: float 3s infinite;
    `;
    
    runnerContainer.appendChild(buff);
    obstacles.push({
        element: buff,
        x: window.innerWidth,
        width: 30,
        height: 30,
        isBuff: true,
        buffType: type
    });
}
// Активация баффа
function activateBuff(type) {
    showMessage(`Активирован бафф: ${type === 'invincible' ? 'Неуязвимость на 2 секунды!' : ''}`);
    
    if (type === 'invincible') {
        isInvincible = true;
        
        // Визуальный эффект неуязвимости
        runnerPlayer.style.boxShadow = '0 0 15px gold';
        runnerPlayer.style.animation = 'glow 0.5s infinite alternate';
        
        // Добавляем в активные баффы для отслеживания времени
        activeBuffs.push({
            type: type,
            endTime: performance.now() + runnerConfig.buffs[type].duration
        });
    }
}

// Проверка активных баффов (добавьте в gameLoop перед requestAnimationFrame)
function checkBuffs() {
    const now = performance.now();
    activeBuffs = activeBuffs.filter(buff => {
        if (now >= buff.endTime) {
            // Завершаем действие баффа
            if (buff.type === 'invincible') {
                isInvincible = false;
                runnerPlayer.style.boxShadow = '';
                runnerPlayer.style.animation = '';
                showMessage('Неуязвимость закончилась!');
            }
            return false;
        }
        return true;
    });
}
function endRunnerGame() {
    runnerGameActive = false;
    isInvincible = false; // Сбрасываем неуязвимость
    activeBuffs = []; // Очищаем баффы
    
    // Сбрасываем визуальные эффекты
    runnerPlayer.style.boxShadow = '';
    runnerPlayer.style.animation = '';
    
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
    
    const dropsEarned = runnerScore * runnerConfig.rewardDrops;
    const sunsEarned = Math.floor(runnerScore / 10) * runnerConfig.rewardSuns;
    
    getScore(dropsEarned);
    getSuns(sunsEarned);
    
    showMessage(`Игра окончена! Выжил: ${runnerScore} сек. Получено: ${dropsEarned} капель и ${sunsEarned} солнц!`);
    saveSystem.saveRunnerGame();
}
