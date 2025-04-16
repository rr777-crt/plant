'use strict';

// Save System
const saveSystem = {
    // Функция для сохранения данных
    saveGame: function() {
        const gameData = {
            score: score,
            addPerClick: addPerClick,
            addPerSecond: addPerSecond,
            suns: suns,
            addSuns: addSuns,
            casePrice: casePrice,
            casePriceo: casePriceo
        };
        
        localStorage.setItem('plantClickerSave', JSON.stringify(gameData));
        console.log('Игра сохранена');
    },
    
    // Функция для загрузки данных
    loadGame: function() {
        const savedData = localStorage.getItem('plantClickerSave');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            
            // Восстанавливаем значения
            score = gameData.score || 0;
            addPerClick = gameData.addPerClick || 1;
            addPerSecond = gameData.addPerSecond || 0;
            suns = gameData.suns || 0;
            addSuns = gameData.addSuns || 0.01;
            casePrice = gameData.casePrice || 1;
            casePriceo = gameData.casePriceo || 2;
            
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
    
    // Функция для удаления сохранения
    deleteSave: function() {
        localStorage.removeItem('plantClickerSave');
        console.log('Сохранение удалено');
    },
    
    // Автосохранение каждые 30 секунд
    initAutoSave: function() {
        setInterval(() => {
            this.saveGame();
        }, 30000); // 30 секунд
        
        // Также сохраняем при закрытии вкладки/окна
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
    }
};

// Инициализация системы сохранений
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем сохранение при запуске
    saveSystem.loadGame();
    
    // Включаем автосохранение
    saveSystem.initAutoSave();
    
    // Добавляем кнопки для ручного сохранения/загрузки (опционально)
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Сохранить';
    saveButton.onclick = saveSystem.saveGame.bind(saveSystem);
    
    const loadButton = document.createElement('button');
    loadButton.textContent = 'Загрузить';
    loadButton.onclick = saveSystem.loadGame.bind(saveSystem);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить сохранение';
    deleteButton.onclick = saveSystem.deleteSave.bind(saveSystem);
    
    document.body.appendChild(saveButton);
    document.body.appendChild(loadButton);
    document.body.appendChild(deleteButton);
});
