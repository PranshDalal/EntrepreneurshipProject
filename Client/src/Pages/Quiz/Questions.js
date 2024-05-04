import React, { useState } from 'react';
import {decode} from 'html-entities';
import axios from 'axios';
import './Questions.css';

const Questions = () => {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSelectedAnswer('');
    setShowCorrectAnswer(false);

    try {
      const response = await axios.get(`http://localhost:3001/api/question/multiple/${category}/${difficulty}`);
      setQuestionData(response.data);
      setLoading(false);
      setCategory('');
      setDifficulty('');
    } catch (error) {
      console.error('Error fetching question:', error);
      setError('Failed to fetch question. Please try again.');
      setLoading(false);
    }
  };

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    setShowCorrectAnswer(true);
  };

  return (
    <div className={`questions-container`}>
      <form onSubmit={handleSubmit} className={`form`}>
        <label>
          Category:
          <input
            type="number"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <br />
        <button type="submit" className="submit-button">
          Get Question
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Questions;