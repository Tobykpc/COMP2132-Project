const wordDisplay = document.getElementById('wordDisplay');
const hintDisplay = document.getElementById('hint');
const message = document.getElementById('message');
const hangmanImage = document.querySelector('#hangmanImage img');
const playAgainButton = document.getElementById('playAgainButton');
const keyboardDiv = document.getElementById("keyboard");

let word = '';
let hint = '';
let guessedLetters = [];
let incorrectGuesses = 0;
const maxGuesses = 6;

fetch('./words.json')
    .then(response => response.json())
    .then(data => startGame(data))
    .catch(error => console.error('Error fetching JSON:', error));

function startGame(data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    word = data[randomIndex].word;
    hint = data[randomIndex].hint;
    guessedLetters = [];
    incorrectGuesses = 0;
    displayWord();
    hintDisplay.textContent = `Hint: ${hint}`;
    message.textContent = '';
    hangmanImage.src = 'images/0.jpg';
    playAgainButton.style.display = 'none';

    keyboardDiv.innerHTML = ''; 
    createKeyboard();
}

function displayWord() {
    wordDisplay.textContent = word
        .split('')
        .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
        .join(' ');
}

function createKeyboard() {
    for (let i = 97; i <= 122; i++) { 
        const button = document.createElement("button");
        button.innerText = String.fromCharCode(i); 
        button.classList.add("key-button"); 
        keyboardDiv.appendChild(button);

        button.addEventListener("click", (e) => {
            handleKeyPress(e.target, String.fromCharCode(i));
        });
    }
}

function handleKeyPress(button, letter) {
    if (guessedLetters.includes(letter)) return; 

    guessedLetters.push(letter); 
    button.disabled = true; 

    if (word.includes(letter)) {
        displayWord();
        if (word.split('').every(letter => guessedLetters.includes(letter))) {
            endGame(true); 
        }
    } else {
        incorrectGuesses++;
        hangmanImage.src = `images/${incorrectGuesses}.jpg`;
        if (incorrectGuesses === maxGuesses) {
            endGame(false);
        }
    }
}

function endGame(won) {
    message.textContent = won ? 'You Won!' : `You Lost! The word was: ${word}`;
    playAgainButton.style.display = 'block';

    const buttons = document.querySelectorAll(".key-button");
    buttons.forEach((button) => button.disabled = true);
}

playAgainButton.addEventListener('click', () => {
    fetch('./words.json')
        .then(response => response.json())
        .then(data => startGame(data))
        .catch(error => console.error('Error fetching JSON:', error));
});
