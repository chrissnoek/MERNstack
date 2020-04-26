import React from 'react';
import store from './store.js';
import graphQLFetch from './graphQLFetch.js';

export default class About extends React.Component {
    static async fetchData() {
        const data = await graphQLFetch('query {about}');
        return data;
    }

    constructor(props) {
        super(props);
        // when ssr the initialData is set, otherwise set to null
        const apiAbout = store.initialData ? store.initialData : null;
        delete store.initialData;

        this.state = {
            apiAbout: apiAbout.about
        }
    }

    async componentDidMount() {
        const { apiAbout } = this.state;
        if (apiAbout === null) {
            // static functions get called by the class, instead of this.fetchData();
            const data = await About.fetchData();
            this.setState({ apiAbout: data.about });
        }
    }

    render() {
        const { apiAbout } = this.state;
        return (
            <div className="text-center">
                <h3>Issue Tracker version 0.9</h3>
                <h4>
                    {apiAbout}
                </h4>
            </div>
        )
    }
}