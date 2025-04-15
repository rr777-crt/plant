'use strict';


let isLoadingReady = false;
let isButtonPressed = false;
let pressStartTime = 0;
const longPressDuration = 5000;


// Функция сохранения игры
function saveGame() {
    const gameData = {
        score: score,
        addPerClick: addPerClick,
        addPerSecond: addPerSecond,
        suns: suns,
        addSuns: addSuns
    };
    localStorage.setItem('groxostrelSave', JSON.stringify(gameData));
}

// Функция загрузки игры
function loadGame() {
    const savedData = localStorage.getItem('groxostrelSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        
        score = gameData.score || 0;
        addPerClick = gameData.addPerClick || 1;
        addPerSecond = gameData.addPerSecond || 0;
        suns = gameData.suns || 0;
        addSuns = gameData.addSuns || 0.01;
        
        updateUI();
    }
}

function updateUI() {
    scoreText.innerText = score;
    addText.innerText = addPerClick;
    sunsDiv.innerText = suns.toFixed(2);
}

// Функция кейса (исправленная)
function buyCase() {
    if (score < casePrice) {
        alert("Недостаточно капель для покупки кейса!");
        return;
    }
    
    score -= casePrice;
    updateUI();
    
    const random = Math.random() * 100;
    let rewardMessage = "";
    
    if (random <= 50) {
        score += 900;
        rewardMessage = "Вы получили 900 капель!";
    } else if (random <= 80) {
        suns += 5;
        rewardMessage = "Вы получили 5 солнц!";
    } else if (random <= 95) {
        score += 1000000;
        rewardMessage = "ДЖЕКПОТ! 1,000,000 капель!";
    } else {
        suns += 100;
        rewardMessage = "МЕГАУДАЧА! 100 солнц!!!";
    }
    
    updateUI();
    saveGame();
    alert(rewardMessage);
}

// Остальные функции (getScore, getSuns и т.д.) оставляем как были,
// но добавляем saveGame() в конце каждой

button.onmousedown = function() {
    isButtonPressed = true;
    pressStartTime = Date.now();
    
    let longPressCheck = setInterval(() => {
        if (!isButtonPressed) {
            clearInterval(longPressCheck);
            return;
        }
        
        if (Date.now() - pressStartTime >= longPressDuration) {
            clearInterval(longPressCheck);
            score += 10;
            updateUI();
            saveGame();
            
            button.style.border = "12px solid gold";
            button.style.boxShadow = "0 12px 12px gold";
            
            setTimeout(() => {
                button.style.border = "12px solid rgb(170, 233, 0)";
                button.style.boxShadow = "0 12px 12px black";
            }, 1000);
        }
    }, 100);
};

button.onmouseup = function() {
    isButtonPressed = false;
};

// Загружаем игру при старте
window.addEventListener('load', loadGame);
setInterval(saveGame, 30000);
