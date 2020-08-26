import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export default class ColoredScrollbars extends Component {

    constructor(props, ...rest) {
        super(props, ...rest);
        this.renderThumb = this.renderThumb.bind(this);
    }

    renderThumb({ style, ...props }) {
        const thumbStyle = {
            backgroundColor: "#4f5b62",
            borderRadius: '25px'
        };
        return (
            <div
                style={{ ...style, ...thumbStyle }}
                {...props}/>
        );
    }

    render() {
        return (
            <Scrollbars
                renderThumbHorizontal={this.renderThumb}
                renderThumbVertical={this.renderThumb}
                {...this.props}/>
        );
    }
}