import React from 'react';
import AuthContext from '../../context/auth-context';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const MainNavigation = props => (

    <AuthContext.Consumer>
        {(context) => {
            return (
                <header className="main-navigation">
                    <div>
                        <img className="main-navigation__logo" src="fatigue.jpg" alt="Subscription Fatigue"/>
                    </div>
                    <nav className="main-navigation__items">
                        <ul>
                            <li>
                                <NavLink to="/channels">Channles</NavLink>
                            </li>
                            {context.token && (
                                <React.Fragment>
                                    <li>
                                    <NavLink to="/subscriptions">My Subscriptions</NavLink>
                                    </li>
                                    <li><button onClick={context.logout}>Logout</button></li>
                                </React.Fragment>
                            )}
                            
                            {!context.token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
                        </ul>
                    </nav>
                </header>
            );
        }} 
        
    </AuthContext.Consumer>

);

export default MainNavigation;