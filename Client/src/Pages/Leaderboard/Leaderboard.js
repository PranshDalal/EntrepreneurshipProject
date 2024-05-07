import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get('http://localhost:3001/leaderboard');
            setLeaderboardData(response.data.leaderboard);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    return (
        <div className="leaderboard-container">
            <h1 className="leaderboard-heading">Leaderboard</h1>
            <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th className="leaderboard-header">Rank</th>
                            <th className="leaderboard-header">Username</th>
                            <th className="leaderboard-header">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((user, index) => (
                            <tr key={user.id} className="leaderboard-row">
                                <td className="leaderboard-data">{index + 1}</td>
                                <td className="leaderboard-data">{user.username}</td>
                                <td className="leaderboard-data">{user.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
