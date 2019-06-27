import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from '../src/pages/Auth';
import SubscriptionsPage from '../src/pages/Subscriptions';
import ChannelsPage from '../src/pages/Channels';
import MainNavigation from '../src/components/navigation/MainNavigation';
import AuthContext from '../src/context/auth-context';

import './App.css';

class App extends Component {

  state = {
    token: null,
    userId: null,
    userName: null
  };

  login = (token, tokenExpiration, userId, userName) => {
    this.setState({ token, userId, userName });
  };

  logout = () => {
    this.setState({ token: null, userId: null, userName: null });
  };

  render(){
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider 
            value={{ 
              token: this.state.token, 
              userId: this.state.userId, 
              userName: this.state.userName, 
              login: this.login, 
              logout: this.logout }}
          >
            <MainNavigation/>
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/auth" exact />}
                {this.state.token && <Redirect from="/" to="/subscriptions" exact />}
                {this.state.token && <Redirect from="/auth" to="/subscriptions" exact />}
                {!this.state.token && <Redirect from="/subscriptions" to="/auth" exact />}
                {this.state.token && <Route path="/subscriptions" component={SubscriptionsPage} />}
                <Route path="/channels" component={ChannelsPage} />
                {!this.state.token && <Route path="/auth" component={AuthPage} />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
