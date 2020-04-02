import React from 'react';
import { Form, Button } from 'react-bootstrap';

export default class IssueAdd extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        const { createIssue } = this.props;
        e.preventDefault();
        const form = document.forms.issueAdd;
        const issue = {
            owner: form.owner.value,
            title: form.title.value,
            due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
        };
        createIssue(issue);
        form.owner.value = "";
        form.title.value = "";
    }

    render() {
        return (
            <Form inline name="issueAdd" onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Label>Owner:</Form.Label>
                    <Form.Control
                        name="owner"
                        placeholder="Owner"
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control name="title" placeholder="Title" />
                </Form.Group>
                <Button variation="primary" size="sm" type="submit">Add</Button>
            </Form>
        );
    }
}