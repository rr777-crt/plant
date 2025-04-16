// ================ ОБНОВЛЁННЫЙ КОНФИГ ================
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
