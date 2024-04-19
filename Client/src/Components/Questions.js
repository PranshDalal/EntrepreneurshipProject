import React, { useState } from 'react';
import axios from 'axios';
import './Questions.css';

const Questions = () => {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3001/api/question/multiple/${category}/${difficulty}`);
      setQuestion(response.data.question);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching question:', error);
      setLoading(false);
    }
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
      {loading ? (
        <p>Loading...</p>
      ) : question && (
        <div className={`question-result`}>
          <h2>Question:</h2>
          <p>{question}</p>
        </div>
      )}
    </div>
  );
};

export default Questions;
