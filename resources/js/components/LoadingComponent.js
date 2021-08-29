import React, { Component } from 'react';
import '../../css/Loading.css'
import CommonLanguage from "../utils/CommonLanguage";

class LoadingComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            vi: {
                loading: 'Đang tải...'
            },
            en: {
                loading: 'Loading...'
            },
        }

    }

    render() {
        let language = this.currentLanguages;
        return (
            <div className="loading">
                <span className="spinner-border spinner-border-log" role="status" aria-hidden="true"></span>
                {this.CONSTANT_TEXT[language].loading}
            </div>
        );
    }
}

export default LoadingComponent;
