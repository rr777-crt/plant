'use strict';

const scoreText = document.getElementById("score");
const addText = document.getElementById("add");
const button = document.getElementById("button");
const sunsDiv = document.getElementById("suns");
const shopContainer = document.getElementById("shopContainer");
const shopOverlay = document.getElementById("shopOverlay");
const shopContent = document.getElementById("shop-content");

let isLoadingReady = false;
console.log('v', '001');

const musicList = [
  'Grasswalk.mp3',
];
const MUSIC = {};
let loadCount = 5;

musicList.forEach((m, i) => {
   const music = new Audio();
   music.src = m;
   MUSIC[m] = music;
   music.oncanplaythrough = (e) => {
    e.target.oncanplaythrough = null;
    loadCount++;
    if (loadCount === musicList.length) isLoadingReady = true;
     console.log('isLoadingReady', isLoadingReady);
   }
});

let score = 0;
let addPerClick = 1;
let addPerSecond = 0;
let suns = 0;
let addSuns = 0.01;
let isBonusActive = false;

// Магазин предметов
const shopItems = [
    {
        name: "Улучшенный горох",
        price: 500,
        description: "Увеличивает доход за клик на 50%",
        effect: () => {
            addPerClick *= 1.5;
            addText.innerText = Math.floor(addPerClick);
            showMessage("Доход за клик увеличен!");
        }
    },
    {
        name: "Золотой цветок",
        price: 1000,
        description: "Дает +1000 капель каждые 10 секунд",
        effect: () => {
            setInterval(() => getScore(1000), 10000);
            showMessage("Теперь вы получаете пассивный доход!");
        }
    },
    {
        name: "Солнечная панель",
        price: 5000,
        description: "Увеличивает производство солнц в 2 раза",
        effect: () => {
            addSuns *= 2;
            showMessage("Производство солнц удвоено!");
        }
    },
    {
        name: "Водяной насос",
        price: 10000,
        description: "Увеличивает пассивный доход на 500/сек",
        effect: () => {
            addPerSecond += 500;
            showMessage("Пассивный доход увеличен!");
        }
    },
    {
        name: "Легендарный горох",
        price: 50000,
        description: "Увеличивает все доходы в 3 раза", 
        effect: () => {
            addPerClick *= 3;
            addPerSecond *= 3;
            addSuns *= 3;
            addText.innerText = Math.floor(addPerClick);
            showMessage("ВСЕ доходы увеличены в 3 раза!!!");
        }
    }
];

