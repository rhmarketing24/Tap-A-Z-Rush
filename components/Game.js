"use client";

import { useState, useEffect } from "react";

export default function Game() {
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Load alphabet A → Z
  useEffect(() => {
    const alphabet = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
    setLetters(alphabet);
  }, []);

  const handleClick = (letter) => {
    if (done) return;

    if (currentIndex === 0) {
      setStartTime(Date.now());
    }

    if (letter === letters[currentIndex]) {
      const nextIndex = currentIndex + 1;

      if (nextIndex === letters.length) {
        const timeTaken = (Date.now() - startTime) / 1000;
        setElapsed(timeTaken);
        setDone(true);

        // Save score to API
        saveScore(timeTaken, nextIndex);
      }

      setCurrentIndex(nextIndex);
    }
  };

  const saveScore = async (score, lettersCompleted) => {
    try {
      await fetch("/api/saveScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_name: "Player",
          score_seconds: score,
          letters_completed: lettersCompleted,
          mode: "normal",
        }),
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Tap A → Z Rush</h1>

      {!done && (
        <div>
          <h3>Tap in order:</h3>
          <h2>{letters[currentIndex]}</h2>
        </div>
      )}

      {done && (
        <div>
          <h2>🎉 Completed!</h2>
          <p>Your Time: {elapsed.toFixed(3)}s<
