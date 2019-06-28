import React, { Component } from 'react';
import MaterialTable from 'material-table';
import AuthContext from '../context/auth-context';

import { GetFormattedDate } from '../helpers/date-helper';
import { SubscriptionsQuery, CompaniesQuery, AddNewOrEditSubscriptionQuery, RemoveQuery, GraphQlRequestWithToken } from '../graphql-queries/api-queries';

class SubscriptionPage extends Component {

    state = {
        columns: [
            { title: 'Description', field: 'name' },
            { title: 'Period', field: 'period', lookup: { 'Yearly': 'Yearly', 'Monthly': 'Monthly', 'Weekly': 'Weekly' } },
            { title: 'Subscription Date', field: 'subscriptionDate', type: 'date' }
          ],
        data: []
    };

    static contextType = AuthContext;

    handleAddOrEditSubscription = (newData) => {
        const query = AddNewOrEditSubscriptionQuery(
            newData.name,
            newData.subscription,
            newData.period,
            new Date(newData.subscriptionDate).toISOString(),
            newData.subscriptionId ? newData.subscriptionId : "");

        this.makeRequestAndValidate(query)
    }

    handleRemoveSubscription = (subscriptionId) => {
        this.makeRequestAndValidate(RemoveQuery(subscriptionId));
    }

    makeRequestAndValidate = (reqBody) => {
        GraphQlRequestWithToken(reqBody, this.context.token)
        .catch(err => this.setErrorMessage);
    }

    setErrorMessage = () => {
        this.setState({ hasError: true, errorMessage: "Oops! Something's wrong..."});
    }

    componentDidMount(){
        // get all subscriptions for user
        GraphQlRequestWithToken(SubscriptionsQuery, this.context.token)
        .then(res => {
            if(res.status !== 200  && res.status !== 201){
                this.setState({ hasError: true, errorMessage: "Oops! Something's wrong..."});
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if(resData.data.subscriptions && resData.data.subscriptions.length > 0){
                const subscriptions = resData.data.subscriptions.map(subscription => {
                    return {
                        name: subscription.name,
                        subscription: subscription.company._id,
                        period: subscription.period,
                        subscriptionDate: GetFormattedDate(subscription.date),
                        subscriptionId: subscription._id
                    };
                });

                this.setState({ data: subscriptions });
            }
        })
        .catch(err => this.setErrorMessage);

        // fetch existing companies list
        GraphQlRequestWithToken(CompaniesQuery, this.context.token)
        .then(res => {
            if(res.status !== 200  && res.status !== 201){
                this.setState({ hasError: true, errorMessage: "Oops! Something's wrong..."});
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if(resData.data.companies && resData.data.companies.length > 0){
                const compObj = {};
                resData.data.companies.forEach(comp => {
                    compObj[comp._id] = comp.name;
                });

                const columns = [{
                    title: 'Subscription',
                    field: 'subscription',
                    lookup: compObj
                }].concat(this.state.columns);

                this.setState({ columns: columns });
            }
        })
        .catch(err => this.setErrorMessage);
    }

    render(){
        return (
            <MaterialTable
              title="My subscriptions"
              columns={this.state.columns}
              data={this.state.data}
              editable={{
                onRowAdd: newData =>
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      const data = [...this.state.data];
                      data.push(newData);
                      this.handleAddOrEditSubscription(newData);
                      this.setState({ ...this.state, data });
                    }, 600);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      const data = [...this.state.data];
                      data[data.indexOf(oldData)] = newData;
                      this.handleAddOrEditSubscription(newData);
                      this.setState({ ...this.state, data });
                    }, 600);
                  }),
                onRowDelete: oldData =>
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      const data = [...this.state.data];
                      data.splice(data.indexOf(oldData), 1);
                      this.handleRemoveSubscription(oldData.subscriptionId);
                      this.setState({ ...this.state, data });
                    }, 600);
                  }),
              }}
            />
          );
    }
}

export default SubscriptionPage;