// Инициализация магазина
function initShop() {
    shopContent.innerHTML = '';
    shopItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <div class="description">${item.description}</div>
            <div class="price">Цена: ${item.price} капель</div>
            <button onclick="buyShopItem(${index})" ${score < item.price ? 'disabled' : ''}>
                Купить
            </button>
        `;
        shopContent.appendChild(itemElement);
    });
}

// Покупка предмета в магазине
function buyShopItem(index) {
    const item = shopItems[index];
    if (score < item.price) return;
    
    getScore(-item.price);
    item.effect();
    initShop(); // Обновляем магазин
}

// Показать сообщение
function showMessage(text) {
    const message = document.createElement('div');
    message.className = 'shop-message';
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Открыть/закрыть магазин
function toggleShop() {
    shopContainer.classList.toggle('active');
    shopOverlay.classList.toggle('active');
    initShop();
}

button.onclick = function() {
    if (isBonusActive) {
        getScore(addPerClick * 10);
        isBonusActive = false;
    } else {
        getScore(addPerClick);
    }
    getSuns(addSuns);
    checkBGImage();
    
    if (isLoadingReady && score >= 500) {
        isLoadingReady = false;
        MUSIC['Grasswalk.mp3'].play();
    }
};

function getScore(n) {
    score += n;
    scoreText.innerText = score;
}

function getSuns(n) {
    suns += n;
    sunsDiv.innerText = suns.toFixed(2);
}

function getClickAdd(n, price) {
    if (score < price) return;
    getScore(-price);
    addPerClick = n;
    addText.innerText = addPerClick;
}

function mining(scorePerSec, price) {
    if (score < price) return;
    getScore(-price);
    addPerSecond += scorePerSec;
}

function getScoreForSuns(score_n, suns_n) {
    if (suns < suns_n) return;
    getScore(score_n);
    getSuns(-suns_n);
}

function checkBGImage() {
    if (score > 1000) {
        button.style.backgroundImage = 'url(https://klev.club/uploads/posts/2023-11/1698878136_klev-club-p-arti-gorokhostrel-zombi-43.jpg)';
    }
    if (score > 10000) {
        button.style.backgroundImage = 'url(https://pvsz2.ru/statics/plants-big/31.png)';
    }
    if (score > 1000000) {
        button.style.backgroundImage = 'url(https://avatars.mds.yandex.net/i?id=69a2b4239be746c0863ff1d2bf2c2a75_l-8972142-images-thumbs&n=13)';
    }
    if (score > 100000000) {
        button.style.backgroundImage = 'url(https://i.pinimg.com/originals/8e/0f/57/8e0f5777b6643cdc67dcfce5db6c1d70.jpg)';
    }
    if (score > 1000000000) {
        button.style.backgroundImage = 'url(https://files.vgtimes.ru/download/posts/2020-04/thumbs/1587903142_gxxpmj5u6ke3vkxewf1y0g.jpg)';
    }
    if (score > 100000000000) {
        button.style.backgroundImage = 'url(https://img.razrisyika.ru/kart/14/1200/53948-gorohostrel-13.jpg)';
    }
    if (score > 1000000000000) {
        button.style.backgroundImage = 'url(https://png.klev.club/uploads/posts/2024-04/png-klev-club-f8lu-p-gorokhostrel-png-20.png)';
    }
}

// Функция для создания зеленого шарика
function createGreenBall() {
    if (Math.random() > 0.1) return; // 10% шанс появления
    
    const ball = document.createElement('div');
    ball.className = 'green-ball';
    
    // Случайная позиция на экране
    const x = Math.random() * (window.innerWidth - 60);
    const y = Math.random() * (window.innerHeight - 60);
    
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    
    ball.onclick = function() {
        isBonusActive = true;
        showMessage("БОНУС! Следующий клик даст x10 доход!");
        ball.remove();
        setTimeout(() => {
            isBonusActive = false;
        }, 10000); // Бонус действует 10 секунд
    };
    
    document.body.appendChild(ball);
    
    // Автоматическое исчезновение через 15 секунд
    setTimeout(() => {
        if (ball.parentNode) {
            ball.remove();
        }
    }, 15000);
}

// Периодическая проверка на появление шарика
setInterval(createGreenBall, 60000); // Проверка каждую минуту

// Пассивный доход
setInterval(() => {
    getScore(addPerSecond);
}, 1000);

// Кейсы (сохранены из оригинального кода)
let casePrice = 1;
function buyCase() {
    if (score < casePrice) {
        alert("Недостаточно капель для покупки кейса!");
        return;
    }
    
    getScore(-casePrice);
    const random = Math.random() * 100;
    
    if (random <= 50) {
        getScore(900);
        alert("Вы получили 900 капель!");
    } else if (random <= 80) {
        getSuns(5);
        alert("Вы получили 5 солнц!");
    } else if (random <= 95) {
        getScore(1000000);
        alert("ВЫ ВЫИГРАЛИ ДЖЕКПОТ! 1,000,000 капель!");
    } else {
        getSuns(100);
        alert("МЕГАУДАЧА! 100 солнц!!!");
    }
}

// Сброс игры
function resetGame() {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс?")) {
        score = 0;
        addPerClick = 1;
        addPerSecond = 0;
        suns = 0;
        addSuns = 0.01;
        
        scoreText.innerText = score;
        addText.innerText = addPerClick;
        sunsDiv.innerText = suns.toFixed(2);
        
        button.style.backgroundImage = 'url(https://pvsz2.ru/statics/plants-big/68.png)';
    }
}
