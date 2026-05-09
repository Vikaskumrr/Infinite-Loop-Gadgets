import React, { useEffect, useMemo, useRef } from 'react';
import './MouseTrailer.scss';

interface Position {
  x: number;
  y: number;
}

const SNAKE_LENGTH = 10;
const LERP_FACTOR = 0.5;
const HEAD_SIZE = 10;
const TAIL_SIZE = 2;
const BASE_COLOR = { r: 140, g: 20, b: 20 };
const HEAD_OPACITY = 0.7;
const TAIL_OPACITY = 0.1;

const MouseTrailer: React.FC = () => {
  const segmentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const segmentsRef = useRef<Position[]>(Array.from({ length: SNAKE_LENGTH }, () => ({ x: -100, y: -100 })));
  const mousePositionRef = useRef<Position>({ x: -100, y: -100 });
  const animationFrameIdRef = useRef<number>();

  const segmentStyles = useMemo(
    () =>
      Array.from({ length: SNAKE_LENGTH }, (_, index) => {
        const progress = index / (SNAKE_LENGTH - 1);
        const size = HEAD_SIZE - (HEAD_SIZE - TAIL_SIZE) * progress;
        const opacity = HEAD_OPACITY - (HEAD_OPACITY - TAIL_OPACITY) * progress;

        return {
          backgroundColor: `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, ${opacity})`,
          width: `${size}px`,
          height: `${size}px`,
        };
      }),
    [],
  );

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;

    if (reducedMotion || coarsePointer) {
      return undefined;
    }

    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const animate = () => {
      const nextSegments = [...segmentsRef.current];
      let target = mousePositionRef.current;

      nextSegments[0] = {
        x: nextSegments[0].x + (target.x - nextSegments[0].x) * LERP_FACTOR,
        y: nextSegments[0].y + (target.y - nextSegments[0].y) * LERP_FACTOR,
      };

      for (let index = 1; index < SNAKE_LENGTH; index += 1) {
        target = nextSegments[index - 1];
        nextSegments[index] = {
          x: nextSegments[index].x + (target.x - nextSegments[index].x) * LERP_FACTOR,
          y: nextSegments[index].y + (target.y - nextSegments[index].y) * LERP_FACTOR,
        };
      }

      segmentsRef.current = nextSegments;
      nextSegments.forEach((segment, index) => {
        const element = segmentRefs.current[index];
        if (!element) return;

        const size = HEAD_SIZE - (HEAD_SIZE - TAIL_SIZE) * (index / (SNAKE_LENGTH - 1));
        element.style.transform = `translate3d(${segment.x - size / 2}px, ${segment.y - size / 2}px, 0)`;
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <>
      {segmentStyles.map((style, index) => (
        <div
          key={index}
          ref={(element) => {
            segmentRefs.current[index] = element;
          }}
          className="snake-segment"
          style={style}
        />
      ))}
    </>
  );
};

export default MouseTrailer;
