import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("theme");
  const [theme, setTheme] = useState("dark");

  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState(30);

  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);

  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const inputRef = useRef(null);

  const highScoreKey = `highscore-${difficulty}`;
  const highScore = Number(localStorage.getItem(highScoreKey)) || 0;

  const generateQuestion = () => {
    let num1, num2, operator, correctAnswer;

    if (difficulty === "easy") {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;

      operator = Math.random() < 0.5 ? "+" : "-";

      if (operator === "-" && num2 > num1) {
        [num1, num2] = [num2, num1];
      }
    } else if (difficulty === "medium") {
      const operators = ["+", "-", "*"];

      operator =
        operators[Math.floor(Math.random() * operators.length)];

      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;

      if (operator === "-" && num2 > num1) {
        [num1, num2] = [num2, num1];
      }
    } else {
      const operators = ["+", "-", "*", "/"];

      operator =
        operators[Math.floor(Math.random() * operators.length)];

      if (operator === "/") {
        num2 = Math.floor(Math.random() * 12) + 1;
        correctAnswer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * correctAnswer;
      } else {
        num1 = Math.floor(Math.random() * 200) + 1;
        num2 = Math.floor(Math.random() * 200) + 1;

        if (operator === "-" && num2 > num1) {
          [num1, num2] = [num2, num1];
        }
      }
    }

    if (correctAnswer === undefined) {
      switch (operator) {
        case "+":
          correctAnswer = num1 + num2;
          break;
        case "-":
          correctAnswer = num1 - num2;
          break;
        case "*":
          correctAnswer = num1 * num2;
          break;
        case "/":
          correctAnswer = num1 / num2;
          break;
        default:
          break;
      }
    }

    setQuestion({
      text: `${num1} ${operator} ${num2}`,
      answer: correctAnswer,
    });
  };

  const startGame = () => {
    setScreen("game");

    setScore(0);
    setStreak(0);
    setBestStreak(0);

    setCorrectCount(0);
    setTotalCount(0);

    setFeedback("");
    setAnswer("");

    setTimeLeft(duration);

    generateQuestion();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  useEffect(() => {
    if (screen !== "game") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          const currentHigh =
            Number(localStorage.getItem(highScoreKey)) || 0;

          if (score > currentHigh) {
            localStorage.setItem(highScoreKey, score);
          }

          setScreen("result");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, score, highScoreKey]);

  useEffect(() => {
    if (difficulty && screen === "game") {
      generateQuestion();
    }
  }, []);

  const handleSubmit = () => {
    if (answer === "") return;

    const userAnswer = Number(answer);

    setTotalCount((prev) => prev + 1);

    if (userAnswer === question.answer) {
      const newStreak = streak + 1;

      let points = 10;

      if (newStreak % 5 === 0) {
        points += 10;
      } else if (newStreak % 3 === 0) {
        points += 5;
      }

      setScore((prev) => prev + points);

      setCorrectCount((prev) => prev + 1);

      setStreak(newStreak);

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      setFeedback("CORRECT");
      setFeedbackType("correct");
    } else {
      setScore((prev) => Math.max(0, prev - 5));

      setStreak(0);

      setFeedback(
        `INCORRECT • ANSWER: ${question.answer}`
      );

      setFeedbackType("wrong");
    }

    setTimeout(() => {
      setFeedback("");
      generateQuestion();
      setAnswer("");
      inputRef.current?.focus();
    }, 700);
  };

  const accuracy =
    totalCount === 0
      ? 0
      : Math.round((correctCount / totalCount) * 100);

  const progressWidth = (timeLeft / duration) * 100;

  return (
    <div className={`app ${theme}`}>
      <div className="floating">+</div>
      <div className="floating">−</div>
      <div className="floating">×</div>
      <div className="floating">÷</div>

      {/* THEME SCREEN */}

      {screen === "theme" && (
        <div className="card">
          <h1 className="title">MATH MASTER</h1>

          <p className="subtitle">
            Challenge Your Brain
          </p>

          <h3>Select Theme</h3>

          <button
            className="option-btn"
            onClick={() => {
              setTheme("dark");
              setScreen("difficulty");
            }}
          >
            DARK
          </button>

          <button
            className="option-btn"
            onClick={() => {
              setTheme("light");
              setScreen("difficulty");
            }}
          >
            LIGHT
          </button>
        </div>
      )}

      {/* DIFFICULTY */}

      {screen === "difficulty" && (
        <div className="card">
          <h1 className="title small">
            MATH MASTER
          </h1>

          <h2>Select Difficulty</h2>

          <button
            className="option-btn"
            onClick={() => {
              setDifficulty("easy");
              setScreen("duration");
            }}
          >
            EASY
          </button>

          <button
            className="option-btn"
            onClick={() => {
              setDifficulty("medium");
              setScreen("duration");
            }}
          >
            MEDIUM
          </button>

          <button
            className="option-btn"
            onClick={() => {
              setDifficulty("hard");
              setScreen("duration");
            }}
          >
            HARD
          </button>
        </div>
      )}

      {/* DURATION */}

      {screen === "duration" && (
        <div className="card">
          <h1 className="title small">
            MATH MASTER
          </h1>

          <h2>Select Duration</h2>

          {[15, 30, 45, 60].map((sec) => (
            <button
              key={sec}
              className="option-btn"
              onClick={() => {
                setDuration(sec);
                setTimeLeft(sec);
                startGame();
              }}
            >
              {sec} SECONDS
            </button>
          ))}
        </div>
      )}

      {/* GAME */}

      {screen === "game" && (
        <div className="card game-card">
          <h1 className="title small">
            MATH MASTER
          </h1>

          <div className="stats">
            <div>
              <span>{timeLeft}</span>
              <p>TIME</p>
            </div>

            

            <div>
              <span>{score}</span>
              <p>SCORE</p>
            </div>
          </div>

          <div className="progress">
            <div
              className="progress-fill"
              style={{
                width: `${progressWidth}%`,
              }}
            ></div>
          </div>

          {feedback && (
            <div className="feedback-wrapper">
  {feedback && (
    <div className={`feedback ${feedbackType}`}>
      {feedback}
    </div>
  )}
</div>
          )}

          <div className="question-box">
            <h2>{question.text} = ?</h2>
          </div>

          <input
            ref={inputRef}
            type="number"
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Enter Answer"
          />

          <button
            className="submit-btn"
            onClick={handleSubmit}
          >
            SUBMIT
          </button>
        </div>
      )}

      {/* RESULT */}

      {screen === "result" && (
        <div className="card">
          <h1 className="title small">
            GAME OVER
          </h1>

          <div className="result-grid">
            <div>
              <h3>Score</h3>
              <p>{score}</p>
            </div>

            <div>
              <h3>Accuracy</h3>
              <p>{accuracy}%</p>
            </div>

            <div>
              <h3>Best Streak</h3>
              <p>{bestStreak}</p>
            </div>

            <div>
              <h3>High Score</h3>
              <p>{highScore}</p>
            </div>
          </div>

          <button
            className="option-btn"
            onClick={startGame}
          >
            PLAY AGAIN
          </button>

          <button
            className="option-btn"
            onClick={() => setScreen("theme")}
          >
            HOME
          </button>
        </div>
      )}
    </div>
  );
}

export default App;