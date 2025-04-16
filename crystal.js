// ================ КОНФИГУРАЦИЯ ================
const eliteConfig = {
    crystalPrice: 1000000000000, // 1 триллион капель за 1 кристалл
    musicTracks: {
        "bgm1": {
            name: "🌿 Природа",
            price: 5,
            file: "music/nature.mp3",
            bought: false
        },
        "bgm2": {
            name: "🎵 Эпичная музыка",
            price: 10,
            file: "music/epic.mp3",
            bought: false
        },
        "bgm3": {
            name: "🎮 8-bit ретро",
            price: 8,
            file: "music/8bit.mp3",
            bought: false
        }
    }
};

// ================ ПЕРЕМЕННЫЕ ================
let crystals = 0;
let currentMusic = null;

// ================ ЭЛЕМЕНТЫ ИНТЕРФЕЙСА ================
// Кнопка обмена
const exchangeBtn = document.createElement('button');
exchangeBtn.textContent = '💎 Обменять';
exchangeBtn.style.cssText = `
    position: fixed;
    bottom: 180px;
    right: 20px;
    padding: 10px 15px;
    background: linear-gradient(135deg, #00BCD4, #0097A7);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

// Кнопка музыкального магазина
const musicShopBtn = document.createElement('button');
musicShopBtn.textContent = '🎵 Музыка';
musicShopBtn.style.cssText = `
    position: fixed;
    bottom: 230px;
    right: 20px;
    padding: 10px 15px;
    background: linear-gradient(135deg, #E91E63, #C2185B);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

// Дисплей кристаллов
const crystalDisplay = document.createElement('div');
crystalDisplay.id = 'crystal-display';
crystalDisplay.style.cssText = `
    position: fixed;
    top: 40px;
    right: 240px;
    font-size: 24px;
    color: #00BCD4;
    text-shadow: 0 0 5px rgba(0,188,212,0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 5px;
`;

// ================ ФУНКЦИИ ================
function updateCrystalDisplay() {
    crystalDisplay.innerHTML = `💎 ${crystals} | <small>${(score/eliteConfig.crystalPrice).toFixed(5)}%</small>`;
}

function exchangeForCrystal() {
    if (score >= eliteConfig.crystalPrice) {
        getScore(-eliteConfig.crystalPrice);
        crystals++;
        updateCrystalDisplay();
        showMessage(`+1 Кристалл! (Осталось: ${(score/eliteConfig.crystalPrice).toFixed(5)}%)`, '#00BCD4');
        saveSystem.saveGame();
    } else {
        showMessage(`Нужно ещё ${eliteConfig.crystalPrice - score} капель!`, 'red');
    }
}

function createMusicShop() {
    const shop = document.createElement('div');
    shop.id = 'music-shop';
    shop.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        padding: 20px;
        border-radius: 10px;
        color: white;
        z-index: 1004;
        display: none;
        width: 300px;
        max-width: 90%;
    `;

    shop.innerHTML = `
        <h2 style="text-align:center; margin-top:0;">🎼 Музыкальный магазин</h2>
        <div id="music-items" style="margin-bottom:15px;"></div>
        <button id="close-music-shop" style="
            display: block;
            margin: 0 auto;
            padding: 8px 15px;
            background: #FF5722;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        ">Закрыть</button>
    `;

    document.body.appendChild(shop);

    // Загрузка музыки
    for (const [id, track] of Object.entries(eliteConfig.musicTracks)) {
        const audio = new Audio();
        audio.src = `https://yourgithubusername.github.io/yourrepo/${track.file}`;
        track.audio = audio;
    }

    return shop;
}

