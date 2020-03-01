/* eslint "react/react-in-jsx-scope" : "off" */
/* globals React ReactDOM  */
/* eslint "react/jsx-no-undef":"off" */
/* eslint "react/no-multi-comp":"off" */
/* eslint "no-alert":"off" */

import React from 'react';
import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';
import IssueDetail from './IssueDetail.jsx';
import graphQLFetch from './graphQLFetch.js';

// url search param polyfill for ie
import URLSearchParams from 'url-search-params';
import { Route } from 'react-router-dom';

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = {
            issues: []
        };
        this.createIssue = this.createIssue.bind(this);
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

        const data = await graphQLFetch(query, vars);
        if (data) {
            this.setState({ issues: data.issueList });
        }
    }

    async createIssue(issue) {
        // graphQL template to create issue in database, where $issue is the variable of the issue
        const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue:$issue) {
          id
        }
      }`;

        // fetch the graphql with the necessary headers, including the issue variable in the JSON Body
        // const response = await fetch("/graphql", {
        //   method: "POST",
        //   headers: { "Content-type": "application/json" },
        //   body: JSON.stringify({ query, variables: { issue } })
        // });
        // this.loadData();

        // the fetch function replaces the func above
        const data = await graphQLFetch(query, { issue });
        if (data) {
            this.loadData();
        }
    }

    render() {
        const { issues } = this.state;
        const { match } = this.props;

        return (
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable issues={issues} />
                <hr />
                <IssueAdd createIssue={this.createIssue} />
                <hr />
                <Route path={`${match.path}/:id`} component={IssueDetail} />
            </React.Fragment>
        );
    }
}