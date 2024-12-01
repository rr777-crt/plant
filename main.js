'use script'
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
let loadCount = 0
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
function miningSun(scorePerSec , price) {
    if (score < price) return
   if (suns < suns_n) return

    getScore(-price)
  getScore(score_n)
    getSuns(-suns_n)
    addPerSecond += scorePerSecSun

    console.log(scorePerSec , price, addPerSecond)
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
   if (score > 6666666666666) {
        button.style.backgroundImage = 'url(https://img.razrisyika.ru/kart/14/1200/53948-gorohostrel-13.jpg)'
    }
}

setInterval( () => {
    getScore(addPerSecond)
    console.log('tick')
}, 1000)

