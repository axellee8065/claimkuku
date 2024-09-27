const gameContainer = document.getElementById('game-container');
const soloHuntButton = document.getElementById('solo-hunt-button');
const menuScreen = document.getElementById('menu-screen');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const timerDisplay = document.getElementById('timer');
const gameInfo = document.getElementById('game-info');
const bgMusic = document.getElementById('bg-music');
const tapSound = document.getElementById('tap-sound');

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let speed = 1000;
let gameInterval;
let timerInterval;
let timeLeft = 30;
let maxCharacters = 1;

highScoreDisplay.textContent = highScore;

// 랜덤 위치 생성 함수 (캐릭터 간 충돌 방지)
function getRandomPosition(existingPositions) {
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;
    const maxX = containerWidth - 60;
    const maxY = containerHeight - 60;
    let position;

    // 충돌 방지 검사
    do {
        position = { x: Math.floor(Math.random() * maxX), y: Math.floor(Math.random() * maxY) };
    } while (isOverlapping(position, existingPositions));

    return position;
}

// 충돌 방지 검사 함수
function isOverlapping(pos, existingPositions) {
    return existingPositions.some(p => Math.abs(pos.x - p.x) < 70 && Math.abs(pos.y - p.y) < 70);
}

// 캐릭터 생성 함수
function createCharacter(existingPositions) {
    const characterTypes = ["normal", "normal", "normal", "normal", "normal", "normal", "normal", "red", "red", "gold"];
    const type = characterTypes[Math.floor(Math.random() * characterTypes.length)];
    const character = document.createElement("div");
    character.classList.add("character", type);
    const position = getRandomPosition(existingPositions);
    character.style.left = `${position.x}px`;
    character.style.top = `${position.y}px`;

    // 캐릭터 클릭 이벤트
    character.addEventListener("click", () => {
        if (type === "red") {
            score -= 5;  // 감점 캐릭터
        } else if (type === "gold") {
            score += 10;  // 추가 점수 캐릭터
        } else {
            score++;
        }
        scoreDisplay.textContent = score;

        // 클릭 애니메이션 및 효과음 재생
        character.classList.add('clicked');
        tapSound.currentTime = 0;
        tapSound.play();

        // 애니메이션 종료 후 캐릭터 제거
        setTimeout(() => {
            character.remove();
        }, 300);
    });

    return { element: character, position: position };
}

// 캐릭터 스폰 함수
function spawnCharacters() {
    gameContainer.innerHTML = '';
    let existingPositions = [];
    for (let i = 0; i < maxCharacters; i++) {
        const characterData = createCharacter(existingPositions);
        gameContainer.appendChild(characterData.element);
        existingPositions.push(characterData.position);
    }
}

// 게임 시작 함수
function startGame() {
    score = 0;
    speed = 1000;
    timeLeft = 120;
    maxCharacters = 1;

    menuScreen.style.display = 'none';
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    gameContainer.style.display = 'block';
    gameInfo.style.display = 'block';

    spawnCharacters();
    gameInterval = setInterval(spawnCharacters, speed);
    timerInterval = setInterval(updateTimer, 1000);

    bgMusic.play();
}

// 타이머 업데이트 함수
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }

    if (timeLeft % 10 === 0 && maxCharacters < 3) {
        maxCharacters++;
    }
}

// 게임 종료 함수
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    bgMusic.pause();
    bgMusic.currentTime = 0;
    alert(`Time's up! Your score: ${score}`);

    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }

    gameContainer.style.display = 'none';
    gameInfo.style.display = 'none';
    menuScreen.style.display = 'flex';
}

// Solo Hunt 모드 클릭 시 게임 시작
soloHuntButton.addEventListener('click', startGame);




