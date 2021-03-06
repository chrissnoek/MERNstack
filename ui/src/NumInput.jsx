import React, { Component } from 'react';

function format(num) {
    return num != null ? num.toString() : "";
}

function unformat(str) {
    const val = parseInt(str, 10);
    return Number.isNaN(val) ? null : val;
}

class NumInput extends Component {
    constructor(props) {
        super();
        // set the state with a string value
        this.state = { value: format(props.value) }
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onChange(e) {
        if (e.target.value.match(/^\d*$/)) {
            this.setState({ value: e.target.value })
        }
    }

    onBlur(e) {
        // call parent componets 'onChange' method
        const { onChange } = this.props;
        const { value } = this.state;
        onChange(e, unformat(value));
    }

    render() {
        const { value } = this.state;
        return (
            <input
                type="text"
                {...this.props}
                value={value}
                onBlur={this.onBlur}
                onChange={this.onChange}
            />
        );
    }
}

export default NumInput;