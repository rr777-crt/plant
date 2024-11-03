'use strict'
const scoreText = document.getElementById("score")
const addText = document.getElementById("add")
const button = document.getElementById("button")

const btnAdd2 = document.getElementById("add-2")
const btnAdd5 = document.getElementById("add-5")
const btnAdd10 = document.getElementById("add-10")
const btnAdd20 = document.getElementById("add-20")
const btnAdd50 = document.getElementById("add-50")
const btnAdd200 = document.getElementById("add-200")
const btnAddm1 = document.getElementById("min-1")
const btnAddm10 = document.getElementById("min-10")
const btnAddm100 = document.getElementById("min-100")
const btnAddm1000 = document.getElementById("min-1000")
const btnAdd1000 = document.getElementById("add-1000")

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
let add = 1

button.onclick = getClick

btnAdd2.onclick = () => getClickAdd(2, 100)
btnAdd5.onclick = () => getClickAdd(5, 235)
btnAdd10.onclick = () => getClickAdd(10, 1250)
btnAdd20.onclick = () => getClickAdd(20, 1850)
btnAdd50.onclick = () => getClickAdd(50, 5000)
btnAdd200.onclick = () => getClickAdd(200, 12000)
btnAddm1.onclick = () => mining(1, 100)
btnAddm10.onclick = () => mining(10, 500)
btnAddm100.onclick = () => mining(100, 5000)
btnAddm1000.onclick = () => mining(1000, 50000)
btnAdd1000.onclick = () => getClickAdd(1000, 100000)

 
function getClick(n) {
    if ( Number.isInteger(n) ) score += n
    else score += add
    scoreText.innerText = score

    checkBGImage()
    if (isLoadingReady && score>= 500) {
     isLoadingReady = false
     MUSIC['Grasswalk.mp3'].play()
    }
}

function getClickAdd(n, price) {
    if (score < price) return

    score -= price
    scoreText.innerText = score
    
    add = n
    addText.innerText = add
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
    if (score > 1000000000000) {
        button.style.backgroundImage = 'url(https://avatars.mds.yandex.net/i?id=d39205f173fac3d831222a6d9a3ee2cd_l-10878141-images-thumbs&n=13)'
    }
}
function mining(scorePerSec , price) {
    if (score > price) {
        score -= price
        scoreText.innerText = score
        setInterval( getClick, 1000, scorePerSec)
    }
    
}
    

    

