import React, { useEffect, useState } from "react";
import SceneFrame from "./components/SceneFrame";
import { QUIZ_QUESTIONS_BY_LANGUAGE, POINTS_PER_CORRECT, QUESTION_TIME_MS, PASSING_RATIO } from "./data/quizQuestions";
import { addScore, listenToRoom } from "./services/roomService";
import { markDifficultyPassed } from "./services/progressService";
import "./QuizScreen.css";

const OPTION_LETTERS = ["a", "b", "c", "d"];

/**
 * QuizScreen
 * ----------
 * 3-column layout:
 *   left   -> live rankings (everyone in the room, sorted by score)
 *   center -> status bar + terminal-style question panel
 *   right  -> countdown timer
 *
 * Props:
 *  - roomId, user, selection ({ language, difficulty })
 *  - onFinish (function): called once this player finishes all questions
 */
export default function QuizScreen({ roomId, user, selection, onFinish }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null
  const [correctCount, setCorrectCount] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_MS);
  const [finished, setFinished] = useState(false);
  const [room, setRoom] = useState(null);

  const questions =
    QUIZ_QUESTIONS_BY_LANGUAGE[selection?.language]?.[selection?.difficulty] ||
    QUIZ_QUESTIONS_BY_LANGUAGE.javascript.beginner;
  const question = questions[questionIndex];
  const secondsLeft = Math.ceil(timeLeft / 1000);
  const accuracy = questionIndex > 0 ? Math.round((correctCount / questionIndex) * 100) : 0;

  useEffect(() => {
    const unsubscribe = listenToRoom(roomId, setRoom);
    return unsubscribe;
  }, [roomId]);

  useEffect(() => {
    if (feedback || finished) return;

    setTimeLeft(QUESTION_TIME_MS);
    const start = Date.now();
    const id = setInterval(() => {
      const remaining = QUESTION_TIME_MS - (Date.now() - start);
      if (remaining <= 0) {
        clearInterval(id);
        handleAnswer(null);
      } else {
        setTimeLeft(remaining);
      }
    }, 200);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, feedback, finished]);

  async function handleAnswer(optionIndex) {
    if (feedback) return;
    setSelectedOption(optionIndex);

    const isCorrect = optionIndex === question.correctIndex;
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setMyScore((s) => s + POINTS_PER_CORRECT);
      await addScore(roomId, user.uid, POINTS_PER_CORRECT);
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex((i) => i + 1);
      } else {
        finishQuiz(isCorrect);
      }
    }, 1200);
  }

  async function finishQuiz(lastWasCorrect) {
    const finalCorrect = correctCount + (lastWasCorrect ? 1 : 0);
    const ratio = finalCorrect / questions.length;

    if (selection && ratio >= PASSING_RATIO) {
      await markDifficultyPassed(user.uid, selection.language, selection.difficulty);
    }

    setFinished(true);
  }

  const players = room?.players ? Object.entries(room.players) : [];
  const rankings = players
    .map(([uid, data]) => ({ uid, username: data.username, score: data.score || 0 }))
    .sort((a, b) => b.score - a.score);

  return (
    <SceneFrame>
      <div className="quiz-screen">
        {/* ---------- left: live rankings ---------- */}
        <aside className="quiz-panel quiz-rankings">
          <h3 className="quiz-panel__title">LIVE RANKINGS</h3>
          <div className="quiz-rankings__list">
            {rankings.map((p, i) => (
              <div
                key={p.uid}
                className={"rank-row" + (p.uid === user.uid ? " rank-row--me" : "")}
              >
                <span className={"rank-row__badge rank-row__badge--" + (i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "plain")}>
                  {i + 1}
                </span>
                <span className="rank-row__name">{p.username}</span>
                <span className="rank-row__score">{p.score} pts</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ---------- center: status bar + terminal question ---------- */}
        <div className="quiz-center">
          {!finished ? (
            <>
              <div className="quiz-statusbar">
                <span className="status-pill">
                  {questionIndex + 1}/{questions.length}
                </span>
                <span className="status-pill status-pill--accent">{selection?.language?.toUpperCase() || "JAVASCRIPT"}</span>
                <span className="status-pill status-pill--accent">{selection?.difficulty?.toUpperCase() || "BEGINNER"}</span>
                <span className="status-pill">{accuracy}%</span>
              </div>

              <div className="terminal">
                <div className="terminal__titlebar">
                  <span className="terminal__dot terminal__dot--red" />
                  <span className="terminal__dot terminal__dot--yellow" />
                  <span className="terminal__dot terminal__dot--green" />
                  <span className="terminal__title">TERMINAL — QUESTION</span>
                </div>

                <div className="terminal__body">
                  <p className="terminal__line terminal__line--muted">$ codeBuggies-cli --start</p>
                  <p className="terminal__line terminal__line--muted">&gt; loading question {questionIndex + 1}...</p>
                  <p className="terminal__line terminal__line--muted">
                    debug@codebuggies:~$ cat question_{questionIndex + 1}.txt
                  </p>
                  <p className="terminal__line terminal__prompt">// {question.prompt}</p>

                  {question.code && <pre className="terminal__code">{question.code}</pre>}

                  <div className="terminal__options">
                    {question.options.map((option, i) => {
                      let optionClass = "terminal-option";
                      if (feedback && i === question.correctIndex) optionClass += " terminal-option--correct";
                      else if (feedback && i === selectedOption) optionClass += " terminal-option--wrong";

                      return (
                        <button
                          key={i}
                          type="button"
                          className={optionClass}
                          onClick={() => handleAnswer(i)}
                          disabled={Boolean(feedback)}
                        >
                          <span className="terminal-option__letter">{OPTION_LETTERS[i]}.</span> {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="quiz-finished">
              <h2 className="quiz-finished__heading">QUIZ COMPLETE</h2>
              <p className="quiz-finished__score">
                {correctCount} / {questions.length} correct — {myScore} points
              </p>
              <button type="button" className="quiz-finished__button" onClick={onFinish}>
                CONTINUE
              </button>
            </div>
          )}
        </div>

        {/* ---------- right: timer ---------- */}
        <aside className="quiz-panel quiz-timer-panel">
          <h3 className="quiz-panel__title">TIMER</h3>
          <div className="quiz-timer-panel__number">{finished ? "--" : secondsLeft}</div>
          <div className="quiz-timer-panel__bar">
            <div
              className="quiz-timer-panel__bar-fill"
              style={{ width: finished ? "0%" : `${(timeLeft / QUESTION_TIME_MS) * 100}%` }}
            />
          </div>
        </aside>
      </div>
    </SceneFrame>
  );
}