
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const SCREEN_WIDTH = 600;
    const SCREEN_HEIGHT = 400;
    const BLOCK_SIZE = 20;
    const SNAKE_SPEED = 100; // Speed in milliseconds

    const WHITE = "#FFFFFF";
    const RED = "#FF0000";
    const GREEN = "#00FF00";
    const BLACK = "#000000";

    // Directions
    const UP = { x: 0, y: -1 };
    const DOWN = { x: 0, y: 1 };
    const LEFT = { x: -1, y: 0 };
    const RIGHT = { x: 1, y: 0 };

    // Snake class
    class Snake {
      constructor() {
        this.length = 1;
        this.positions = [{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 }];
        this.direction = RIGHT;
      }

      get headPosition() {
        return this.positions[0];
      }

      turn(direction) {
        if (this.length > 1 && 
            (direction.x * -1 === this.direction.x || direction.y * -1 === this.direction.y)) {
          return;
        }
        this.direction = direction;
      }

      move() {
        const newHead = {
          x: (this.headPosition.x + this.direction.x * BLOCK_SIZE + SCREEN_WIDTH) % SCREEN_WIDTH,
          y: (this.headPosition.y + this.direction.y * BLOCK_SIZE + SCREEN_HEIGHT) % SCREEN_HEIGHT,
        };
        if (this.positions.some(pos => pos.x === newHead.x && pos.y === newHead.y)) {
          this.reset();
        } else {
          this.positions.unshift(newHead);
          if (this.positions.length > this.length) {
            this.positions.pop();
          }
        }
      }

      reset() {
        this.length = 1;
        this.positions = [{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 }];
        this.direction = RIGHT;
      }

      draw() {
        ctx.fillStyle = GREEN;
        this.positions.forEach(pos => {
          ctx.fillRect(pos.x, pos.y, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeStyle = BLACK;
          ctx.strokeRect(pos.x, pos.y, BLOCK_SIZE, BLOCK_SIZE);
        });
      }
    }

    // Food class
    class Food {
      constructor() {
        this.position = { x: 0, y: 0 };
        this.randomizePosition();
      }

      randomizePosition() {
        this.position = {
          x: Math.floor(Math.random() * (SCREEN_WIDTH / BLOCK_SIZE)) * BLOCK_SIZE,
          y: Math.floor(Math.random() * (SCREEN_HEIGHT / BLOCK_SIZE)) * BLOCK_SIZE,
        };
      }

      draw() {
        ctx.fillStyle = RED;
        ctx.fillRect(this.position.x, this.position.y, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = BLACK;
        ctx.strokeRect(this.position.x, this.position.y, BLOCK_SIZE, BLOCK_SIZE);
      }
    }

    const snake = new Snake();
    const food = new Food();

    // Game loop
    function gameLoop() {
      ctx.fillStyle = WHITE;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

      snake.move();
      if (snake.headPosition.x === food.position.x && snake.headPosition.y === food.position.y) {
        snake.length++;
        food.randomizePosition();
      }

      snake.draw();
      food.draw();
    }

    // Set up controls
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          snake.turn(UP);
          break;
        case "ArrowDown":
          snake.turn(DOWN);
          break;
        case "ArrowLeft":
          snake.turn(LEFT);
          break;
        case "ArrowRight":
          snake.turn(RIGHT);
          break;
      }
    });

    // Run the game loop
    setInterval(gameLoop, SNAKE_SPEED);