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
    adjustGameAreaSize(); // Adjust the size of the game area immediately
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
    console.log('Toggle pause called');
    isPaused = !isPaused;
    const pauseOverlay = document.getElementById('pauseOverlay');
    if (isPaused) {
        pauseOverlay.style.display = 'flex'; // Show the pause icon
    } else {
        pauseOverlay.style.display = 'none'; // Hide the pause icon
    }
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
    foodEatenInInfinityMode = false; // Allow food to spawn again
    placeFood(); // This ensures food is placed when the game restarts
    clearInterval(scoreTimer); // Stop any running score timer
    score = 1;
    updateCurrentScore();
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
    hard: { speed: 24, growthRate: 1 },
    impossible: { speed: 60, growthRate: 0 },
    actually_impossible: { speed: 0, growthRate: 0 },
    infinity: { speed: 15, growthRate: 1000 },
    patience: { speed: 1, growthRate: 0 }
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
        // case ' ':
        //     isPaused = !isPaused;
        //     break;
            case ' ':
        e.preventDefault(); // Prevent scrolling the page when pressing space
        togglePause();
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


function updateHighScoreIfNeeded() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore.toString());
        updateHighScore();
    }
}



// Update game state: snake movement, food consumption, and collision detection
let foodEatenInInfinityMode = false; // Tracks if food has been eaten in Infinity mode
let scoreTimer = null; // Holds the reference to the interval timer for score increment in Infinity mode

function update() {
    const head = {x: snake[0].x + direction.x * snakeSize, y: snake[0].y + direction.y * snakeSize};
    snake.unshift(head); // Add a new head

    if (head.x === food.x && head.y === food.y) {
        // Skip score increment for infinity mode here since it's handled by a timer
        if (currentMode !== 'infinity') {
            // Increase score by growthRate plus one for the head of the snake
            score += growthRate + 1;
            updateCurrentScore();
            // Apply growth rate for non-infinity modes
            for (let i = 0; i < growthRate; i++) {
                snake.push({...snake[snake.length - 1]});
            }
        } else {
            for (let i = 0; i < growthRate; i++) {
                snake.push({...snake[snake.length - 1]});
            }
        }

        // Only place new food if not in Infinity mode or if it's the first food in Infinity mode
        if (currentMode !== 'infinity' || !foodEatenInInfinityMode) {
            placeFood();
        }

        // Special handling for Infinity mode
        if (currentMode === 'infinity' && !foodEatenInInfinityMode) {
            foodEatenInInfinityMode = true; // Prevents further food spawning
            // Reset score timer for growing the score
            clearInterval(scoreTimer);
            scoreTimer = setInterval(() => {
                if (!isPaused) { // Check if game is not paused
                    score++;
                    updateCurrentScore();
                    updateHighScoreIfNeeded();
                }
            }, 200); // Update every second
        }

        updateHighScoreIfNeeded();
    } else {
        snake.pop();
    }

    checkForCollisions();
}



function checkAndUpdateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        updateHighScore();
    }
}

function checkForCollisions() {
    const head = snake[0];
    // Check for collisions with the game area boundaries or self
    if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(scoreTimer); // Stop the score timer
        resetGameOnCollision();
    }
}

function resetGameOnCollision() {
    score = 1;
    updateCurrentScore();
    highScore = Math.max(score, highScore);
    localStorage.setItem('highScore', highScore);
    updateHighScore();
    snake = [{x: snakeSize * 5, y: snakeSize * 5}];
    direction = {x: 0, y: 0};
    foodEatenInInfinityMode = false; // Reset for next game
    // Reset food visibility for non-Infinity modes
    if (currentMode !== 'infinity') {
        placeFood();
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
        gameArea.appendChild(snakeElement);
    });

    // Draw food only if not in Infinity mode after the first one is eaten
    if (!foodEatenInInfinityMode || currentMode !== 'infinity') {
        const foodElement = document.createElement('div');
        foodElement.style.left = `${food.x}px`;
        foodElement.style.top = `${food.y}px`;
        foodElement.classList.add('food');
        gameArea.appendChild(foodElement);
    }
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
    let gameWidthPercentage = 0.8; // 80% for non-mobile by default
    let gameHeightPercentage = 0.8; // 80% for both non-mobile and mobile

    // Check if the current view is mobile based on width
    if (window.innerWidth <= 768) { // Using 768px as a breakpoint for mobile
        gameWidthPercentage = 0.95; // 95% for mobile
    }

    if (document.body.classList.contains('mobile-buttons-enabled')) {
        gameHeightPercentage = 0.65; // Decrease the height percentage when mobile buttons are enabled
    }

    let availableWidth = window.innerWidth * gameWidthPercentage;
    let availableHeight = window.innerHeight * gameHeightPercentage;

    // Subtract the border width, assuming border-box sizing
    availableWidth -= (gameArea.clientLeft || 10) * 2; // Defaulting to 10px if clientLeft is not supported
    availableHeight -= (gameArea.clientTop || 10) * 2; // Defaulting to 10px if clientTop is not supported

    // Adjust the dimensions to be a multiple of the snake size
    availableWidth -= availableWidth % snakeSize;
    availableHeight -= availableHeight % snakeSize;

    // Apply the adjusted dimensions to the game area
    gameArea.style.width = `${availableWidth}px`;
    gameArea.style.height = `${availableHeight}px`;

    // Update the gameWidth and gameHeight variables to be used elsewhere in the code
    gameWidth = availableWidth;
    gameHeight = availableHeight;

    // Call placeFood to ensure food is within the new dimensions
    placeFood();
}

// Call the function to set the initial size
adjustGameAreaSize();
window.addEventListener('resize', adjustGameAreaSize);



