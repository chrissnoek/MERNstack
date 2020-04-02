import React, { Component } from 'react';

function displayFormat(date) {
    return (date != null) ? date.toDateString() : '';
}

function editFormat(date) {
    return (date != null) ? date.toISOString().substr(0, 10) : '';
}

function unformat(str) {
    const val = new Date(str);
    return Number.isNaN(val.getTime()) ? null : val;
}

class DateInput extends Component {
    constructor(props) {
        super();
        this.state = {
            value: editFormat(props.value),
            focused: false,
            valid: true
        }
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onFocus() {
        this.setState({ focused: true });
    }

    onBlur(e) {
        const { value, valid: oldValid } = this.state;
        const { onValidityChange, onChange } = this.props;
        const dateValue = unformat(value);
        // set valid to true, when value is empty or dateValue is not null
        const valid = value === '' || dateValue != null;
        if (valid !== oldValid && onValidityChange) {
            onValidityChange(e, valid);
        }
        this.setState({ focused: false, valid });
        if (valid) onChange(e, dateValue);
    }

    onChange(e) {
        if (e.target.value.match(/^[\d-]*$/)) {
            this.setState({ value: e.target.value });
        }
    }

    render() {
        const { valid, focused, value } = this.state;
        const { value: origValue, onValidityChange, ...props } = this.props;

        // only show the user-typed-in value (value)  if the value is invalid, or editing it
        const displayValue = (focused || !valid) ? value : displayFormat(origValue);

        return (
            <input
                {...props}
                value={displayValue}
                placeholder={focused ? 'yyy-mm-dd' : null}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChange={this.onChange}
            />
        );
    }
}

export default DateInput;