import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { decode } from 'html-entities';

import MultipleChoice from '../../Components/MultipleChoiceBox/MultipleChoice';

import './Streaks.css';
import Questions from '../../Components/Questions/Questions';

function Streaks() {
  const [data, setData] = useState(null);
  const [question, setQuestion] = useState('');
  const [streak, setCurrentStreak] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:3001/api/streaks/response", { withCredentials: true })
    .then(res => res.data)
    .then(data => {
      // console.log(data);
      setData(data);

      if (data.response_code && data.response_code !== 0) { 
        setResponseMessage("There was an error. Please slow down.");
        return;
      }

      setAnswers(data.answers);
      setQuestion(data.question);

      setCurrentStreak(data.current_streak);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  function handleAnswerSubmit(answer) {
    fetch("http://localhost:3001/api/streaks/response", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        answer: answer
      })
    })
    .then(res => res.json())
      .then(data => {
        setResponseMessage(data.message);
        fetchData();
      })
    }

    async function restartGame() {
    await fetch("http://localhost:3001/api/streaks/restart", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    
    fetchData()
    setResponseMessage('Game restarted!');
  }

  return (
    <div className='streaks-container'>
      <h1 className='header'>Streaks</h1>
      <button className='how-to-play-btn' onClick={() => setShowInstructions(!showInstructions)}>How to Play</button>
      {showInstructions && (
        <div className='instructions'>
          <h2>How to Play</h2>
          <p>Streaks is a game where you try to answer as many questions correctly in a row as possible.</p>
          <p>For each correct answer, your streak will increase by 1. If you answer incorrectly, your streak will reset to 0.</p>
          <p>Try to get the highest score!</p>
        </div>
      )}
      {data ? (
        <div className='streaks-game-container'>
          <div className='streaks-game-info-container'>
            <button className='streaks-restart-button' onClick={restartGame}>Restart Game</button>
            <div className='question center'>

              <h5 className='text-primary'>Current Streak: {streak}</h5>
            <p>{data.message}</p>
              {data.question && <h3 className='text-primary'>{decode(question)}</h3>}
            <p className="response-message center">{responseMessage}</p>
            </div>
            <MultipleChoice options={data.possible_answers} onAnswer={handleAnswerSubmit} />
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default Streaks;