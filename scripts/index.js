import { words } from './words.js';

//Selecting elements
const logoOne = document.querySelector('.logo-one');
const logoTwo = document.querySelector('.logo-two');
const ruler = document.querySelector('.rule');
const scorePlayerOneElement = document.querySelector('.score-player-one');
const scorePlayerTwoElement = document.querySelector('.score-player-two');
const lozenge = document.querySelector('.lozenge');
const letterRow = document.querySelectorAll('.letter-row');
const letterBox = document.querySelector('.letter-box');
const letterBoxes = document.querySelectorAll('.letter-box');
const keyboardContainer = document.querySelector('.keyboard-container');
const keyboardButtons = document.querySelectorAll('.keyboard-button');
const playAgainButton = document.querySelector('.play-again-button');
const resetScoreButton = document.querySelector('.reset-score-button');

//Data
let row = 1;
let player = 1;
let letter = 1;
let usedWords = JSON.parse(localStorage.getItem('usedWords')) || [];
let targetWord = getNextWord();
let gameOver = false;
let wordCorrect = false;
console.log(targetWord);
let scorePlayerOne = 0;
let scorePlayerTwo = 0;

function getNextWord() {
  // Create a copy of the words array excluding used words
  const availableWords = words.filter(word => !usedWords.includes(word));
  
  if (availableWords.length === 0) {
    // If there are no more available words, reset the usedWords array
    usedWords = [];
  }

  const index = Math.floor(Math.random() * availableWords.length);
  const nextWord = availableWords[index];
  usedWords.push(nextWord);
  
  // Update local storage with the new usedWords array
  localStorage.setItem('usedWords', JSON.stringify(usedWords));

  return nextWord;
}

document.addEventListener('DOMContentLoaded', function () {
  scorePlayerOne = parseInt(localStorage.getItem('scorePlayerOne')) || 0;
  scorePlayerTwo = parseInt(localStorage.getItem('scorePlayerTwo')) || 0;
  updateScores();
  resetScores();
});

//Procedural code and functions
for (const button of keyboardButtons)
  button.addEventListener('click', function () {
    keyPress(button.attributes['data-key'].value);
  });

playAgainButton.addEventListener('click', function () {
  location.reload();
});

function populateWord(key) {
  if (letter < 6) {
    letterRow[row - 1].querySelectorAll('.letter-box')[letter - 1].textContent =
      key;
    letter += 1;
  }
}

function explodeConfetti() {
  confetti({
    particleCount: 400,
    spread: 70,
  });
}

function showGameOverAlert(winnerMessage) {
  // Trigger confetti explosion after a delay (e.g., 500 milliseconds)
  setTimeout(explodeConfetti, 500);

  // Show an alert with the winner message after the same delay
  setTimeout(function() {
    alert(winnerMessage);
    if (wordCorrect) {
      if (player % 2 === 0) {
        scorePlayerOne += 1;
      } else {
        scorePlayerTwo += 1;
      }
      updateScores();
    }
  }, 500);
}

function updateScores() {
  scorePlayerOneElement.textContent = scorePlayerOne;
  scorePlayerTwoElement.textContent = scorePlayerTwo;

  localStorage.setItem('scorePlayerOne', scorePlayerOne.toString());
  localStorage.setItem('scorePlayerTwo', scorePlayerTwo.toString());
}

function resetScores () {
  resetScoreButton.addEventListener('click', function () {
    scorePlayerOne = 0;
    scorePlayerTwo = 0;
    updateScores();
    location.reload();
  });
}

function checkWord() {
  const letterElements = letterRow[row - 1].querySelectorAll('.letter-box');
  const correctLetters = [];
  const guessedOccurrences = {};

  // First, mark all correctly guessed letters
  for (let i = 0; i < targetWord.length; i++) {
    const currentLetter = targetWord[i];
    const currentElement = letterElements[i];
    
    if (!guessedOccurrences[currentLetter]) {
      guessedOccurrences[currentLetter] = 1;
    } else if (guessedOccurrences[currentLetter] < targetWord.split(currentLetter).length - 1) {
      guessedOccurrences[currentLetter]++;
    } else {
      currentElement.classList.add('letter-box-wrong');
      continue;
    }

    if (currentElement.textContent.toLowerCase() === currentLetter) {
      currentElement.classList.add('letter-box-correct');
      correctLetters.push(currentElement);
    }
  }

  letterElements.forEach((element, index) => {
    const currentLetter = element.textContent.toLowerCase();
    const correctLetterIndex = targetWord.indexOf(currentLetter);
    
    if (correctLetters.includes(element)) {
        element.classList.add('letter-box-correct');
    } else if (correctLetterIndex !== -1 && correctLetterIndex !== index) {
        element.classList.add('letter-box-almost');
    } else {
        element.classList.add('letter-box-wrong');
    }
});



  if (correctLetters.length === 5 && player % 2 === 0) {
    gameOver = true;
    wordCorrect = true;
    showGameOverAlert('Player 2 wins! Player 1 take a shot!');
  } else if (correctLetters.length === 5 && player % 2 !== 0) {
    gameOver = true;
    wordCorrect = true;
    showGameOverAlert('Player 1 wins! Player 2 take a shot!');
  } else if (row === 6) {
    gameOver = true;
    showGameOverAlert(`Both players take a shot! The word was ${targetWord}`);
  }
}


function findAllOccurrences(str, char) {
  const indices = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i].toLowerCase() === char) {
      indices.push(i);
    }
  }
  return indices;
}

function enterWord() {
  if (letter < 6) {
    //makes sure word is right amount of letters
    alert('Please enter more letters!');
  } else {
    //if it is, run check word function
    checkWord();
    row += 1; //increment to next row
    letter = 1; //start at the beginning.
    player += 1; //increment the player number each time
  }
  if (player % 2 === 0) {
    lozenge.classList.add('lozenge-player-two');
    letterBox.classList.add('letter-box-player-two');
    keyboardContainer.classList.add('keyboard-container-player-two');
    lozenge.innerHTML = '<p>Player Two</p>';
    ruler.classList.add('rule-player-two');
    logoTwo.classList.add('logo-two-on');
    logoOne.classList.add('logo-one-off');

    for (const box of letterBoxes) {
      box.classList.add('letter-box-player-two');
    }
  } else {
    lozenge.classList.remove('lozenge-player-two');
    letterBox.classList.remove('letter-box-player-two');
    keyboardContainer.classList.remove('keyboard-container-player-two');
    lozenge.innerHTML = '<p>Player One</p>';
    ruler.classList.remove('rule-player-two');
    logoTwo.classList.remove('logo-two-on');
    logoOne.classList.remove('logo-one-off');

    for (const box of letterBoxes) {
      box.classList.remove('letter-box-player-two');
    }
  }
}

function deleteLetter() {
  const letterElements = letterRow[row - 1].querySelectorAll('.letter-box');
  for (let index = letterElements.length - 1; index >= 0; index--) {
    const element = letterElements[index];
    if (element.textContent !== '') {
      element.textContent = '';
      letter -= 1;
      break;
    }
  }
}

function keyPress(key) {
  if (!gameOver) {
    if (key === 'enter') {
      enterWord();
    } else if (key === 'delete') {
      deleteLetter();
    } else {
      populateWord(key);
    }
  } else {
    alert('Game over!');
  }
}
