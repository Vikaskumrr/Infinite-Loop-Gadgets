import React, { useState, useRef, useEffect } from 'react';
import './SnakeGame.scss';

// Custom hook for declarative intervals
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const CANVAS_SIZE = [400, 400];
const SNAKE_START = [
  [8, 7],
  [8, 8],
];
const FOOD_START = [8, 3];
const SCALE = 20;
const SPEED = 150;

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [food, setFood] = useState(FOOD_START);
  const [dir, setDir] = useState([0, -1]); // Moving up initially
  const [speed, setSpeed] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setSnake(SNAKE_START);
    setFood(FOOD_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
    setScore(0);
  };

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };

  const createFood = () =>
    food.map((_, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece: number[], snk: number[][]) => {
    // Wall collision
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    ) {
      return true;
    }
    // Self collision
    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) {
        return true;
      }
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];

    if (checkCollision(newSnakeHead, snakeCopy)) {
      endGame();
      return;
    }

    snakeCopy.unshift(newSnakeHead);

    // Check if snake ate food
    if (newSnakeHead[0] === food[0] && newSnakeHead[1] === food[1]) {
      setScore((prevScore) => prevScore + 10);
      setFood(createFood());
    } else {
      snakeCopy.pop();
    }

    setSnake(snakeCopy);
  };

  const moveSnake = ({ keyCode }: { keyCode: number }) => {
    // Prevent snake from reversing on itself
    if (keyCode === 38 && dir[1] !== 1) setDir([0, -1]); // Up
    else if (keyCode === 40 && dir[1] !== -1) setDir([0, 1]); // Down
    else if (keyCode === 37 && dir[0] !== 1) setDir([-1, 0]); // Left
    else if (keyCode === 39 && dir[0] !== -1) setDir([1, 0]); // Right
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw food
      context.fillStyle = 'lightgreen';
      context.fillRect(food[0], food[1], 1, 1);

      // Draw snake
      context.fillStyle = 'lightblue';
      snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    }
  }, [snake, food, gameOver]);

  useInterval(() => gameLoop(), speed);

  return (
    <div role="button" tabIndex={0} onKeyDown={(e) => moveSnake(e)} className="snake-game-container">
      <div className="game-header">
        <h2>Mini Snake Game</h2>
        <div className="score">Score: {score}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
        className="game-canvas"
      />
      <div className="game-controls">
        <button onClick={startGame}>Start Game</button>
        {gameOver && <div className="game-over-message">GAME OVER!</div>}
      </div>
      <div className="instructions">
        <p>Use Arrow Keys to Move</p>
      </div>
    </div>
  );
};

export default SnakeGame;
