import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Col, Row, Card, Form, ButtonToolbar, Button, Alert } from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import Toast from './Toast.jsx';
import store from './store.js';

export default class IssueEdit extends React.Component {

    static async fetchData(match, search, showError) {
        const query = `query issue($id: Int!) {
            issue(id: $id) {
                    id title status owner
                    effort created due description
                }
            }`;

        let { params: { id } } = match;
        id = parseInt(id);
        const result = await graphQLFetch(query, { id }, showError);
        return result;
    }

    constructor() {
        super();
        const issue = store.initialData ? store.initialData.issue : null;
        delete store.initialData;


        this.state = {
            issue,
            invalidFields: {},
            showingValidation: false,
            toastVisible: false,
            toastMessage: '',
            toastType: 'success'
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onValidityChange = this.onValidityChange.bind(this);
        this.showValidation = this.showValidation.bind(this);
        this.dismissValidation = this.dismissValidation.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        const { match: { params: { id: prevId } } } = prevProps;
        const { match: { params: { id } } } = this.props;
        if (id !== prevId) {
            this.loadData();
        }
    }

    onChange(event, naturalValue) {
        const { name, value: textValue } = event.target;
        const value = naturalValue === undefined ? textValue : naturalValue;
        this.setState(prevState => ({
            issue: { ...prevState.issue, [name]: value },
        }));
    }

    async handleSubmit(e) {
        e.preventDefault();

        // show validation on submit, as the validationMessage is checking whether to fill the message
        this.showValidation();
        const { issue, invalidFields } = this.state;

        // count the length of keys in invalidFields object, if so there are invalid fiels
        if (Object.keys(invalidFields).length !== 0) return;

        const query = `mutation issueUpdate($id:Int!, $changes: IssueUpdateInputs!){
            issueUpdate(id:$id, changes:$changes) {
              id title status owner effort created due description
            }
        }`;

        // get id and created from the issue, and catch rest in changes variable
        // because we dont want to adjust id and created
        const { id, created, ...changes } = issue;
        const data = await graphQLFetch(query, { id, changes });
        if (data) {
            this.setState({ issue: data.issueUpdate });
            this.showSuccess('Updated issue successfully');
        }
    }

    onValidityChange(event, valid) {
        const { name } = event.target;
        this.setState((prevState) => {
            const invalidFields = { ...prevState.invalidFields, [name]: !valid };
            if (valid) delete invalidFields[name];
            return { invalidFields };
        })
    }

    async loadData() {
        const { match } = this.props;
        const data = await IssueEdit.fetchData(match, null, this.showError);
        this.setState({ issue: data ? data.issue : {}, invalidFields: {} });
    }

    showValidation() {
        this.setState({ showingValidation: true });
    }
    dismissValidation() {
        this.setState({ showingValidation: false });
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
        const { issue } = this.state;
        if (issue === null) return null;

        const { issue: { id } } = this.state;
        const { match: { params: { id: propsId } } } = this.props;
        const { toastVisible, toastMessage, toastType } = this.state;
        if (id == null) {
            if (propsId != null) {
                return <h3>{`Issue with ID ${propsId} not found.`}</h3>;
            }
            return null;
        }

        const { invalidFields, showingValidation } = this.state;
        let validationMessage;

        if (Object.keys(invalidFields).length !== 0 && showingValidation) {
            validationMessage = (
                <Alert variant="danger" onClose={this.dismissValidation} dismissible>
                    Please correct invalid fields before submitting.
                </Alert>
            );
        }

        const { issue: { title, status } } = this.state;
        const { issue: { owner, effort, description } } = this.state;
        const { issue: { created, due } } = this.state;

        return (
            <Card>
                <Card.Header>
                    <Card.Title>{`Editing issue: ${id}`}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group as={Row}>
                            <Col as={Form.Label} sm={3}>Created</Col>
                            <Col sm={9}>
                                <Form.Control readOnly defaultValue={created.toDateString()}>

                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col as={Form.Label} sm={3}>Status</Col>
                            <Col sm={9}>
                                <Form.Control as="select" name="status" value={status} onChange={this.onChange}>
                                    <option value="New">New</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Fixed">Fixed</option>
                                    <option value="Closed">Closed</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col as={Form.Label} sm={3}>Owner</Col>
                            <Col sm={9}>
                                <Form.Control as={TextInput}
                                    name="owner"
                                    value={owner}
                                    onChange={this.onChange}
                                    key={id} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col as={Form.Label} sm={3}>Effort</Col>
                            <Col sm={9}>
                                <Form.Control as={NumInput}
                                    name="effort"
                                    value={effort}
                                    onChange={this.onChange}
                                    key={id} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} feedback={invalidFields.due ? 'error' : null}>
                            <Col as={Form.Label} sm={3}>Due</Col>
                            <Col sm={9}>
                                <Form.Control as={DateInput}
                                    onValidityChange={this.onValidityChange}
                                    name="due"
                                    value={due}
                                    onChange={this.onChange}
                                    key={id} />
                                <Form.Control.Feedback />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col as={Form.Label} sm={3}>Title</Col>
                            <Col sm={9}>
                                <Form.Control as={TextInput}
                                    name="title"
                                    value={title}
                                    onChange={this.onChange}
                                    key={id} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col as={Form.Label} sm={3}>Description</Col>
                            <Col sm={9}>
                                <Form.Control as={TextInput}
                                    tag="textarea"
                                    name="description"
                                    value={description}
                                    onChange={this.onChange}
                                    key={id} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col smoffset={3} sm={6}>
                                <ButtonToolbar>
                                    <Button variation="primary" type="submit">Submit</Button>
                                    <LinkContainer to="/issues">
                                        <Button variantion="link">Back</Button>
                                    </LinkContainer>
                                </ButtonToolbar>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col sm={{ span: 9, offset: 3 }} > {validationMessage}</Col>
                        </Form.Group>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Link to={`/edit/${id - 1}`}>Prev</Link>
                    {' | '}
                    <Link to={`/edit/${id + 1}`}>Next</Link>
                </Card.Footer>
                <Toast
                    showing={toastVisible}
                    onClose={this.dismissToast}
                    variant={toastType}
                >{toastMessage}</Toast>
            </Card>
        );
    }
}