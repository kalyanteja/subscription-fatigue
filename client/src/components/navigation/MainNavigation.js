import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const MainNavigation = props => (
    <header className="main-navigation">
        <div>
            <img className="main-navigation__logo" src="fatigue.jpg" alt="Subscription Fatigue"/>
        </div>
        <nav className="main-navigation__items">
            <ul>
                <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                </li>
                <li>
                    <NavLink to="/subscriptions">My Subscriptions</NavLink>
                </li>
            </ul>
        </nav>
    </header>
);

export default MainNavigation;