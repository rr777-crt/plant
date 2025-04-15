'use script'
let casePrice = 1000; // Цена кейса, можно изменить

// Добавьте эту функцию где-нибудь среди других функций
function buyCase() {
    if (score < casePrice) {
        alert("Недостаточно капель для покупки кейса!");
        return;
    }
    
    getScore(-casePrice); // Вычитаем стоимость кейса
    
    const random = Math.random() * 100; // Генерируем случайное число от 0 до 100
    
    if (random <= 50) { // 50% шанс
        getScore(900);
        alert("Вы получили 900 капель!");
    } else if (random <= 80) { // 30% шанс (50-80)
        getSuns(5);
        alert("Вы получили 5 солнц!");
    } else if (random <= 95) { // 15% шанс (80-95)
        getScore(1000000);
        alert("ВЫ ВЫИГРАЛИ ДЖЕКПОТ! 1,000,000 капель!");
    } else { // 5% шанс (95-100)
        getSuns(100);
        alert("МЕГАУДАЧА! 100 солнц!!!");
    }
}

const scoreText = document.getElementById("score")
const addText = document.getElementById("add")
const button = document.getElementById("button")
const sunsDiv = document.getElementById("suns")

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
let isButtonPressed = false;
let pressStartTime = 0;
const longPressDuration = 5000; 
function saveGame() {
    const gameData = {
        score: score,
        addPerClick: addPerClick,
        addPerSecond: addPerSecond,
        suns: suns,
        addSuns: addSuns,
        casePrice: casePrice // если вы используете переменную для цены кейса
    };
    localStorage.setItem('groxostrelSave', JSON.stringify(gameData));
}

function loadGame() {
    const savedData = localStorage.getItem('groxostrelSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        
        score = gameData.score || 0;
        addPerClick = gameData.addPerClick || 1;
        addPerSecond = gameData.addPerSecond || 0;
        suns = gameData.suns || 0;
        addSuns = gameData.addSuns || 0.01;
        casePrice = gameData.casePrice || 1000;
        
        // Обновляем отображение
        scoreText.innerText = score;
        addText.innerText = addPerClick;
        sunsDiv.innerText = suns.toFixed(2);
        
        console.log('Игра загружена!');
    }
}

// Модифицируем все функции, изменяющие состояние игры:
function getScore(n) {
    score += n;
    scoreText.innerText = score;
    saveGame(); // Сохраняем после изменения
}

function getSuns(n) {
    suns += n;
    sunsDiv.innerText = suns.toFixed(2);
    saveGame(); // Сохраняем после изменения
}

function getClickAdd(n, price) {
    if (score < price) return;

    getScore(-price);
    addPerClick = n;
    addText.innerText = addPerClick;
    saveGame(); // Сохраняем после изменения
}

function mining(scorePerSec, price) {
    if (score < price) return;

    getScore(-price);
    addPerSecond += scorePerSec;
    saveGame(); // Сохраняем после изменения
}

function getScoreForSuns(score_n, suns_n) {
    if (suns < suns_n) return;

    getScore(score_n);
    getSuns(-suns_n);
    saveGame(); // Сохраняем после изменения
}

function buyCase() {
    if (score < casePrice) {
        alert("Недостаточно капель для покупки кейса!");
        return;
    }
    
    getScore(-casePrice);
    saveGame(); // Сохраняем сразу после списания
    
    // ... остальной код функции buyCase ...
    // Не забудьте добавить saveGame() после каждого изменения состояния
}

// Добавляем автоматическую загрузку при старте игры
window.addEventListener('load', function() {
    loadGame();
    
    // Автосохранение каждые 30 секунд
    setInterval(saveGame, 30000);
});
