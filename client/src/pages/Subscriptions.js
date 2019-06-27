import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

import TableComponent from '../components/Table';

class SubscriptionsPage extends Component {
    state = {
        subscriptions: []
    };

    static contextType = AuthContext;

    componentDidMount(){

        const reqBody = `
            query {
                subscriptions {
                    name,
                    company {
                        name
                    },
                    period,
                    date
                }
            }
        `;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify({ query : reqBody}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.context.token}`
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
            if(resData.data.subscriptions && resData.data.subscriptions.length > 0){
                const subs = resData.data.subscriptions.map(subscription => {
                    return {
                        Subscription: subscription.name,
                        Company: subscription.company.name,
                        Period: subscription.period,
                        Date: subscription.date
                    };
                });

                this.setState({ subscriptions: subs });
            }
        })
        .catch(err => {
            this.setState({ hasError: true, errorMessage: "Oops! Something's wrong..."});
        });
    }

    render(){

        const tableData = {
            columns: ['Subscription', 'Company', 'Period', 'Date'],
            rows: this.state.subscriptions
          };

        return (
            <TableComponent data = {tableData} />
        )
    }
}

export default SubscriptionsPage;