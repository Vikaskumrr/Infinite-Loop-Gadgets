import React, { useState, useEffect, useRef } from 'react';
import './MouseTrailer.scss';

interface Position {
  x: number;
  y: number;
}

// --- Configuration ---
const SNAKE_LENGTH = 10; // Number of segments in the snake
const LERP_FACTOR = 0.5; // How quickly segments follow (lower is smoother/laggier)
const HEAD_SIZE = 10; // Size of the segment closest to the cursor
const TAIL_SIZE = 2; // Size of the last segment

// Base color for the snake (wine red)
const BASE_COLOR = { r: 140, g: 20, b: 20 };
const HEAD_OPACITY = 0.7; // Opacity of the head (darker)
const TAIL_OPACITY = 0.1; // Opacity of the tail (lighter)

const MouseTrailer: React.FC = () => {
  // Use a ref to store segments to avoid re-renders inside the animation loop
  const segmentsRef = useRef<Position[]>(
    Array(SNAKE_LENGTH).fill({ x: -100, y: -100 }) // Start off-screen
  );
  // State to trigger re-render when segments are updated
  const [renderSegments, setRenderSegments] = useState(segmentsRef.current);
  const mousePositionRef = useRef<Position>({ x: 0, y: 0 });
  const animationFrameIdRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const newSegments = [...segmentsRef.current];
      // The head of the snake follows the mouse
      let target = mousePositionRef.current;

      // Lerp the first segment toward the mouse
      newSegments[0] = {
        x: newSegments[0].x + (target.x - newSegments[0].x) * LERP_FACTOR,
        y: newSegments[0].y + (target.y - newSegments[0].y) * LERP_FACTOR,
      };

      // Each subsequent segment follows the one in front of it
      for (let i = 1; i < SNAKE_LENGTH; i++) {
        target = newSegments[i - 1];
        newSegments[i] = {
          x: newSegments[i].x + (target.x - newSegments[i].x) * LERP_FACTOR,
          y: newSegments[i].y + (target.y - newSegments[i].y) * LERP_FACTOR,
        };
      }

      segmentsRef.current = newSegments;
      setRenderSegments(newSegments); // Trigger React to re-render
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <>
      {renderSegments.map((segment, index) => {
        const progress = index / (SNAKE_LENGTH - 1); // 0 for head, 1 for tail
        const size = HEAD_SIZE - (HEAD_SIZE - TAIL_SIZE) * progress;
        const opacity = HEAD_OPACITY - (HEAD_OPACITY - TAIL_OPACITY) * progress;

        return (
          <div
            key={index}
            className="snake-segment"
            style={{
              backgroundColor: `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, ${opacity})`,
              width: `${size}px`,
              height: `${size}px`,
              transform: `translate(${segment.x - size / 2}px, ${segment.y - size / 2}px)`,
            }}
          />
        );
      })}
    </>
  );
};

export default MouseTrailer;