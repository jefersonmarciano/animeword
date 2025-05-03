"use client";

import { useState, useEffect, useMemo } from "react";

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
}

export default function CountdownTimer({
  seconds,
  onComplete,
}: CountdownTimerProps) {
  const [count, setCount] = useState(seconds);
  const [isVisible, setIsVisible] = useState(true);

  // Memoize as posições das luzes para evitar recálculos desnecessários
  const lights = useMemo(() => {
    return Array.from({ length: 10 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
  }, []);

  useEffect(() => {
    let startTime = Date.now();
    const endTime = startTime + seconds * 1000;

    const timer = setInterval(() => {
      const currentTime = Date.now();
      const remainingTime = Math.max(
        0,
        Math.ceil((endTime - currentTime) / 1000)
      );

      setCount(remainingTime);

      if (remainingTime === 0) {
        clearInterval(timer);
        setIsVisible(false);
        onComplete();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="countdown-overlay">
      <div className="countdown-number">
        <div className="countdown-diamond"></div>
        <div className="countdown-lights">
          {lights.map((pos, index) => (
            <div
              key={index}
              className="countdown-light"
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
              }}
            ></div>
          ))}
        </div>
        {count}
      </div>
    </div>
  );
}
