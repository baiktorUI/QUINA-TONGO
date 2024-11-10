import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import Logo from './images/Logo-UuhQE.png';
import confetti from 'canvas-confetti';

const launchFireworks = (intervalRef) => {
  const end = Date.now() + 3 * 1000;
  intervalRef.current = setInterval(() => {
    confetti({
      particleCount: 150,
      startVelocity: 30,
      spread: 360,
      ticks: 160,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
      zIndex: 1000,
    });
    if (Date.now() >= end) clearInterval(intervalRef.current);
  }, 250);
};

const launchSchoolPride = (animationFrameRef) => {
  const colors = ['#E94E18', '#312C86', '#FFFFFF'];
  const end = Date.now() + 10 * 1000;
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });
    if (Date.now() < end) {
      animationFrameRef.current = requestAnimationFrame(frame);
    }
  })();
};

const stopConfetti = (intervalRef, animationFrameRef) => {
  clearInterval(intervalRef.current);
  cancelAnimationFrame(animationFrameRef.current);
  confetti.reset();
};

const BingoBoard = ({ markedNumbers, onNumberClick, showQuinaMessage }) => {
  return (
    <div className={`bingo-board ${showQuinaMessage ? 'disabled' : ''}`}>
      {[...Array(90).keys()].map((i) => {
        const number = i + 1;
        const isMarked = markedNumbers.includes(number);
        return (
          <div
            key={number}
            className={`bingo-number ${isMarked ? 'marked' : 'clickable'} ${!isMarked && showQuinaMessage ? 'faded' : ''}`}
            onClick={() => !isMarked && !showQuinaMessage && onNumberClick(number)}
          >
            {number.toString().padStart(2, '0')}
          </div>
        );
      })}
    </div>
  );
};

const App = () => {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [previousNumbers, setPreviousNumbers] = useState([]);
  const [markedNumbers, setMarkedNumbers] = useState([]);
  const [showLiniaCantada, setShowLiniaCantada] = useState(false);
  const [showQuinaMessage, setShowQuinaMessage] = useState(false);
  const [animate, setAnimate] = useState(false);

  const fireworksIntervalRef = useRef(null);
  const schoolPrideAnimationRef = useRef(null);

  const handleNumberClick = (number) => {
    if (!showQuinaMessage && !markedNumbers.includes(number)) {
      setCurrentNumber(number);
      setMarkedNumbers((prev) => [...prev, number]);
      setPreviousNumbers((prev) => [number, ...prev.slice(0, 4)]);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
    }
  };

  const handleUndo = useCallback(() => {
    if (!showQuinaMessage && markedNumbers.length > 0) {
      const updatedMarkedNumbers = markedNumbers.slice(0, -1);
      const lastMarkedNumber = updatedMarkedNumbers[updatedMarkedNumbers.length - 1] || null;
      setMarkedNumbers(updatedMarkedNumbers);
      setPreviousNumbers(updatedMarkedNumbers.slice(-5));
      setCurrentNumber(lastMarkedNumber);
    }
  }, [markedNumbers, showQuinaMessage]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'l' || event.key === 'L') {
        setShowLiniaCantada((prev) => !prev);
      }
      if (event.key === 'q' || event.key === 'Q') {
        setShowQuinaMessage((prev) => !prev);
      }
      if (event.key === 'Backspace') {
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleUndo]);

  useEffect(() => {
    if (showLiniaCantada) {
      launchFireworks(fireworksIntervalRef);
    } else {
      stopConfetti(fireworksIntervalRef, { current: null });
    }
  }, [showLiniaCantada]);

  useEffect(() => {
    if (showQuinaMessage) {
      launchFireworks(fireworksIntervalRef);
      launchSchoolPride(schoolPrideAnimationRef);
    } else {
      stopConfetti(fireworksIntervalRef, schoolPrideAnimationRef);
    }
  }, [showQuinaMessage]);

  return (
    <div className="app-container">
      <div className="current-number-box">
        {showQuinaMessage ? (
          <span className="han-cantat-quina">HAN CANTAT QUINA! 🎉🎉🎉</span>
        ) : (
          <div className={`current-number ${animate ? 'animate-flash' : ''}`}>
            {currentNumber !== null ? currentNumber.toString().padStart(2, '0') : "?"}
          </div>
        )}
      </div>

      <div className="side-box">
        <div className="side-content">
          {showQuinaMessage ? (
            <span className="han-cantat-quina">HAN CANTAT QUINA! 🎉🎉🎉</span>
          ) : (
            previousNumbers.map((num, index) => (
              <span key={index} className={`previous-number opacity-${index}`}>
                {num.toString().padStart(2, '0')}
              </span>
            ))
          )}
        </div>
      </div>

      <div className={`large-box ${showQuinaMessage ? 'highlight' : ''}`}>
        <BingoBoard markedNumbers={markedNumbers} onNumberClick={handleNumberClick} showQuinaMessage={showQuinaMessage} />
      </div>

      <div className="small-box">
        {showQuinaMessage ? (
          <span className="han-cantat-quina">HAN CANTAT QUINA! 🎉🎉🎉</span>
        ) : (
          showLiniaCantada && (
            <span className={`linia-cantada ${showLiniaCantada ? 'show' : ''}`}>LÍNIA CANTADA!! 🎉🎉</span>
          )
        )}
      </div>

      <div className="additional-box">
        <img src={Logo} alt="Logo UuhQE" className="logo-image" />
      </div>
    </div>
  );
};

export default App;
