const musicsData = [
  { title: "Solar", artist: "Betical", id: 1 },
  { title: "Electric-Feel", artist: "TEEMID", id: 2 },
  { title: "Aurora", artist: "SLUMB", id: 3 },
  { title: "Lost-Colours", artist: "Fakear", id: 4 },
];
const musicPlayer = document.querySelector('audio');
const thumbnail = document.querySelector('.thumbnail');
const title = document.querySelector('.music-title');
const artist = document.querySelector('.artist-name');
const prevBtn = document.querySelector('.prev-btn');
const playBtn = document.querySelector('.play-btn');
const nextBtn = document.querySelector('.next-btn');
const currentIndex = document.querySelector('.current-index span');
const shuffle = document.querySelector('.shuffle');
const repeat = document.querySelector('.repeat');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('.progress-bar');
const currentTimeTxt = document.querySelector('.current-time');
const durationTimeTxt = document.querySelector('.duration-time');
const canvas = document.querySelector('canvas');

let index = 0;
let prevIndex = null;
let isRandom = false;
let repeatValue = 0;

prevBtn.addEventListener('click', handlePrevMusic);
nextBtn.addEventListener('click', handleNextMusic);
playBtn.addEventListener('click', handlePlayPause);
shuffle.addEventListener('click', handleRandomChange);
repeat.addEventListener('click', handleRepeatChange);
musicPlayer.addEventListener('timeupdate', progressEvolution);
progressContainer.addEventListener('click', setProgress)
musicPlayer.addEventListener('play', () => {
  const contextAudio = new AudioContext();
  const src = contextAudio.createMediaElementSource(musicPlayer);
  const analyser = contextAudio.createAnalyser();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  src.connect(analyser);
  analyser.connect(contextAudio.destination);
  analyser.fftSize = 1024;
  const audioFrequences = analyser.frequencyBinCount;
  const tabFrequences = new Uint8Array(audioFrequences);
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  let widthBar = (WIDTH / tabFrequences.length) + 2;
  let heightBar;
  let x;
  function returnBars() {
    requestAnimationFrame(returnBars);
    x = 0;
    analyser.getByteFrequencyData(tabFrequences);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0)"
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0; i < audioFrequences; i++){
      heightBar = tabFrequences[i];

      let r = 109;
      let g = 214;
      let b = tabFrequences[i];

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, HEIGHT, widthBar, - heightBar);

      x += widthBar + 1;
    }
  }
  returnBars();
})

update();

function progressEvolution() {
  const evolution = (musicPlayer.currentTime / musicPlayer.duration) * 100;
  progressBar.style.width = `${evolution}%`;
  formatValue(musicPlayer.currentTime, currentTimeTxt);
  formatValue(musicPlayer.duration, durationTimeTxt);
  if (musicPlayer.currentTime === musicPlayer.duration) {
    console.log(index);
    if (repeatValue === 0) {
      pause();
    }else if (repeatValue === 1) {
      if (index === 3) {
        handleNextMusic();
      } else {
        handleNextMusic();
      }
    } else if (repeatValue === 2) {
      musicPlayer.currentTime = 0;
      play();
    }
  }
}

function handlePrevMusic() {
  if (musicPlayer.currentTime > 3) {
    musicPlayer.currentTime = 0;
  } else {
    if (!isRandom) {
    if(index > 0)index--;
    else index = 3;
  } else {
    if (prevIndex) index = prevIndex;
    else {
      if(index > 0)index--;
      else index = 3;
    }
  }
  }
  
  update();
}

function handleNextMusic() {
  if (!isRandom) {
    if (index < 3) index++;
    else index = 0;
  }else {
    let randomIndex = null;
    while (!randomIndex  || randomIndex === index || randomIndex === prevIndex) {
      randomIndex = Math.trunc(Math.random() * 4);
    }
    prevIndex = index;
    console.log(randomIndex, prevIndex)
    index = randomIndex;
  }
  update()
}


function handlePlayPause() {
  if (musicPlayer.paused) play()
  else  pause()
}

function play(){
  playBtn.querySelector('img').src = './ressources/icons/pause-icon.svg';
  musicPlayer.play();
}

function pause(){
  playBtn.querySelector('img').src = './ressources/icons/play-icon.svg';
  musicPlayer.pause();
}

function handleRandomChange() {
  isRandom = !isRandom;
  console.log(isRandom);
  if (isRandom) shuffle.className = 'shuffle active';
  else shuffle.className = 'shuffle';
}

function handleRepeatChange() {
  if (repeatValue < 2) {
    repeatValue++
    if (repeatValue === 1) {
      repeat.classList.add('active');
    } else if(repeatValue === 2) {
      repeat.classList.add('one');
    }
  }
  else {
    repeatValue = 0;
    repeat.classList.remove('one');
    repeat.classList.remove('active');
  }
  console.log(repeatValue, repeat.classList);
}

function formatValue(val, element) {
  const currentMin = Math.trunc(val / 60);
  let currentSec = Math.trunc(val % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  element.textContent = val ? `${currentMin}:${currentSec}`: '0:00';
}

function setProgress(e) {
  let rect = progressContainer.getBoundingClientRect();
  console.log(rect);
  let width = rect.width;
  const x = e.clientX - rect.left;
  musicPlayer.currentTime = ((x / width) * musicPlayer.duration);
  console.log((width/x) / 100);
}
function init() {
  
}
async function update() {
  musicPlayer.src = `ressources/music/${await musicsData[index].title}.mp3`;
  thumbnail.src = `ressources/thumbs/${await musicsData[index].title}.png`;
  title.textContent = await musicsData[index].title;
  artist.textContent = await musicsData[index].artist;
  currentIndex.textContent = await musicsData[index].id;
  play();
}