import React, { useState, useEffect } from 'react';
import './TicTacToe.css';
import { decode } from 'html-entities';
import axios from 'axios';
import Questions from '../../Components/Questions/Questions';

function TicTacToeGame() {
  const [data, setData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedBox, setSelectedBox] = useState(-1);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:3001/api/tictactoe/response", { withCredentials: true })
      .then(res => res.data)
      .then(data => {
        setData(data);
        setResponseMessage('');
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleAnswerSubmit = () => {
    fetch("http://localhost:3001/api/tictactoe/response", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        question: data.question,
        answer: answer
      })
    })
      .then(res => res.json())
      .then(data => {
        setData(data);
        setResponseMessage(data.message);
        setAnswer('');
        setSelectedBox(-1);
      })
      .catch(error => console.error('Error submitting answer:', error));
  };

  const handleBoxSelection = () => {
    if (selectedBox !== -1) {
      fetch("http://localhost:3001/api/tictactoe/response", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: '',
          answer: '',
          position: selectedBox
        })
      })
        .then(res => res.json())
        .then(data => {
          setData(data);
          setSelectedBox(-1);
        })
        .catch(error => console.error('Error updating Tic Tac Toe board:', error));
    }
  };

  const handleCellClick = (index) => {
    if (!data.question && !data.board[index].trim()) {
      setSelectedBox(index);
    }
  };

  const toggleInstructions = () => {
    setShowInstructions(prevState => !prevState);
  };

  const restartGame = () => {
    fetch("http://localhost:3001/restart-game", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(() => {
        fetchData(); // Fetch new game data after restarting
      })
      .catch(error => console.error('Error restarting game:', error));
  };

  return (

    <div className="container">
      <h1 className="header">Tic Tac Toe</h1>
      <button className="how-to-play-btn" onClick={toggleInstructions}>How to Play</button>
      {showInstructions && (
        <div className="instructions">
          <h3>How to Play</h3>
          <p>Answer the question to place your X or O.</p>
          <p>After answering a question, an X will be randomly placed on the board.</p>
          <p>The computer (O) will take its turn automatically.</p>
          <p>The first player to get three Xs or Os in a row (horizontally, vertically, or diagonally) wins the game.</p>
        </div>
      )}
      <Questions />
      {data ? (
        <div className="game-container">
          <div className="game-info">
            <button className="restart-btn" onClick={restartGame}>Restart Game</button>
            <p>{data.message}</p>
            {data.question && <p className="question">{decode(data.question)}</p>}
            {data.question && (
              <div>
                <input
                  type="text"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Your answer..."
                />
                <button className="submit-btn" onClick={handleAnswerSubmit}>Submit Answer</button>
              </div>
            )}
            <p className="response-message">{responseMessage}</p>
          </div>
          <div className="board">
            {data.board && data.board.map((cell, index) => (
              <div
                key={index}
                className={`cell ${cell === 'X' ? 'x' : cell === 'O' ? 'o' : ''} ${selectedBox === index ? 'selected' : ''}`}
                onClick={() => handleCellClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>
          {data.question && !selectedBox && <p>Select a box to place your X</p>}
          {selectedBox !== -1 && <button className="submit-btn" onClick={handleBoxSelection}>Place X</button>}
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default TicTacToeGame;
