//home button
const home = () => {
    window.location.href = "../index.html";
};


//Settings Button
document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settingsButton');
    const settingsPopup = document.getElementById('settingsPopup');
  
    settingsButton.addEventListener('click', () => {
      // Toggle the popup display on button click
      settingsPopup.style.display = settingsPopup.style.display === 'block' ? 'none' : 'block';
    });
  
    window.addEventListener('click', (event) => {
      if (!settingsPopup.contains(event.target) && !settingsButton.contains(event.target)) {
        settingsPopup.style.display = 'none';
      }
    });

    const mobileButtonsToggle = document.getElementById('mobileButtonsToggle');
    
    // Initial setup based on the current state of the toggle
    toggleMobileButtons(mobileButtonsToggle.checked);

    mobileButtonsToggle.addEventListener('change', (e) => {
        toggleMobileButtons(e.target.checked);
    });
  
  });


// Function to toggle mobile buttons visibility
function toggleMobileButtons(shouldShow) {
    const mobileButtonsContainer = document.getElementById('mobileButtonsContainer');
    const gameContainer = document.querySelector('.game-container');
    const body = document.body;

    mobileButtonsContainer.style.display = shouldShow ? 'flex' : 'none';

    if (shouldShow) {
        body.classList.add('mobile-buttons-enabled');
        gameContainer.style.height = `calc(100vh - var(--mobile-buttons-height))`; // Adjust the game container height
    } else {
        body.classList.remove('mobile-buttons-enabled');
        gameContainer.style.height = 'auto'; // Reset the game container height
    }

    // After adjusting the game area, place the food in a new position
    placeFood();
}




//----------------------------------------------


//Snake Game

// wait until page loads before placing food
document.addEventListener('DOMContentLoaded', (event) => {
    adjustGameAreaSize();
    placeFood();
    window.requestAnimationFrame(main);

    const gameModeSelect = document.getElementById('gameModeSelect');

    // Retrieve the last game mode from localStorage, default to 'normal' if not found
    currentMode = localStorage.getItem('gameMode') || 'normal';
    gameModeSelect.value = currentMode; // Set the select element to reflect the current mode
    // Apply the game mode settings
    applyGameModeSettings(currentMode);

    gameModeSelect.addEventListener('change', (e) => {
        currentMode = e.target.value;
        // Save the selected game mode to localStorage
        localStorage.setItem('gameMode', currentMode);
        applyGameModeSettings(currentMode);
    });

    // Add touch event listener to game area
    const gameArea = document.getElementById('gameArea');
    gameArea.addEventListener('touchstart', function(e) {
        // Check if mobile buttons are enabled
        if (document.body.classList.contains('mobile-buttons-enabled')) {
            e.preventDefault(); // Prevent default touch behavior (scrolling, zooming, etc.)
            togglePause(); // Call function to toggle game pause state
        }
    });   
    
    // Automatically enable mobile buttons for mobile users
    if (isMobileDevice()) {
        mobileButtonsToggle.checked = true;
        toggleMobileButtons(true);
        // Retrieve the last game mode from localStorage, default to 'normal' if not found
        currentMode = localStorage.getItem('gameMode') || 'easy';
        gameModeSelect.value = currentMode; // Set the select element to reflect the current mode
        // Apply the game mode settings
        applyGameModeSettings(currentMode);
    } else {
        // Optionally, read the saved state from localStorage for desktop users
        const savedState = localStorage.getItem('mobileButtonsEnabled');
        const shouldShowMobileButtons = savedState ? JSON.parse(savedState) : false;
        mobileButtonsToggle.checked = shouldShowMobileButtons;
        toggleMobileButtons(shouldShowMobileButtons);
    }

    mobileButtonsToggle.addEventListener('change', (e) => {
        toggleMobileButtons(e.target.checked);
        // Save the state to localStorage
        localStorage.setItem('mobileButtonsEnabled', e.target.checked);
    });

});

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


// Function to toggle the pause state of the game
function togglePause() {
    isPaused = !isPaused;
}

function applyGameModeSettings(mode) {
    speed = gameModes[mode].speed;
    growthRate = gameModes[mode].growthRate;
    resetGame();
}

