import React, { useState } from "react";
import { decode } from 'html-entities';

function MultipleChoice({ options, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    onAnswer(selectedOption);
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="options-container">
        {options.map((option, index) => (
          <label key={index} className="option-label">
            <input
              type="radio"
              value={decode(option)}
              checked={selectedOption === option}
              onChange={() => setSelectedOption(option)}
              className="option-input"
            />
            <span className="option-text">{option}</span>
          </label>
        ))}
      </div>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
}

export default MultipleChoice;