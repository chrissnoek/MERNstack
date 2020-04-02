import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, ButtonToolbar, InputGroup, Form, Row, Col } from 'react-bootstrap';
import URLSearchParams from 'url-search-params';

// eslint-disable-next-line react/prefer-stateless-function
class IssueFilter extends React.Component {

    constructor({ location: { search } }) {
        super();
        const params = new URLSearchParams(search);
        this.state = {
            status: params.get('status') || '',
            effortMin: params.get('effortMin') || '',
            effortMax: params.get('effortMax') || '',
            changed: false
        }
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.showOriginalFilter = this.showOriginalFilter.bind(this);
        this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
        this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
    }

    onChangeStatus(e) {
        this.setState({ status: e.target.value, changed: true });
    }

    onChangeEffortMax(e) {
        const effortString = e.target.value;
        //check if the value can be converted to a digit characters (\d), before updating the state
        if (effortString.match(/^\d*$/)) {
            this.setState({ effortMax: effortString, changed: true });
        }
    }

    onChangeEffortMin(e) {
        const effortString = e.target.value;
        //check if the value can be converted to a digit characters (\d), before updating the state
        if (effortString.match(/^\d*$/)) {
            this.setState({ effortMin: effortString, changed: true });
        }
    }

    applyFilter() {
        const { status, effortMax, effortMin } = this.state;
        const { history } = this.props;

        const params = new URLSearchParams();
        if (status) params.set('status', status);
        if (effortMax) params.set('effortMax', effortMax);
        if (effortMin) params.set('effortMin', effortMin);

        const search = params.toString() ? `?${params.toString()}` : '';

        history.push({
            pathname: '/issues',
            search
        })
    }

    componentDidUpdate(prevProps) {
        const { location: { search: prevSearch } } = prevProps;
        const { location: { search } } = this.props;
        if (prevSearch !== search) {
            this.showOriginalFilter();
        }
    }

    showOriginalFilter() {
        const { location: { search } } = this.props;
        const params = new URLSearchParams(search);
        this.setState({
            status: params.get('status') || '',
            effortMin: params.get('effortMin') || '',
            effortMax: params.get('effortMax') || '',
            changed: false
        });
    }

    render() {
        const { status, changed, effortMax, effortMin } = this.state;
        return (
            <Row>
                <Col xs={6} sm={4} md={3} lg={2}>
                    <Form.Group>
                        <Form.Label>
                            Status:
                    </Form.Label>
                        <Form.Control
                            as="select"
                            value={status}
                            onChange={this.onChangeStatus}>
                            <option value="">(All)</option>
                            <option value="New">New</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Fixed">Fixed</option>
                            <option value="Closed">Closed</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={6} sm={4} md={3} lg={2}>
                    <Form.Group>
                        <Form.Label>
                            Effort between:
                    </Form.Label>
                        <InputGroup>
                            <Form.Control value={effortMin} onChange={this.onChangeEffortMin} />
                            <InputGroup.Text>-</InputGroup.Text>
                            <Form.Control value={effortMax} onChange={this.onChangeEffortMax} />
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col xs={6} sm={4} md={3} lg={2}>
                    <Form.Group>
                        <Form.Label>
                            &nbsp;
                        </Form.Label>

                        <ButtonToolbar>
                            <Button size="sm" variant="primary" type="button" onClick={this.applyFilter}>Appy</Button>

                            <Button size="sm" type="button"
                                onClick={this.showOriginalFilter}
                                disabled={!changed}>
                                Reset
                            </Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Col>
            </Row>
        );
    }
}

// withRouter is providing history, location, match available as part of props for the onChagneStatus function
export default withRouter(IssueFilter);