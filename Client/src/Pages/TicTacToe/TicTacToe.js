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
        answer: answer,
        move_position: selectedBox
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

  const handleCellClick = (index) => {
    if (!data.board[index].trim() && data.question) {
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
        fetchData();
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
          <p>Answer the question to get a chance to make a move</p>
          <p>After answering a question, select a box and press the place x button</p>
          <p>If the answer is incorrect, you will get more chances to answer it again</p>
          <p>The computer will make its move automatically</p>
          <p>The game will continue until you or the computer wins, or a draw</p>
        </div>
      )}
      <div className="questions-container">
        <Questions />
      </div>
        
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
          {data.question && selectedBox === -1 && <p>Select a box to place your X</p>}
          {selectedBox !== -1 && <button className="submit-btn" onClick={handleAnswerSubmit}>Place X</button>}
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default TicTacToeGame;
