import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, BrowserRouter, Link } from "react-router-dom";
import '../../css/login.css'
import CommonMiddleware from '../utils/CommonMiddleware';
import Cookies from 'js-cookie'
import ImgBackHome from '../../../public/images/back-to-home.png'
import CommonLanguage from "../utils/CommonLanguage";


class Login extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            vi: {
                login: 'Đăng nhập',
                userName: 'Tên tài khoản',
                password: 'Mật khẩu'
            },
            en: {
                login: 'Login',
                userName: 'User name',
                password: 'Password'
            }
        }
        this.state = {
            username: '',
            password: '',
            error_message: '',
            authToken: '',
            loginSucess: false,
            loaderButton: false
        }
        this.CommonMiddleware = new CommonMiddleware();
    }
    getInput = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleSubmit = async () => {
        const params = {
            username: this.state.username,
            password: this.state.password
        };
        this.setState({
            loaderButton: true
        })
        const resultLogin = await this.CommonMiddleware.login(params);
        if (resultLogin.status === 200) {
            Cookies.set('token', "Bearer " + resultLogin.token || '');
            Cookies.set('authUser', JSON.stringify(resultLogin.user) || null);
            this.setState({
                authToken: resultLogin.token,
                loginSucess: true,

            });
        } else {
            this.setState({
                ...this.state,
                error_message: resultLogin.error_message || '',
            });
        }
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit()
        }
    }
    render() {
        let language = this.currentLanguages;
        if (Cookies.get('token')) {
            return (
                <Redirect to="/admin" />
            )
        }
        return (
            <section>
                <Link to="/"><img className='back-to-home' src={ImgBackHome} /></Link>
                <div className="form-container">
                    <h1 className="title">{this.CONSTANT_TEXT[language].login}</h1>
                    <form>
                        <div className="control control-login">
                            <label htmlFor="username">{this.CONSTANT_TEXT[language].userName}</label>
                            <input name="username" onChange={this.getInput} type="text" id="username" />
                        </div>
                        <div className="control control-login">
                            <label htmlFor="psw">{this.CONSTANT_TEXT[language].password}</label>
                            <input name="password" onKeyPress={this.handleKeyDown} onChange={this.getInput}
                                type="password" />
                        </div>
                        <div className="control control-login">
                            <input type="button" onClick={this.handleSubmit} className="input-login" value="Login" />
                            &nbsp;
                            {this.state.loaderButton ? <span className="loading-search spinner-grow spinner-grow-lg" role="status" aria-hidden="true"></span> : ''}
                        </div>
                    </form>
                    {this.state.error_message ? <div className="error">{this.state.error_message}</div> : null}
                </div>
                <Switch>
                    {this.state.authToken ? <Redirect to="/admin" /> : ''}
                </Switch>
            </section>
        );
    }
}

export default Login;
