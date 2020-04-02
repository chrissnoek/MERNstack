import React, { Component } from 'react';
import { Alert, Collapse } from 'react-bootstrap';

export default class Toast extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidUpdate() {
        const { showing, onClose } = this.props;
        if (showing) {
            clearTimeout(this.dismissTimer);
            this.dismissTimer = setTimeout(onClose, 5000);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.dismissTimer);
    }

    render() {
        const { showing, variant, onClose, children } = this.props;
        return (
            <Collapse in={showing}>
                <div style={{ position: 'fixed', bottom: 20, left: 20 }}>
                    <Alert variant={variant} onClose={onClose} dismissible>{children}</Alert>
                </div>
            </Collapse>
        );
    }
}
