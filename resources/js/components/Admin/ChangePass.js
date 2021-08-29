import React, { Component } from 'react';
import '../../../css/login.css'
import CommonMiddleware from '../../utils/CommonMiddleware';
import ShowSuccess from "../../components/ShowSuccess";
import CommonLanguage from "../../utils/CommonLanguage";

class ChangePass extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            current_password: '',
            password: '',
            password_confirmation: '',
            message: '',
            isActive: false,
            dataDismiss: false,
            isSubmit: true,
        };
        this.CommonMiddleware = new CommonMiddleware();
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            vi: {
                changepass: 'Đổi mật khẩu',
                current: 'Mật khẩu hiện tại',
                password: 'Mật khẩu mới',
                confirmation: 'Xác nhận mật khẩu',
                change: 'Thay đổi',
                notification: 'Vui lòng không để trống',
                successful_change: 'Đổi mật khẩu thành công'
            },
            en: {
                changepass: 'CHANGE PASSWORD',
                current: 'Current Password',
                password: 'New Password',
                confirmation: 'Password Confirmation',
                change: 'Change Password',
                notification: 'Please do not leave it blank',
                successful_change: 'Change password successfully'
            }
        }
    }

    handleInput = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };
    handleSubmit = async () => {
        const param = {
            current_password: this.state.current_password,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation
        };
        const result = await this.CommonMiddleware.changePass(param)
        if (result.status === 200) {
            this.setState({
                dataDismiss: true,
                isActive: true,
                current_password: '',
                password: '',
                password_confirmation: '',
                message: ''
            });
            setTimeout(
                function () {
                    const container = document.getElementById("changePass");
                    container.remove();
                    let backdroup = document.querySelectorAll(".modal-backdrop.fade.show")
                    for (let i of backdroup) {
                        i.classList.remove("modal-backdrop")
                    }
                }
                    .bind(this),
                1000
            );
        } else {
            this.setState({
                ...this.state,
                message: result.message || '',
            });
        }
        setTimeout(
            function () {
                this.setState({ isActive: false });
            }
                .bind(this),
            500
        );
    };
    handleKey = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit()
        }
    };
    // modalSubmit = () => {
    //     return (
    //         <div className="container-pass">
    //             <div className="modal-pass">
    //                 <div className="modal-content">
    //                     <div className="modal-body center_Child">
    //                         <img src='../../images/Group95.png' alt={'Key icon'} />
    //                         <p className="text-confirm text-center">Đổi mật khẩu thành công</p>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // };

    render() {
        let language = this.currentLanguages;
        return (
            <div className="form-change">
                <form>
                    <h1 className="title">{this.CONSTANT_TEXT[language].changepass}</h1>
                    <div className="control pass">
                        <label htmlFor="psw">{this.CONSTANT_TEXT[language].current}</label>
                        <input name="current_password" value={this.state.current_password} onChange={this.handleInput}
                            type="password" />
                        {this.state.message ? <p className="message">{this.state.message.current_password}</p> : ''}
                        <label className={this.state.isSubmit ? "d-none" : "d-block text-danger"}>{this.CONSTANT_TEXT[language].notification}</label>
                    </div>
                    <div className="control pass">
                        <label htmlFor="psw">{this.CONSTANT_TEXT[language].password}</label>
                        <input name="password" value={this.state.password} onChange={this.handleInput} type="password" />
                        {this.state.message ? <p className="message">{this.state.message.password}</p> : ''}
                        <label className={this.state.isSubmit ? "d-none" : "d-block text-danger"}>{this.CONSTANT_TEXT[language].notification}</label>
                    </div>
                    <div className="control pass">
                        <label htmlFor="psw">{this.CONSTANT_TEXT[language].confirmation}</label>
                        <input name="password_confirmation" value={this.state.password_confirmation}
                            onChange={this.handleInput} onKeyPress={this.handleKey} type="password" />
                        {this.state.message ?
                            <p className="message">{this.state.message.password_confirmation}</p> : ''}
                        <label className={this.state.isSubmit ? "d-none" : "d-block text-danger"}>{this.CONSTANT_TEXT[language].notification}</label>
                    </div>
                    <div className="control">
                        {this.state.dataDismiss ? <button type="button"
                            data-bs-dismiss="modal"
                            onClick={() => this.handleSubmit()}
                            className="btn btn-block change-password">{this.CONSTANT_TEXT[language].change}</button> : <button type="button"
                                onClick={() => this.handleSubmit()}
                                className="btn btn-block change-password">{this.CONSTANT_TEXT[language].change}</button>}
                    </div>
                </form>
                {this.state.isActive ? <ShowSuccess textConfirm={this.CONSTANT_TEXT[language].successful_change} /> : null}
            </div>

        );
    }
}

export default ChangePass;
