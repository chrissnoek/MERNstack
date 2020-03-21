import React, { Component } from 'react';

function format(text) {
    // if there is text filled in, return the text, else return empty string
    return (text != null) ? text : '';
}

function unformat(text) {
    // if there is no tekst filled in, return null, else return the text
    return text.trim().length === 0 ? null : text;
}

export default class TextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: format(props.value)
        }
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onChange(e) {
        this.setState({ value: e.target.value });
    }

    onBlur(e) {
        const { onChange } = this.props;
        const { value } = this.state;
        onChange(e, unformat(value));
    }

    render() {
        const { value } = this.state;
        const { tag = 'input', ...props } = this.props;

        return React.createElement(tag, {
            ...props,
            value,
            onBlur: this.onBlur,
            onChange: this.onChange
        })

    }
}
