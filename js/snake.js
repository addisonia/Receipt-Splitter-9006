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
    mobileButtonsContainer.style.display = shouldShow ? 'flex' : 'none';
}



//----------------------------------------------


//Snake Game

// wait until page loads before placing food
document.addEventListener('DOMContentLoaded', (event) => {
    adjustGameAreaSize();
    placeFood();
    window.requestAnimationFrame(main);
});


// Access the game area from the DOM to manipulate it
const gameArea = document.getElementById('gameArea');
// Get the initial width and height of the game area
let gameWidth = gameArea.clientWidth;
let gameHeight = gameArea.clientHeight;
const snakeSize = 20; // The size of each snake segment
let snake = [{x: snakeSize * 5, y: snakeSize * 5}]; // Initial snake position
let food = {x: 0, y: 0}; // Initial food position
let direction = {x: 0, y: 0}; // Initial movement direction
let speed = 16; // The speed of the game, controlling the update frequency
let lastRenderTime = 0; // The last time the game was rendered
let isPaused = false; // Tracks the pause state of the game


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



// Update game state: snake movement, food consumption, and collision detection
function update() {
    const head = {x: snake[0].x + direction.x * snakeSize, y: snake[0].y + direction.y * snakeSize};
    snake.unshift(head); // Add a new head based on the current direction
    
    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        score += 1; // Increment the current score
        updateCurrentScore(); // Update the current score display
        placeFood(); // Place new food
    } else {
        snake.pop(); // Remove the tail segment if no food is eaten
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
        score = 0;
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

    let potentialFoodPosition;

    // Keep generating new positions until one that doesn't overlap with the snake is found
    do {
        potentialFoodPosition = {
            // Allow food to spawn within an area that excludes the outer layer
            x: (Math.floor(Math.random() * ((gameWidth / snakeSize) - 2)) + 1) * snakeSize,
            y: (Math.floor(Math.random() * ((gameHeight / snakeSize) - 2)) + 1) * snakeSize
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
