//home button
const home = () => {
    window.location.href = "../index.html";
};



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

// Listen for arrow key presses to change snake direction
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
        case ' ': // Spacebar
            isPaused = !isPaused;
            break;
    }
});

// Update game state: snake movement, food consumption, and collision detection
function update() {
    const head = {x: snake[0].x + direction.x * snakeSize, y: snake[0].y + direction.y * snakeSize};
    snake.unshift(head); // Add a new head based on the current direction
    
    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        placeFood(); // Place new food
    } else {
        snake.pop(); // Remove the tail segment if no food is eaten
    }
    
    // Check for collisions with the game area boundaries or self
    if (head.x < 0 || head.x + snakeSize > gameWidth || head.y < 0 || head.y + snakeSize > gameHeight || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
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
