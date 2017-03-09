import React, {Component} from 'react';
import {Header, Footer} from '../modules/base';

export default class App extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="app">
                <Header />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}
