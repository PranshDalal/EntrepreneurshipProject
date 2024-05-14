import React, { useState } from 'react';
import { decode } from 'html-entities';
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
  const [questionGenerated, setQuestionGenerated] = useState(false);

  const categoryMapping = {
    'General Knowledge': 9,
    'Entertainment: Books': 10,
    'Entertainment: Film': 11,
    'Entertainment: Music': 12,
    'Entertainment: Musicals and Theaters': 13,
    'Entertainment: Television': 14,
    'Entertainment: Video Games': 15,
    'Entertainment: Board Games': 16,
    'Science and Nature': 17,
    'Science: Computers': 18,
    'Science: Math': 19,
    'Mythology': 20,
    'Sports': 21,
    'Geography': 22,
    'History': 23,
    'Politics': 24,
    'Art': 25,
    'Celebrities': 26,
    'Animals': 27,
    'Vehicles': 28,
    'Entertainment: Comics': 29,
    'Science: Gadgets': 30,
    'Entertainment: Japanese Manga and Anime': 31,
    'Entertainment: Cartoons and Animations': 32
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSelectedAnswer('');
    setShowCorrectAnswer(false);
    setQuestionGenerated(false);

    try {
      const response = await axios.get(`http://localhost:3001/api/question/multiple/${categoryMapping[category]}/${difficulty}`);
      setQuestionData(response.data);
      setLoading(false);
      setCategory('');
      setDifficulty('');
      setQuestionGenerated(true); 
      window.location.reload();
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
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select</option>
            {Object.keys(categoryMapping).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
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
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {questionGenerated && <p className="success-message">Questions successfully generated!</p>}
    </div>
  );
};

export default Questions;
