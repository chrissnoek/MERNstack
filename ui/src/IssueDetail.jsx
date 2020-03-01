/* eslint "react/react-in-jsx-scope" : "off" */
/* globals React ReactDOM  */
/* eslint "react/jsx-no-undef":"off" */
/* eslint "react/no-multi-comp":"off" */
/* eslint "no-alert":"off" */

import React from 'react';
import graphQLFetch from './graphQLFetch.js';

// url search param polyfill for ie
import URLSearchParams from 'url-search-params';

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = {
            issue: {}
        };
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        const { match: { params: { id: prevId } } } = prevProps;
        const { match: { params: { id } } } = this.props;
        if (prevId !== id) {
            this.loadData();
        }
    }

    async loadData() {
        let { match: { params: { id } } } = this.props;
        id = parseInt(id);


        const query = `query issue($id:Int!){
            issue(id:$id) {
            id description
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
        const { issue: { description } } = this.state;

        return (
            <div>
                <h3>Description</h3>
                <pre>{description}</pre>
            </div>
        );
    }
}