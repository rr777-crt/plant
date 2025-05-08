'use strict';

// Функция сохранения игры
function saveGame() {
    const gameData = {
        score: score,
        addPerClick: addPerClick,
        addPerSecond: addPerSecond,
        suns: suns,
        addSuns: addSuns,
        backgroundImage: button.style.backgroundImage || 'url(https://pvsz2.ru/statics/plants-big/68.png)'
    };
    
    localStorage.setItem('grohostrelSave', JSON.stringify(gameData));
    console.log('Игра сохранена');
}

// Функция загрузки игры
function loadGame() {
    const savedData = localStorage.getItem('grohostrelSave');
    if (!savedData) return false;
    
    try {
        const gameData = JSON.parse(savedData);
        
        score = gameData.score || 0;
        addPerClick = gameData.addPerClick || 1;
        addPerSecond = gameData.addPerSecond || 0;
        suns = gameData.suns || 0;
        addSuns = gameData.addSuns || 0.01;
        
        // Обновляем отображение
        scoreText.innerText = score;
        addText.innerText = addPerClick;
        sunsDiv.innerText = suns.toFixed(2);
        
        // Восстанавливаем фоновое изображение
        if (gameData.backgroundImage) {
            button.style.backgroundImage = gameData.backgroundImage;
        }
        
        console.log('Игра загружена');
        return true;
    } catch (e) {
        console.error('Ошибка загрузки сохранения:', e);
        return false;
    }
}

// Автосохранение каждые 10 секунд
setInterval(saveGame, 10000);

// Загрузка при старте игры
window.addEventListener('load', function() {
    if (loadGame()) {
        showMessage("Прогресс успешно загружен!");
    }
});

// Сохранение при закрытии страницы
window.addEventListener('beforeunload', function() {
    saveGame();
});

// Функция для полного сброса сохранения
function resetSave() {
    localStorage.removeItem('grohostrelSave');
    console.log('Сохранение сброшено');
}

// Интеграция с существующей функцией сброса
function resetGame() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс? Это удалит и сохранение.")) {
        score = 0;
        addPerClick = 1;
        addPerSecond = 0;
        suns = 0;
        addSuns = 0.01;
        
        scoreText.innerText = score;
        addText.innerText = addPerClick;
        sunsDiv.innerText = suns.toFixed(2);
        
        button.style.backgroundImage = 'url(https://pvsz2.ru/statics/plants-big/68.png)';
        
        // Сбрасываем сохранение
        resetSave();
        
        showMessage("Прогресс полностью сброшен!");
    }
}

// Вспомогательная функция для показа сообщений (если ещё не определена)
function showMessage(text) {
    if (typeof window.showMessage === 'undefined') {
        const message = document.createElement('div');
        message.className = 'shop-message';
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    } else {
        window.showMessage(text);
    }
}
