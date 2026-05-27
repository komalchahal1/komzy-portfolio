let bgMusic = new Audio("bg-music.mp3");
let coinSound = new Audio("coin-sound.mp3");
let jumpSound = new Audio("jump-sound.mp3");
let winSound = new Audio("win-sound.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.08;
coinSound.volume = 0.30;
jumpSound.volume = 0.45;
winSound.volume = 0.25;

bgMusic.load();
coinSound.load();
jumpSound.load();
winSound.load();

const player = document.getElementById('player');
  
let x = 100;
let y = 0;

let velocityY = 0;

let moveLeft = false;
let moveRight = false;

let jumping = false;

let score = 0;
let level = 1;

let gameCompleted = false;

let lastSpaceTime = 0;
const DOUBLE_PRESS_DELAY = 300; // ms

setTimeout(() => {
    let boot = document.getElementById("bootScreen");
    boot.style.transition = "opacity 1s ease";
    boot.style.opacity = "0";

    setTimeout(() => {
        boot.style.display = "none";
    }, 1000);

}, 3000);

let text = document.querySelector("#bootScreen p");

let messages = [
    "booting futuristic chaos...",
    "loading main character energy...",
    "injecting gen-z creativity...",
    "training future tech founder...",
    "building internet empire...",
    "starting KOMAL.exe..."
];

let i = 0;

let interval = setInterval(() => {
    if(i < messages.length){
        text.innerHTML = messages[i];
        i++;
    }
}, 600);

/* START */

function startGame() {

    bgMusic.play()
    .then(() => {
        console.log("Music started");
    })
    .catch((err) => {
        console.log("Autoplay blocked:", err);
    });

    document.getElementById('start').style.display = 'none';
}

/* FORM */

function submitForm() {

    alert('🚀 MESSAGE SENT SUCCESSFULLY!');

}

/* KEYBOARD */

document.addEventListener('keydown', e => {

    if (e.key === 'ArrowRight') moveRight = true;

    if (e.key === 'ArrowLeft') moveLeft = true;

    if (e.key === 'ArrowUp' || (e.key === ' ' && !jumping)) {

        velocityY = -24;

        jumping = true;

        jumpSound.currentTime = 0;
        jumpSound.play();

    }

    if (e.key == " ") {
        const now = Date.now();

        if (now - lastSpaceTime < DOUBLE_PRESS_DELAY) {
            velocityY = -24;

            jumping = true;

        }

        lastSpaceTime = now;
    }

});

let code = "";

document.addEventListener("keydown", (e) => {

    code += e.key;

    if (code.includes("godmode")) {
        score += 10;
        document.getElementById('coins').innerText = score;

        alert("🔥 GOD MODE ACTIVATED!");
        code = "";
    }

});

document.addEventListener('keyup', e => {

    if (e.key === 'ArrowRight') moveRight = false;

    if (e.key === 'ArrowLeft') moveLeft = false;

});

/* PARTICLES */

function createParticles(x, y) {

    for (let i = 0; i < 10; i++) {

        let p = document.createElement('div');

        p.classList.add('particle');

        p.style.left = x + 'px';

        p.style.top = y + 'px';

        document.body.appendChild(p);

        setTimeout(() => {

            p.remove();

        }, 1000);

    }

}

let enemyNames = [
    "CSS Bug 😵‍💫",
    "NullPointer.exe 💀",
    "Syntax Demon 👹",
    "Div Overflow 👾"
];

/* SCREENSHAKE */

function screenShake(){

    document.body.classList.add("shake");

    setTimeout(() => {
        document.body.classList.remove("shake");
    }, 300);

}

function createTrail(){

    let trail = document.createElement("div");

    trail.classList.add("trail");

    trail.style.left = (x + 20) + "px";
    trail.style.top = (window.innerHeight - 180 + y) + "px";

    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 500);

}

/* GAME LOOP */

function gameLoop() {

    if (!gameCompleted) {

        /* MOVE */

        if (moveRight) {
 
            createTrail();

            x += 7;
            // x = x+7;

            player.style.transform = 'scaleX(1)';

            player.classList.add('walk');

        }

        if (moveLeft) {

            createTrail();

            x -= 7;

            player.style.transform = 'scaleX(-1)';

            player.classList.add('walk');

        }

        if (!moveLeft && !moveRight) {

            player.classList.remove('walk');

        }

        if (x < 0) x = 100;

        /* GRAVITY */

        velocityY += 1.2;

        y += velocityY;

        if (y > 0) {

            y = 0;

            velocityY = 0;

            jumping = false;

        }

        player.style.left = x + 'px';

        player.style.top =
            (window.innerHeight - 200 + y) + 'px';

        /* CAMERA */

        window.scrollTo(x - 300, 0);

    if(x > 5000 && score >= 3){

    document.body.style.background = "black";

    }


        /* COINS */

        document.querySelectorAll('.coin').forEach(coin => {

            if (coin.style.display !== 'none') {

                let cx = coin.offsetLeft;

                let cy = coin.offsetTop;

                if (
                    x + 60 > cx &&
                    x < cx + 35 &&
                    player.offsetTop < cy + 35 &&
                    player.offsetTop + 90 > cy
                ) {

                    coin.style.display = 'none';

                    score++;

                    if(score % 3 === 0){
                    level++;

                     document.getElementById("level").innerText = level;

                     alert("🔥 LEVEL UP! YOU ARE NOW LEVEL " + level);
                }

                    document.getElementById('coins').innerText = score;

                    createParticles(cx, cy);

                    coinSound.currentTime = 0;
                    coinSound.play();

                }

            }

        });

        /* ENEMIES */

        document.querySelectorAll('.enemy').forEach(enemy => {

            let ex = enemy.offsetLeft;

            if (
                x + 60 > ex &&
                x < ex + 60 &&
                y > -50
            ) {

            gameCompleted = true;

        let randomEnemy = enemyNames[Math.floor(Math.random() * enemyNames.length)];

        screenShake();

        alert('💀 CAUGHT BY ' + randomEnemy);

         setTimeout(() => {
            location.reload();
        }, 600);

            }

        });
        
/* FLAG WIN */

const flag = document.getElementById('flag');
const flagPosition = flag.offsetLeft;

if (
    x >= flagPosition - 100 &&
    score >= 5 &&
    !gameCompleted
) {

    gameCompleted = true;

    moveLeft = false;
    moveRight = false;

    /* STOP GAME FEEL */

    document.body.style.transition = "all 1s";
    document.body.style.filter = "brightness(1.2)";
    
    /* SHOW PORTAL */

    const portal = document.getElementById("endingScreen");
    portal.style.display = "flex";
    portal.style.opacity = "1";
    portal.style.pointerEvents = "all";

    /* MUSIC */

    bgMusic.pause();
    winSound.currentTime = 0;
    winSound.play();

    /* AUTO FOCUS INPUT */

    setTimeout(() => {

        const input = document.querySelector(".portal-box input");

        if(input){

            input.focus();

        }

    }, 200);
}

    }

    requestAnimationFrame(gameLoop);

}


gameLoop();


