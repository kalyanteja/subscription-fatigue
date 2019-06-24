import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from '../src/pages/Auth';
import SubscriptionsPage from '../src/pages/Subscriptions';
import MainNavigation from '../src/components/navigation/MainNavigation';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation/>
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/subscriptions" component={SubscriptionsPage} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
