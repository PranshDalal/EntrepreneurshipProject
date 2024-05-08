import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Streak = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/question/multiple/25/easy');
      setQuestions(response.data);
      console.log('Questions:', response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    if (currentQuestion === questions.length - 1) {
      // Game over logic
      // You can display the final score or redirect to another page
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div>
      <h1>Streak Game</h1>
      <p>Question {currentQuestion + 1} of {questions.length}</p>
      <p>Score: {score}</p>
      <p>Streak: {streak}</p>
      <p>{questions[currentQuestion]?.question}</p>
      <ul>
        {questions[currentQuestion]?.answers.map((answer, index) => (
          <li key={index} onClick={() => handleAnswer(answer)}>
            {answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Streak;