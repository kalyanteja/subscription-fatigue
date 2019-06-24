import React, { Component } from 'react';

import './Auth.css';

class AuthPage extends Component {

    state = {
        isLogin: true,
        hasError: false,
        errorMessage: ''
    };

    constructor(props){
        super(props);
        this.nameEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchHandler = () => {
        this.setState({
            isLogin: !this.state.isLogin,
            hasError: false,
            errorMessage: ""
        });
    };

    submitHandler = (event) => {
        this.setState({hasError: false});
        event.preventDefault();
        const name = this.state.isLogin ? undefined : this.nameEl.current.value;
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if((!this.state.isLogin && name.trim().length === 0)
         || email.trim().length === 0 
         || password.trim().length === 0){
            this.setState({ hasError: true, errorMessage: "Please check your inputs!"});
            return;
        }

        const reqBody = this.state.isLogin ?
            `query {
                login(email: "${email}", password: "${password}"){
                    token,
                    userName
                }
            }` :
            `mutation {
                createUser(userInput: {name: "${name}", email: "${email}", password: "${password}"}) {
                    _id,
                    email
                }
            }`;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify({ query : reqBody}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200  && res.status !== 201){
                this.setState({ hasError: true, errorMessage: "Oops! Something's wrong..."});
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
        })
        .catch(err => {
            this.setState({ hasError: true, errorMessage: "Oops! Something's wrong..."});
            console.log(err)
        });
    }

    render(){
        const nameField = (
            <div className="form-control">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" ref={this.nameEl}/>
            </div>
        );

        return (
            <React.Fragment>
                <h4 className="auth-heading">{this.state.isLogin ? 'Login' : 'Register'}</h4>
                <form className="auth-form" onSubmit={this.submitHandler}>
                    {!this.state.isLogin ? nameField : ''}
                    
                    <div className="form-control">
                        <label htmlFor="email">E-Mail</label>
                        <input type="email" id="email" ref={this.emailEl}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" ref={this.passwordEl} />
                    </div>
                    <div className="error-msg">
                        <small>{this.state.hasError ? this.state.errorMessage : ''}</small>
                    </div>
                    <div>
                        <button className="form-actions-button" type="submit">{this.state.isLogin ? 'Login' : 'Signup'}</button>
                        <button className="signup-login-link" type="button" onClick={this.switchHandler}>{this.state.isLogin ? 'New user? Signup!' : 'Already registered? Login'}</button>
                    </div>
                </form>

                
            </React.Fragment>
        );
    }
}

export default AuthPage;