function updateMusicShop() {
    const container = document.getElementById('music-items');
    if (!container) return;

    container.innerHTML = '';
    
    for (const [id, track] of Object.entries(eliteConfig.musicTracks)) {
        const item = document.createElement('div');
        item.style.margin = '10px 0';
        item.style.padding = '10px';
        item.style.border = '1px solid #333';
        item.style.borderRadius = '5px';

        item.innerHTML = `
            <h3 style="margin:0 0 5px 0; color:#E91E63;">${track.name}</h3>
            <p style="margin:0 0 5px 0; font-size:14px; color:#aaa;">
                ${track.bought ? '✅ Куплено' : `💎 Цена: ${track.price} кристаллов`}
            </p>
            <button data-music="${id}" style="
                padding: 5px 10px;
                background: ${track.bought ? (currentMusic === id ? '#4CAF50' : '#673AB7') : (crystals >= track.price ? '#FF9800' : '#555')};
                color: white;
                border: none;
                border-radius: 3px;
                cursor: ${track.bought ? 'pointer' : (crystals >= track.price ? 'pointer' : 'default')};
                width: 100%;
            ">
                ${track.bought ? (currentMusic === id ? 'Сейчас играет' : 'Включить') : 'Купить'}
            </button>
        `;

        container.appendChild(item);
    }

    // Обработчики для кнопок
    document.querySelectorAll('[data-music]').forEach(btn => {
        btn.onclick = function() {
            const musicId = this.getAttribute('data-music');
            const track = eliteConfig.musicTracks[musicId];
            
            if (!track.bought) {
                if (crystals >= track.price) {
                    crystals -= track.price;
                    track.bought = true;
                    updateCrystalDisplay();
                    saveSystem.saveGame();
                    updateMusicShop();
                    showMessage(`Музыка "${track.name}" куплена!`, '#E91E63');
                }
            } else {
                if (currentMusic === musicId) {
                    track.audio.pause();
                    currentMusic = null;
                } else {
                    if (currentMusic) {
                        eliteConfig.musicTracks[currentMusic].audio.pause();
                    }
                    track.audio.currentTime = 0;
                    track.audio.loop = true;
                    track.audio.play();
                    currentMusic = musicId;
                }
                updateMusicShop();
            }
        };
    });

    document.getElementById('close-music-shop').onclick = function() {
        document.getElementById('music-shop').style.display = 'none';
    };
}

// ================ ИНИЦИАЛИЗАЦИЯ ================
document.addEventListener('DOMContentLoaded', function() {
    // Создаем элементы
    crystalDisplay.innerHTML = '💎 0';
    document.body.appendChild(crystalDisplay);
    document.body.appendChild(exchangeBtn);
    document.body.appendChild(musicShopBtn);
    
    const musicShop = createMusicShop();
    
    // Обработчики
    exchangeBtn.onclick = exchangeForCrystal;
    musicShopBtn.onclick = function() {
        musicShop.style.display = 'block';
        updateMusicShop();
    };
    
    // Загрузка сохранений
    saveSystem.loadGame();
    updateCrystalDisplay();
});

// ================ ОБНОВЛЕННЫЕ СОХРАНЕНИЯ ================
saveSystem.saveGame = function() {
    const data = {
        // ... (ваши существующие данные) ...
        crystals: crystals,
        currentMusic: currentMusic,
        musicTracks: {}
    };
    
    for (const [id, track] of Object.entries(eliteConfig.musicTracks)) {
        data.musicTracks[id] = { bought: track.bought };
    }
    
    localStorage.setItem('plantClickerSave', JSON.stringify(data));
};

saveSystem.loadGame = function() {
    const data = JSON.parse(localStorage.getItem('plantClickerSave') || '{}');
    crystals = data.crystals || 0;
    currentMusic = data.currentMusic || null;
    
    if (data.musicTracks) {
        for (const [id, trackData] of Object.entries(data.musicTracks)) {
            if (eliteConfig.musicTracks[id]) {
                eliteConfig.musicTracks[id].bought = trackData.bought;
                
                // Восстанавливаем текущую музыку
                if (currentMusic === id) {
                    const audio = new Audio();
                    audio.src = `https://yourgithubusername.github.io/yourrepo/${eliteConfig.musicTracks[id].file}`;
                    audio.loop = true;
                    audio.play();
                    eliteConfig.musicTracks[id].audio = audio;
                }
            }
        }
    }
};
