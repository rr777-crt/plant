'use strict';
const runnerUpgrades = {
    speedBoost: {
        name: "⚡ Скорость +2",
        price: 500,
        description: "Увеличивает базовую скорость в мини-игре",
        bought: false,
        apply: function() {
            runnerConfig.speed += 2;
        }
    },
    jumpBoost: {
        name: "🦘 Прыжок +3",
        price: 700,
        description: "Увеличивает высоту прыжка",
        bought: false,
        apply: function() {
            runnerConfig.jumpForce += 3;
        }
    },
    invincibility: {
        name: "🛡️ Чаще баффы",
        price: 1200,
        description: "Увеличивает шанс появления баффа неуязвимости",
        bought: false,
        apply: function() {
            runnerConfig.buffs.invincible.chance *= 2;
        }
    },
    cheaperGame: {
        name: "💸 Скидка 50%",
        price: 1500,
        description: "Уменьшает стоимость запуска игры",
        bought: false,
        apply: function() {
            runnerConfig.gameCost = Math.floor(runnerConfig.gameCost / 2);
        }
    }
};

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
// ================ МАГАЗИН УЛУЧШЕНИЙ ================
function createUpgradeShop() {
    const shop = document.createElement('div');
    shop.id = 'runner-upgrade-shop';
    shop.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        padding: 20px;
        border-radius: 10px;
        color: white;
        z-index: 1005;
        display: none;
        width: 80%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
    `;

    const title = document.createElement('h2');
    title.textContent = '🏪 Улучшения мини-игры';
    title.style.textAlign = 'center';
    shop.appendChild(title);

    // Кнопка закрытия
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрыть';
    closeBtn.onclick = () => shop.style.display = 'none';
    closeBtn.style.cssText = `
        display: block;
        margin: 20px auto 0;
        padding: 10px 20px;
        background: #FF5722;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;

    // Добавляем улучшения
    Object.values(runnerUpgrades).forEach(upgrade => {
        const item = document.createElement('div');
        item.style.margin = '15px 0';
        item.style.padding = '15px';
        item.style.border = '1px solid #444';
        item.style.borderRadius = '5px';

        const name = document.createElement('h3');
        name.textContent = upgrade.name;
        name.style.margin = '0 0 10px 0';
        name.style.color = upgrade.bought ? '#aaa' : '#FFD700';

        const desc = document.createElement('p');
        desc.textContent = upgrade.description;
        desc.style.margin = '0 0 10px 0';
        desc.style.color = '#ccc';

        const price = document.createElement('p');
        price.textContent = `Цена: ${upgrade.price} капель`;
        price.style.margin = '0 0 10px 0';
        price.style.color = upgrade.bought ? '#aaa' : '#88f';

        const btn = document.createElement('button');
        btn.textContent = upgrade.bought ? 'Куплено ✓' : 'Купить';
        btn.disabled = upgrade.bought;
        btn.style.cssText = `
            padding: 8px 15px;
            width: 100%;
            background: ${upgrade.bought ? '#333' : '#4CAF50'};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: ${upgrade.bought ? 'default' : 'pointer'};
        `;

        if (!upgrade.bought) {
            btn.onclick = () => {
                if (score >= upgrade.price) {
                    getScore(-upgrade.price);
                    upgrade.bought = true;
                    upgrade.apply();
                    btn.textContent = 'Куплено ✓';
                    btn.disabled = true;
                    btn.style.background = '#333';
                    name.style.color = '#aaa';
                    price.style.color = '#aaa';
                    saveGame();
                    showMessage(`Улучшение "${upgrade.name}" куплено!`);
                } else {
                    showMessage('Недостаточно капель!');
                }
            };
        }

        item.appendChild(name);
        item.appendChild(desc);
        item.appendChild(price);
        item.appendChild(btn);
        shop.appendChild(item);
    });

    shop.appendChild(closeBtn);
    document.body.appendChild(shop);
    return shop;
}

// Создаем магазин при загрузке
let upgradeShop = null;
document.addEventListener('DOMContentLoaded', () => {
    upgradeShop = createUpgradeShop();
    loadUpgrades();
});

// Кнопка для открытия магазина
const upgradeShopBtn = document.createElement('button');
upgradeShopBtn.textContent = 'Улучшения мини-игры';
upgradeShopBtn.style.cssText = `
    position: fixed;
    bottom: 130px;
    right: 20px;
    padding: 10px 15px;
    background: linear-gradient(135deg, #673AB7, #9C27B0);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;
upgradeShopBtn.onclick = () => upgradeShop.style.display = 'block';
document.body.appendChild(upgradeShopBtn);

// ================ СОХРАНЕНИЕ УЛУЧШЕНИЙ ================
function saveUpgrades() {
    const upgradesData = {};
    Object.keys(runnerUpgrades).forEach(key => {
        upgradesData[key] = runnerUpgrades[key].bought;
    });
    localStorage.setItem('runnerUpgrades', JSON.stringify(upgradesData));
}

function loadUpgrades() {
    const saved = localStorage.getItem('runnerUpgrades');
    if (saved) {
        const upgradesData = JSON.parse(saved);
        Object.keys(upgradesData).forEach(key => {
            if (runnerUpgrades[key] && upgradesData[key]) {
                runnerUpgrades[key].bought = true;
                runnerUpgrades[key].apply();
            }
        });
    }
}

// Обновите функцию saveGame():
function saveGame() {
    const gameData = {
        score: score,
        addPerClick: addPerClick,
        addPerSecond: addPerSecond,
        suns: suns,
        addSuns: addSuns,
        backgroundImage: button.style.backgroundImage,
        upgrades: {}
    };
    
    Object.keys(runnerUpgrades).forEach(key => {
        gameData.upgrades[key] = runnerUpgrades[key].bought;
    });
    
    localStorage.setItem('grohostrelSave', JSON.stringify(gameData));
}

// Обновите функцию loadGame():
function loadGame() {
    const savedData = localStorage.getItem('grohostrelSave');
    if (!savedData) return false;
    
    try {
        const gameData = JSON.parse(savedData);
        // ... существующий код загрузки ...
        
        // Загружаем улучшения
        if (gameData.upgrades) {
            Object.keys(gameData.upgrades).forEach(key => {
                if (runnerUpgrades[key]) {
                    runnerUpgrades[key].bought = gameData.upgrades[key];
                    if (runnerUpgrades[key].bought) {
                        runnerUpgrades[key].apply();
                    }
                }
            });
        }
        
        return true;
    } catch (e) {
        console.error('Ошибка загрузки сохранения:', e);
        return false;
    }
}
