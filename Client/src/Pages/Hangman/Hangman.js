import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './Hangman.css';

function Hangman() {
  const [hangmanWordState, setHangmanWordState] = useState([]);
  const [hangmanFigure, setHangmanFigure] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [guess, setGuess] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setHangmanWordState([]);
    setHangmanFigure([]);
    setIncorrectGuesses(0);
    setGuess('');
    setResponseMessage('');
    setQuestion('');

    axios.get("http://localhost:3001/api/hangman/start", { withCredentials: true }) // Use axios.get
      .then(res => {
        setHangmanWordState(res.data.hangman_word_state);
      })
      .catch(error => console.error('Error starting new game:', error));

    axios.get("http://localhost:3001/api/hangman/start_with_question")
      .then(res => {
        setQuestion(res.data.question);
      })
      .catch(error => console.error('Error fetching question:', error));
  };

  const toggleInstructions = () => {
    setShowInstructions(prevState => !prevState);
  };

  const handleGuess = () => {
    if (!guess.trim().match(/^[A-Za-z]$/)) {
      setResponseMessage('Invalid guess. Please enter a single letter.');
      return;
    }

    axios.post("http://localhost:3001/api/hangman/guess", { guess: guess.toUpperCase() }) 
      .then(res => {
        const data = res.data;
        if (data.message === 'You already guessed that letter.') {
          setResponseMessage(data.message);
        } else if (data.message === 'Correct guess!' || data.message === 'Congratulations! You won!') {
          setResponseMessage(data.message);
          setHangmanWordState(data.hangman_word_state);
        } else if (data.message === 'Game over. You lost!') {
          setResponseMessage(data.message);
          setHangmanWordState(data.hangman_word_state);
          setHangmanFigure(data.hangman_figure);
        } else if (data.message === 'Incorrect guess!') {
          setResponseMessage(data.message);
          setHangmanWordState(data.hangman_word_state);
          setHangmanFigure(data.hangman_figure);
          setIncorrectGuesses(prev => prev + 1);
        }

        setGuess('');
      })
      .catch(error => console.error('Error making guess:', error));
  };

  return (
    <div className="hangman-container">
      <h1 className="header">Hangman</h1>
      <button className="how-to-play-btn" onClick={toggleInstructions}>How to Play</button>
      {showInstructions && (
        <div className="instructions">
          <h3>How to Play</h3>
          <p>Guess the word by entering one letter at a time into the input field.</p>
          <p>You have 6 incorrect guesses before the game is over.</p>
          <p>Keep guessing until you either complete the word or run out of incorrect guesses.</p>
          <p>Good luck!</p>
        </div>
      )}
      <div className="hangman-question">
        <p>{question}</p>
      </div>
      <div className="hangman-figure">
        {hangmanFigure.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <div className="hangman-word">
        {hangmanWordState.map((letter, index) => (
          <span key={index} className="hangman-letter">
            {letter === '_' ? ' ' : letter}
          </span>
        ))}
      </div>
      <div className="hangman-input">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase())}
          placeholder="Enter your guess..."
        />
        <button className="submit-btn" onClick={handleGuess}>Guess</button>
      </div>
      <p className="response-message">{responseMessage}</p>
      <div className="hangman-guess-count">
        <p>Incorrect Guesses: {incorrectGuesses}</p>
      </div>
      {incorrectGuesses >= 6 && (
        <button className="new-game-btn" onClick={startNewGame}>Start New Game</button>
      )}
    </div>
  );
}

export default Hangman;
