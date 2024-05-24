import React, { useState } from "react";
import { decode } from 'html-entities';

import './MultipleChoice.css';

function MultipleChoice({ options, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    onAnswer(selectedOption);
  };

  function handleChange(option) {
    setSelectedOption(option);
  }


  return (
    <form onSubmit={handleSubmit}>
      <div className="options-container">
        {options.map((option, index) => (
          <div key={index}>
            <input
              id={`option-${index}`}
              type="radio"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleChange(option)}
              className="option-input"
            />
            <label htmlFor={`option-${index}`} className="option-label">
              <span className="option-text">{decode(option)}</span>
            </label>
          </div>
        ))}
      </div>
      <button type="submit" className="streaks-submit-button">Submit</button>
    </form>
  );
}

export default MultipleChoice;