// Ensure the resetGame function properly resets the game to the current mode's settings
function resetGame() {
    // Reset game state variables to their initial values according to the current game mode
    snake = [{x: snakeSize * 5, y: snakeSize * 5}]; // Reset snake to initial position
    direction = {x: 0, y: 0}; // Reset movement direction
    score = 1; // Reset score
    updateCurrentScore(); // Update score display
    placeFood(); // Place food in a new position
}

// Access the game area from the DOM to manipulate it
const gameArea = document.getElementById('gameArea');
// Get the initial width and height of the game area
let gameWidth = gameArea.clientWidth;
let gameHeight = gameArea.clientHeight;
const snakeSize = 20; // The size of each snake segment
let snake = [{x: snakeSize * 5, y: snakeSize * 5}]; // Initial snake position
let food = {x: 0, y: 0}; // Initial food position
let direction = {x: 0, y: 0}; // Initial movement direction
let speed = 30; // The speed of the game, controlling the update frequency
let lastRenderTime = 0; // The last time the game was rendered
let isPaused = false; // Tracks the pause state of the game

const gameModes = {
    easy: { speed: 8, growthRate: 4 },
    normal: { speed: 14, growthRate: 3 },
    hard: { speed: 24, growthRate: 2 },
    impossible: { speed: 60, growthRate: 1 }
};

// Set the default mode to 'normal'
let currentMode = 'normal';
let growthRate = gameModes[currentMode].growthRate;
speed = gameModes[currentMode].speed;


// The main game loop
function main(currentTime) {
    window.requestAnimationFrame(main);
    if (isPaused) return; // Stop updating and drawing if the game is paused

    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    // Control game update speed
    if (secondsSinceLastRender < 1 / speed) return;
    lastRenderTime = currentTime;
    
    update(); // Update the game state
    draw(); // Draw the game state
}

window.requestAnimationFrame(main);

// Button functionality
function leftArrow() {
    if (direction.x === 0) direction = { x: -1, y: 0 };
}

function upArrow() {
    if (direction.y === 0) direction = { x: 0, y: -1 };
}

function downArrow() {
    if (direction.y === 0) direction = { x: 0, y: 1 };
}

function rightArrow() {
    if (direction.x === 0) direction = { x: 1, y: 0 };
}


// Listen for arrow key presses and WASD key presses to change snake direction
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w': // Add 'W' key functionality
            upArrow(); // Reuse the upArrow function
            break;
        case 'ArrowDown':
        case 's': // Add 'S' key functionality
            downArrow(); // Reuse the downArrow function
            break;
        case 'ArrowLeft':
        case 'a': // Add 'A' key functionality
            leftArrow(); // Reuse the leftArrow function
            break;
        case 'ArrowRight':
        case 'd': // Add 'D' key functionality
            rightArrow(); // Reuse the rightArrow function
            break;
        case ' ':
            isPaused = !isPaused;
            break;
    }
});


// Initialize the score
let score = 1;
let highScore = localStorage.getItem('highScore') || 1; // Retrieve the saved high score from local storage or start with 0

// Function to update the current score
function updateCurrentScore() {
    const currentScoreElement = document.getElementById('currentScore');
    currentScoreElement.textContent = `Current Score: ${score}`;
}

// Function to update the high score
function updateHighScore() {
    const highScoreElement = document.getElementById('highScore');
    highScoreElement.textContent = `High Score: ${highScore}`;
}

// Call to initialize the score displays
updateCurrentScore();
updateHighScore();


function resetHighScore() {
    highScore = 1; // Reset high score variable
    localStorage.removeItem('highScore'); // Remove the high score from local storage
    updateHighScore(); // Update the high score display
}




