// Добавляем переменные для мини-игры
let miniGameActive = false;
let miniGameAttempts = 0;
let lastMiniGameTime = 0;
const MAX_ATTEMPTS = 5;
const COOLDOWN = 10 * 60 * 1000; // 10 минут в миллисекундах
const MINI_GAME_REWARD = 100;

// Создаем элементы для мини-игры
const miniGameContainer = document.createElement('div');
miniGameContainer.id = 'mini-game';
miniGameContainer.style.display = 'none';
miniGameContainer.style.position = 'fixed';
miniGameContainer.style.top = '50%';
miniGameContainer.style.left = '50%';
miniGameContainer.style.transform = 'translate(-50%, -50%)';
miniGameContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
miniGameContainer.style.padding = '20px';
miniGameContainer.style.borderRadius = '10px';
miniGameContainer.style.zIndex = '1001';
miniGameContainer.style.textAlign = 'center';
miniGameContainer.style.color = 'white';

const miniGameText = document.createElement('p');
miniGameText.textContent = 'Нажмите кнопку в нужный момент!';
miniGameText.style.fontSize = '20px';

const miniGameButton = document.createElement('button');
miniGameButton.textContent = 'НАЖМИ!';
miniGameButton.style.padding = '15px 30px';
miniGameButton.style.fontSize = '18px';
miniGameButton.style.backgroundColor = '#4CAF50';
miniGameButton.style.color = 'white';
miniGameButton.style.border = 'none';
miniGameButton.style.borderRadius = '5px';
miniGameButton.style.cursor = 'pointer';
miniGameButton.style.margin = '10px';

const miniGameClose = document.createElement('button');
miniGameClose.textContent = 'Закрыть';
miniGameClose.style.padding = '5px 10px';
miniGameClose.style.marginTop = '10px';

miniGameContainer.appendChild(miniGameText);
miniGameContainer.appendChild(miniGameButton);
miniGameContainer.appendChild(miniGameClose);
document.body.appendChild(miniGameContainer);

// Функция для запуска мини-игры
function startMiniGame() {
    const now = Date.now();
    const cooldownRemaining = (lastMiniGameTime + COOLDOWN - now) / 1000;
    
    if (miniGameAttempts >= MAX_ATTEMPTS && cooldownRemaining > 0) {
        alert(`Вы исчерпали все попытки! Попробуйте снова через ${Math.ceil(cooldownRemaining / 60)} минут.`);
        return;
    }
    
    if (cooldownRemaining > 0 && miniGameAttempts >= MAX_ATTEMPTS) {
        alert(`Подождите еще ${Math.ceil(cooldownRemaining / 60)} минут перед новой серией попыток.`);
        return;
    }
    
    // Сброс попыток если прошел кулдаун
    if (now - lastMiniGameTime > COOLDOWN) {
        miniGameAttempts = 0;
    }
    
    miniGameActive = true;
    miniGameContainer.style.display = 'block';
    
    // Случайный таймер для "удачного момента" (от 1 до 3 секунд)
    const targetTime = 1000 + Math.random() * 2000;
    let buttonActive = false;
    
    miniGameButton.style.backgroundColor = '#f44336';
    miniGameButton.textContent = 'ЖДИ...';
    miniGameButton.disabled = true;
    
    setTimeout(() => {
        buttonActive = true;
        miniGameButton.style.backgroundColor = '#4CAF50';
        miniGameButton.textContent = 'НАЖМИ СЕЙЧАС!';
        miniGameButton.disabled = false;
        
        // Окно возможности (0.5 секунды)
        setTimeout(() => {
            if (miniGameActive) {
                buttonActive = false;
                miniGameButton.style.backgroundColor = '#f44336';
                miniGameButton.textContent = 'СЛИШКОМ МЕДЛЕННО!';
                setTimeout(() => {
                    if (miniGameActive) {
                        miniGameText.textContent = 'Попробуйте еще раз!';
                        miniGameButton.textContent = 'ПОПРОБОВАТЬ СНОВА';
                    }
                }, 1000);
            }
        }, 500);
    }, targetTime);
    
    // Обработчик нажатия на кнопку
    miniGameButton.onclick = function() {
        if (!buttonActive) {
            miniGameText.textContent = 'Слишком рано! Попробуйте еще.';
            miniGameButton.textContent = 'ПОПРОБОВАТЬ СНОВА';
            return;
        }
        
        // Успешное нажатие
        miniGameActive = false;
        miniGameAttempts++;
        lastMiniGameTime = now;
        
        getScore(MINI_GAME_REWARD);
        miniGameText.textContent = `УСПЕХ! +${MINI_GAME_REWARD} капель`;
        miniGameButton.textContent = 'УРА!';
        miniGameButton.style.backgroundColor = '#FFD700';
        
        setTimeout(() => {
            miniGameContainer.style.display = 'none';
            updateMiniGameButton();
        }, 2000);
        
        saveSystem.saveGame();
    };
    
    // Кнопка закрытия
    miniGameClose.onclick = function() {
        miniGameActive = false;
        miniGameContainer.style.display = 'none';
    };
}

// Кнопка GO в основном интерфейсе
const goButton = document.createElement('button');
goButton.id = 'go-button';
goButton.textContent = 'GO';
goButton.style.position = 'fixed';
goButton.style.bottom = '20px';
goButton.style.right = '20px';
goButton.style.padding = '10px 20px';
goButton.style.fontSize = '16px';
goButton.style.backgroundColor = '#FF5722';
goButton.style.color = 'white';
goButton.style.border = 'none';
goButton.style.borderRadius = '5px';
goButton.style.cursor = 'pointer';
goButton.style.zIndex = '1000';

document.body.appendChild(goButton);

// Обновление состояния кнопки GO
function updateMiniGameButton() {
    const now = Date.now();
    const cooldownRemaining = (lastMiniGameTime + COOLDOWN - now) / 1000;
    
    if (miniGameAttempts >= MAX_ATTEMPTS && cooldownRemaining > 0) {
        const minutes = Math.ceil(cooldownRemaining / 60);
        goButton.textContent = `Ждать ${minutes}м`;
        goButton.disabled = true;
        goButton.style.backgroundColor = '#9E9E9E';
        
        // Обновляем таймер каждую минуту
        setTimeout(updateMiniGameButton, 60000);
    } else {
        const attemptsLeft = MAX_ATTEMPTS - miniGameAttempts;
        goButton.textContent = `GO (${attemptsLeft} попыток)`;
        goButton.disabled = false;
        goButton.style.backgroundColor = '#FF5722';
    }
}

goButton.onclick = startMiniGame;

// Модифицируем систему сохранений
const originalSaveGame = saveSystem.saveGame;
saveSystem.saveGame = function() {
    const data = {
        ...JSON.parse(localStorage.getItem('plantClickerSave') || '{}'),
        miniGame: {
            attempts: miniGameAttempts,
            lastTime: lastMiniGameTime
        }
    };
    localStorage.setItem('plantClickerSave', JSON.stringify(data));
    originalSaveGame();
};

const originalLoadGame = saveSystem.loadGame;
saveSystem.loadGame = function() {
    originalLoadGame();
    const data = JSON.parse(localStorage.getItem('plantClickerSave') || '{}');
    if (data.miniGame) {
        miniGameAttempts = data.miniGame.attempts || 0;
        lastMiniGameTime = data.miniGame.lastTime || 0;
    }
    updateMiniGameButton();
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    saveSystem.loadGame();
    updateMiniGameButton();
});
