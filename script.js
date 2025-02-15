// Game Variables
const correctCode = "2223";
let pairs = [1, 1, 2, 2, 3, 3, 4, 4];
let revealedTiles = [];
let matchedTiles = [];

// Passcode Check
function checkPasscode() {
    const inputCode = document.getElementById("passcode").value;
    if (inputCode.length === 4) {
        if (inputCode === correctCode) {
            playSongGradually();
            transitionScreens("screen1", "screen2");
        } else {
            document.getElementById("error").style.display = "block";
        }
    }
}

// Play Song Gradually
function playSongGradually() {
    const song = document.getElementById("song");
    song.volume = 0; // Start with volume at 0
    song.play();

    // Gradually increase the volume
    const fadeInInterval = setInterval(() => {
        if (song.volume < 1) {
            song.volume += 0.05; // Increase volume by 0.05 every 200ms
        } else {
            clearInterval(fadeInInterval); // Stop when volume reaches 1
        }
    }, 200);
}

// Guess the Number
function checkGuess() {
    const guess = parseInt(document.getElementById("guess").value);
    if (guess === 8) {
        transitionScreens("screen2", "screen3", generatePuzzle);
    } else {
        document.getElementById("guess-result").textContent = "Try again!";
    }
}

// Generate Puzzle
function generatePuzzle() {
    shufflePairs();
    const puzzleContainer = document.getElementById("puzzle");
    puzzleContainer.innerHTML = '';
    pairs.forEach((num, index) => {
        let piece = document.createElement("div");
        piece.classList.add('piece');
        piece.dataset.value = num;
        piece.dataset.index = index;
        piece.onclick = () => revealTile(index);
        puzzleContainer.appendChild(piece);
    });
}

// Shuffle Pairs
function shufflePairs() {
    pairs = pairs.sort(() => Math.random() - 0.5);
}

// Reveal Tile
function revealTile(index) {
    const tile = document.querySelector(`.piece[data-index="${index}"]`);
    if (revealedTiles.length < 2 && !tile.classList.contains('revealed')) {
        tile.textContent = pairs[index];
        tile.classList.add('revealed');
        revealedTiles.push({ index, value: pairs[index] });

        if (revealedTiles.length === 2) {
            checkMatch();
        }
    }
}

// Check Match
function checkMatch() {
    const [tile1, tile2] = revealedTiles;
    if (tile1.value === tile2.value) {
        document.querySelector(`.piece[data-index="${tile1.index}"]`).classList.add('matched');
        document.querySelector(`.piece[data-index="${tile2.index}"]`).classList.add('matched');
        matchedTiles.push(tile1.index, tile2.index);

        if (matchedTiles.length === pairs.length) {
            setTimeout(() => {
                transitionScreens("screen3", "screen4", typeMessage);
            }, 1000);
        }
    } else {
        setTimeout(() => {
            document.querySelector(`.piece[data-index="${tile1.index}"]`).textContent = '';
            document.querySelector(`.piece[data-index="${tile2.index}"]`).textContent = '';
            document.querySelector(`.piece[data-index="${tile1.index}"]`).classList.remove('revealed');
            document.querySelector(`.piece[data-index="${tile2.index}"]`).classList.remove('revealed');
        }, 1000);
    }
    revealedTiles = [];
}

// Transition Screens
function transitionScreens(hide, show, callback) {
    document.getElementById(hide).classList.add("hidden");
    setTimeout(() => {
        document.getElementById(show).classList.remove("hidden");
        if (callback) callback();
    }, 1000);
}

// Type Apology Message
function typeMessage() {
    const message = `hello, my love! i just want to apologize for making you feel uneasy. know that it’s not my intention to hurt nor make you overthink. I should’ve been more mindful about the things that you open up to me about. I’ve thought and reflected about it for quite some time and i tried my best to understand and see things from your perspective. I also came to the conclusion that if they were really my friends then they’d understand my reason for unfollowing them. I’m sorry again, mahal ko.`;
    const messageElement = document.getElementById("message");
    let index = 0;

    function typeWriter() {
        if (index < message.length) {
            messageElement.textContent += message.charAt(index);
            index++;
            setTimeout(typeWriter, 50); // Adjust typing speed here
        } else {
            setTimeout(() => {
                document.getElementById("screen4").style.opacity = 0;
                setTimeout(() => {
                    transitionScreens("screen4", "screen5", typeFinalMessage);
                }, 1000);
            }, 2000); // Wait 2 seconds before fading out
        }
    }

    typeWriter();
}

// Type Final Message
function typeFinalMessage() {
    const finalMessage = "I love you!";
    const finalMessageElement = document.getElementById("final-message");
    let index = 0;

    // Start floating hearts as soon as typing begins
    createFloatingHearts();

    function typeWriter() {
        if (index < finalMessage.length) {
            finalMessageElement.textContent += finalMessage.charAt(index);
            index++;
            setTimeout(typeWriter, 100); // Adjust typing speed here
        }
    }

    typeWriter();
}

// Create Floating Hearts
function createFloatingHearts() {
    setInterval(() => {
        let heart = document.createElement("div");
        heart.classList.add("heart");
        heart.textContent = "❤️";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = (3 + Math.random() * 2) + "s";
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }, 200);
}