// Update game state: snake movement, food consumption, and collision detection
function update() {
    const head = {x: snake[0].x + direction.x * snakeSize, y: snake[0].y + direction.y * snakeSize};
    snake.unshift(head); // Add a new head based on the current direction
    
    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        // Increase the score based on the growth rate
        score += growthRate;
        updateCurrentScore(); // Update the current score display
        if (score > highScore) {
            highScore = score; // Update the high score
            localStorage.setItem('highScore', highScore); // Save the new high score to local storage
            updateHighScore(); // Update the high score display
        }
        placeFood(); // Place new food
        
        // Add new segments to the end of the snake equal to the growth rate
        for (let i = 0; i < growthRate; i++) {
            snake.push({...snake[snake.length - 1]}); // Copy the last segment of the snake
        }
    } else {
        // Only remove the tail segment if no food is eaten
        snake.pop();
    }

    // Check for collisions with the game area boundaries or self
    if (head.x < 0 || head.x + snakeSize > gameWidth || head.y < 0 || head.y + snakeSize > gameHeight || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        // Check if current score is higher than the high score
        if (score > highScore) {
            highScore = score; // Update the high score
            localStorage.setItem('highScore', highScore); // Save the new high score to local storage
            updateHighScore(); // Update the high score display
        }
        // Reset the current score and update the display
        score = 1;
        updateCurrentScore();
        // Reset the game state on collision
        snake = [{x: snakeSize * 5, y: snakeSize * 5}];
        direction = {x: 0, y: 0};
        placeFood(); // Ensure food is placed in a valid location after reset
    }
}


// Call this function to adjust the game area size whenever the window is resized
window.addEventListener('resize', adjustGameAreaSize);


// Draw the snake and food on the game area
function draw() {
    gameArea.innerHTML = ''; // Clear the game area
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${segment.x}px`;
        snakeElement.style.top = `${segment.y}px`;
        snakeElement.classList.add('snake');
        gameArea.appendChild(snakeElement); // Add each snake segment to the game area
    });
    
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add('food');
    gameArea.appendChild(foodElement); // Add the food to the game area
}


// Place food in a valid location, avoiding the outer edges and the snake's body
function placeFood() {
    // Update gameWidth and gameHeight to the size of the game area
    gameWidth = gameArea.clientWidth;
    gameHeight = gameArea.clientHeight;

    let minX = 0;
    let minY = 0;
    let maxX = (gameWidth / snakeSize) - 1;
    let maxY = (gameHeight / snakeSize) - 1;

    // In 'easy' mode, avoid placing food in the outer rows and columns
    if (currentMode === 'easy') {
        minX = 1;
        minY = 1;
        maxX = (gameWidth / snakeSize) - 2;
        maxY = (gameHeight / snakeSize) - 2;
    }

    let potentialFoodPosition;

    // Keep generating new positions until one that doesn't overlap with the snake is found
    do {
        potentialFoodPosition = {
            x: (Math.floor(Math.random() * (maxX - minX + 1)) + minX) * snakeSize,
            y: (Math.floor(Math.random() * (maxY - minY + 1)) + minY) * snakeSize
        };
    } while (isFoodOnSnake(potentialFoodPosition));

    // Assign the valid non-overlapping position to the food
    food = potentialFoodPosition;
}



// Check if the new food position overlaps with the snake's body
function isFoodOnSnake(position) {
    return snake.some(segment => {
        return segment.x === position.x && segment.y === position.y;
    });
}

placeFood(); // Initial call to place food when the game starts


//game size
function adjustGameAreaSize() {
    // Calculate the available width and height based on 80% of the viewport
    let availableWidth = window.innerWidth * 0.8;
    let availableHeight = window.innerHeight * 0.8;

    // Adjust for the border width (10px on each side)
    availableWidth -= 20; // Subtract 20px for the left and right borders
    availableHeight -= 20; // Subtract 20px for the top and bottom borders

    // Adjust the dimensions to be a multiple of the snake size
    availableWidth = availableWidth - (availableWidth % snakeSize);
    availableHeight = availableHeight - (availableHeight % snakeSize);

    // Apply the adjusted dimensions to the game area
    gameArea.style.width = `${availableWidth}px`;
    gameArea.style.height = `${availableHeight}px`;

    // Update the gameWidth and gameHeight variables
    gameWidth = availableWidth;
    gameHeight = availableHeight;

    placeFood(); // Call placeFood here to ensure it uses the correct dimensions

}


// Also call this function once initially to set up the game area dimensions
adjustGameAreaSize();
