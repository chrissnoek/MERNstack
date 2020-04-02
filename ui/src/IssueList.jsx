/* eslint "react/react-in-jsx-scope" : "off" */
/* globals React ReactDOM  */
/* eslint "react/jsx-no-undef":"off" */
/* eslint "react/no-multi-comp":"off" */
/* eslint "no-alert":"off" */

import React from 'react';
import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueDetail from './IssueDetail.jsx';
import graphQLFetch from './graphQLFetch.js';
import { Card } from 'react-bootstrap';
import Toast from './Toast.jsx';

// url search param polyfill for ie
import URLSearchParams from 'url-search-params';
import { Route } from 'react-router-dom';

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = {
            issues: [],
            toastVisible: false,
            toastMessage: '',
            toastType: 'info'
        }
        this.closeIssue = this.closeIssue.bind(this);
        this.deleteIssue = this.deleteIssue.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        const { location: { search: prevSearch } } = prevProps;
        const { location: { search } } = this.props;
        if (prevSearch !== search) {
            this.loadData();
        }
    }

    async loadData() {
        const { location: { search } } = this.props;
        const params = new URLSearchParams(search);
        const vars = {};
        if (params.get('status')) vars.status = params.get('status');

        const effortMin = parseInt(params.get('effortMin'), 10);
        if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
        const effortMax = parseInt(params.get('effortMax'), 10);
        if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;

        const query = `query issueList(
            $status:StatusType
            $effortMin:Int
            $effortMax:Int
        ){
        issueList(
            status:$status
            effortMin:$effortMin
            effortMax:$effortMax
        ) {
          id title status owner
          created effort due
        }
      }`;

        const data = await graphQLFetch(query, vars, this.showError);
        if (data) {
            this.setState({ issues: data.issueList });
        }
    }




    async closeIssue(index) {
        // use issueUpdate function, and hardcoding status to Closed
        const query = `mutation issueClose($id: Int!) {
        issueUpdate(id:$id, changes: {status:Closed}) {
          id title status owner effort created due description
        }
      }`;
        const { issues } = this.state;
        const data = await graphQLFetch(query, { id: issues[index].id }, this.showError);
        if (data) {
            this.setState((prevState) => {
                // make a copy of the previous state
                const newList = [...prevState.issues];
                // replace the issue with updated data
                newList[index] = data.issueUpdate;
                // return the new issuelist to setState
                return { issues: newList };
            })
        } else {
            this.loadData();
        }
    }

    async deleteIssue(index) {
        const query = `mutation issueDelete($id: Int!) {
            issueDelete(id:$id) 
      }`;

        const { issues } = this.state;
        const { location: { pathname, search }, history } = this.props;

        const { id } = issues[index];
        const data = await graphQLFetch(query, { id }, this.showError);

        if (data && data.issueDelete) {
            this.setState((prevState) => {
                // make a copy of the previous state
                const newList = [...prevState.issues];

                // if an issue is selected
                if (pathname === `/issues/${id}`) {
                    // redirect to main issue list, with active filter as search
                    history.push({ pathname: '/issues', search })
                }

                // update state without deleted issue
                newList.splice(index, 1);

                this.showSuccess(`Deleted issue ${id} successfully.`);
                // return the new issuelist to setState
                return { issues: newList };
            });
        } else {
            this.loadData();
        }

    }

    showSuccess(message) {
        this.setState({
            toastVisible: true, toastMessage: message, toastType: 'success'
        })
    }
    showError(message) {
        this.setState({
            toastVisible: true, toastMessage: message, toastType: 'danger'
        })
    }
    dismissToast() {
        this.setState({ toastVisible: false })
    }

    render() {
        const { issues } = this.state;
        const { match } = this.props;
        const { toastVisible, toastMessage, toastType } = this.state;


        return (
            <React.Fragment>
                <Card>
                    <Card.Header>
                        <Card.Title>Filter</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <IssueFilter />
                    </Card.Body>
                </Card>
                <IssueTable issues={issues} closeIssue={this.closeIssue} deleteIssue={this.deleteIssue} />


                <Route path={`${match.path}/:id`} component={IssueDetail} />

                <Toast
                    showing={toastVisible}
                    onClose={this.dismissValidation}
                    variant={toastType}
                >{toastMessage}</Toast>
            </React.Fragment>
        );
    }
}