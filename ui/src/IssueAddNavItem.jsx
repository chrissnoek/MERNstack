import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Nav, Modal, Form, Button, ButtonToolbar, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FiPlus, FiMoreVertical } from 'react-icons/fi';

import graphQLFetch from './graphQLFetch.js';
import Toast from './Toast.jsx';

class IssueAddNavItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: false,
            toastVisible: false,
            toastMessage: '',
            toastType: 'success'
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
    }

    showModal() {
        this.setState({ showing: true });
    }
    hideModal() {
        this.setState({ showing: false });
    }

    showError(message) {
        this.setState({
            toastVisible: true, toastMessage: message, toastType: 'danger'
        });
    }

    dismissToast() {
        this.setState({ toastVisible: false });
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.hideModal();
        const form = document.forms.issueAdd;
        const issue = {
            owner: form.owner.value,
            title: form.title.value,
            due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
        };
        const query = `mutation issueAdd($issue: IssueInputs!) {
            issueAdd(issue:$issue) {
              id
            }
          }`;
        const data = await graphQLFetch(query, { issue }, this.showError);
        if (data) {
            const { history } = this.props;
            history.push(`/edit/${data.issueAdd.id}`);
        }
    }


    render() {
        const { showing } = this.state;
        const { toastVisible, toastMessage, toastType } = this.state;
        return (
            <React.Fragment>
                <Nav.Item onClick={this.showModal}>
                    <OverlayTrigger placement="left" delayShow={1000} overlay={<Tooltip id="create-issue">Create Issue</Tooltip>}>
                        <FiPlus />
                    </OverlayTrigger>
                </Nav.Item>
                <Modal keyboard show={showing} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonToolbar>
                            <Button type="button" variant="primary" onClick={this.handleSubmit}>Submit</Button>
                            <Button variant="link" onClick={this.hideModal}>Cancel</Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                </Modal>
                <Toast showing={toastVisible} onDismiss={this.dismissToast} variant={toastType}>{toastMessage}</Toast>
            </React.Fragment>
        );
    }
}

export default withRouter(IssueAddNavItem);