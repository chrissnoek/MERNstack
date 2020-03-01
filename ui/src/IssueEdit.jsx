import React from 'react';
import graphQLFetch from './graphQLFetch.js';

// eslint-disable-next-line react/prefer-stateless-function
export default class IssueEdit extends React.Component {
    constructor() {
        super();
        this.state = {
            issue: {}
        };

    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        let { match: { params: { id } } } = this.props;
        id = parseInt(id);


        const query = `query issue($id:Int!){
            issue(id:$id) {
                id
                title
                status
                owner
                effort
                created
                due
                description
            }
        }`;

        // fetch function expects an object
        console.log(id);
        const data = await graphQLFetch(query, { id });
        if (data) {
            this.setState({ issue: data.issue });
        } else {
            this.setState({ issue: {} });
        }
    }

    render() {
        const { issue } = this.state;
        console.log(issue);
        return (
            <div>
                <h3></h3>
                <pre>{issue.description}</pre>
            </div>
        );
    }
}