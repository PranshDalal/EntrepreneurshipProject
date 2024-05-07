import React from "react";
import { NavLink } from "react-router-dom";

import './Navbar.css'

const Navbar = ({ loggedIn, handleLogout, userPoints }) => {
    const commonItems = (
        <>
            <li>
                <NavLink to="/" activeclassname="active">
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/questions" activeclassname="active">
                    Quiz
                </NavLink>
            </li>
        </>
    )

    const loggedInItems = (
        <>
            <li>
                <NavLink to="/leaderboard" activeClassName="active">
                    Leaderboard
                </NavLink>
            </li>
            <li>
                <NavLink to="/tictactoe" activeClassName="active">
                    Tic Tac Toe
                </NavLink>
            </li>
            <li>
                <span className="points-text">Points: {userPoints}</span>
            </li>
            <li>
                <button className="sign-out-btn" onClick={handleLogout}>Sign Out</button>
            </li>
        </>
    );
    

    const guestItems = (
        <>
            <li>
                <NavLink to="/login" activeclassname="active">
                    Login
                </NavLink>
            </li>
            <li>
                <NavLink to="/register" activeclassname="active">
                    Register
                </NavLink>
            </li>
        </>
    );


    return (
        <nav className="navbar">
            <ul>
                {commonItems}
                {loggedIn ? loggedInItems : guestItems}
            </ul>
        </nav>
    );
};

export default Navbar;