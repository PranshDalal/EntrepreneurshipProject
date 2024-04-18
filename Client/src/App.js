import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3001/api/message');

        const { message } = response.data;

        setMessage(message);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();

  }, []); 

  return (
    <div>
      <h1>Message from Flask:</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
