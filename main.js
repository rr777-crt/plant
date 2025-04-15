'use strict';

const scoreText = document.getElementById("score");
const addText = document.getElementById("add");
const button = document.getElementById("button");
const sunsDiv = document.getElementById("suns");

let isLoadingReady = false;
let isButtonPressed = false;
let pressStartTime = 0;
const longPressDuration = 5000;

let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let suns = 0;
let addSuns = 0.01;
const casePrice = 1000;
let isLoadingReady = false
console.log('v', '001')

const musicList = [
  'Grasswalk.mp3',
 
]
const MUSIC = {}
let loadCount = 5
musicList.forEach((m, i) => {
   const music = new Audio()
   music.src = m
   MUSIC[m] = music
   music.oncanplaythrough = (e) => {
    e.target.oncanplaythrough = null
    loadCount++
    if (loadCount === musicList.length) isLoadingReady = true
     console.log('isLoadingReady', isLoadingReady)
   }
})


let score = 0
let addPerClick = 1
let addPerSecond = 0

let suns = 0
let addSuns = 0.01

button.onclick = getClick

function getClick() {
    getScore(addPerClick)
    getSuns(addSuns)

    checkBGImage()
    if (isLoadingReady && score>= 500) {
     isLoadingReady = false
     MUSIC['Grasswalk.mp3'].play()
    }
}

function getScore(n) {
    score += n
    scoreText.innerText = score
}

function getSuns(n) {
    suns += n
    sunsDiv.innerText = suns.toFixed(2)
}
function getClickAdd(n, price) {
    if (score < price) return

    getScore(-price)
    
    addPerClick = n
    addText.innerText = addPerClick
}


function mining(scorePerSec , price) {
    if (score < price) return

    getScore(-price)
    addPerSecond += scorePerSec

    console.log(scorePerSec , price, addPerSecond)
}
 
function getScoreForSuns(score_n, suns_n) {
    if (suns < suns_n) return

    getScore(score_n)
    getSuns(-suns_n)
}



function checkBGImage() {

   
  
    if (score > 1000) {
        button.style.backgroundImage = 'url(https://klev.club/uploads/posts/2023-11/1698878136_klev-club-p-arti-gorokhostrel-zombi-43.jpg)'
    }
    
    if (score > 10000) {
        button.style.backgroundImage = 'url(https://pvsz2.ru/statics/plants-big/31.png)'
    }
     if (score > 1000000) {
        button.style.backgroundImage = 'url(https://avatars.mds.yandex.net/i?id=69a2b4239be746c0863ff1d2bf2c2a75_l-8972142-images-thumbs&n=13)'
    }
     if (score > 100000000) {
        button.style.backgroundImage = 'url(https://i.pinimg.com/originals/8e/0f/57/8e0f5777b6643cdc67dcfce5db6c1d70.jpg)'
    }
   if (score > 1000000000) {
        button.style.backgroundImage = 'url(https://files.vgtimes.ru/download/posts/2020-04/thumbs/1587903142_gxxpmj5u6ke3vkxewf1y0g.jpg)'
    }
  if (score > 100000000000) {
        button.style.backgroundImage = 'url(https://img.razrisyika.ru/kart/14/1200/53948-gorohostrel-13.jpg)'
    }
  if (score > 1000000000000) {
        button.style.backgroundImage = 'url(https://png.klev.club/uploads/posts/2024-04/png-klev-club-f8lu-p-gorokhostrel-png-20.png)'
    }
  
}

setInterval( () => {
    getScore(addPerSecond)
    console.log('tick')
}, 1000) 

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
