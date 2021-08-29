import React, { Component } from "react";
import { Redirect } from "react-router";
import "../../../css/NavbarAdmin.css";
import { FaBars, FaCaretDown, FaCog, FaGlobe, FaKey, FaSignOutAlt, FaUser } from "react-icons/fa";
import ChangePass from "./ChangePass";
import CommonMiddleware from "../../utils/CommonMiddleware";
import Cookies from 'js-cookie'
import CommonLanguage from "../../utils/CommonLanguage";
export default class Navbar extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loginSuccess: true,
            groupActionUser: false,
            groupActionSetting: false,
            isShow: true
        };
        this.CommonMiddleware = new CommonMiddleware();
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguage = this.CommonLanguage.getData();
        this.toggleContainer = React.createRef();
        this.CONSTANT_TEXT = {
            vi: {
                change_password: 'Đổi mật khẩu',
                logout: 'Đăng xuất',
                language: 'Ngôn ngữ',
                label_password: 'Chọn ngôn ngữ của bạn!',
                apply: 'Áp dụng',
                cancel: 'Hủy'
            },
            en: {
                change_password: 'Change Password',
                logout: 'Logout',
                language: 'Language',
                label_password: 'Choose the language you want!',
                apply: 'Apply',
                cancel: 'Cancel'
            }
        }
        this.currentLanguages = this.CommonLanguage.getData();
    }

    componentDidMount() {
        window.addEventListener('click', this.onClickOutsideHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onClickOutsideHandler);
    }

    onHandleMenu = (setMenu) => {
        this.setState({
            setMenu: setMenu,
        });
    };
    logout = async () => {
        const result = await this.CommonMiddleware.logout();
        if (result.status === 200) {
            // localStorage.removeItem("token");
            localStorage.clear();
            sessionStorage.clear();
            this.setState({
                loginSuccess: false,
            });
            Cookies.remove("authUser");
            Cookies.remove("token");
        }
    };

    onCloseMenu = () => {
        this.props.onCloseMenu()
    };
    onOpenActionUser = () => {
        this.setState(currentState => ({
            groupActionUser: !currentState.groupActionUser
        }));
        if (this.state.groupActionSetting === true) {
            this.setState({ groupActionSetting: false })
        }
    };
    onOpenActionSetting = () => {
        this.setState(currentState => ({
            groupActionSetting: !currentState.groupActionSetting
        }));
        if (this.state.groupActionUser === true) {
            this.setState({ groupActionUser: false })
        }
    };

    onClickOutsideHandler = (event) => {
        if (this.state.groupActionUser && !this.toggleContainer.current.contains(event.target)) {
            this.setState({ groupActionUser: false });
        }
        if (this.state.groupActionSetting && !this.toggleContainer.current.contains(event.target)) {
            this.setState({ groupActionSetting: false });
        }
    };
    setLanguage = (e) => {
        let value = e.target.value;
        this.currentLanguage = value;
    }
    changeLanguage = () => {
        if (this.CommonLanguage.getData() != this.currentLanguage) {
            sessionStorage.setItem('language', this.currentLanguage);
            window.location.reload();
        }
    }
    render() {
        let language = this.currentLanguages;
        let url = window.location.href.split('/')[5];
        let urlName = '';
        if (url) {
            urlName = url.replace('-', ' ')
        }
        if (language === 'vi') {
            switch (urlName) {
                case 'list hotel': urlName = 'khách sạn';
                    break;
                case 'service': urlName = 'dịch vụ';
                    break;
                case 'bed': urlName = 'giường';
                    break;
                case 'user': urlName = 'Tài khoản';
                    break;
                case 'page': urlName = 'trang';
                    break;
                case 'config': urlName = 'cấu hình';
                    break;
                default: urlName = '';
            }
        }
        return (
            <>
                <div className="navbar-admin">
                    <div className='group-navbar'>
                        <div className='bars-menu' onClick={() => this.onCloseMenu()}>
                            <FaBars />
                        </div>
                        <div className="navbar-admin-label">
                            <p>{urlName}</p>
                        </div>
                    </div>
                    <div className='group-navbar' ref={this.toggleContainer}>
                        <div className='group-user' onClick={this.onOpenActionUser}>
                            <div className="icon-user">
                                <img src='../../../images/iconUser.png' alt={'User Icon'} />
                            </div>
                            <div className='nameAdmin'>
                                {JSON.parse(Cookies.get('authUser')).firstname + ' ' + JSON.parse(Cookies.get('authUser')).lastname}
                            </div>
                            <FaCaretDown className='caret-down' />
                        </div>
                        {this.state.groupActionUser
                            ?
                            <div className='group-action-user'>
                                {/* <div className='action-user'>
                                    <div className='icon-action-user'>
                                        <FaUser />
                                    </div>
                                    <span>User Profile</span>
                                </div> */}
                                <div className='action-user' data-bs-toggle="modal" data-bs-target="#changePass">
                                    <div className='icon-action-user'>
                                        <FaKey />
                                    </div>
                                    <span>{this.CONSTANT_TEXT[language].change_password}</span>
                                </div>
                                {this.state.loginSuccess
                                    ?
                                    <div className='action-user' onClick={this.logout}>
                                        <div className='icon-action-user'>
                                            <FaSignOutAlt className='fa-user-logout' />
                                        </div>
                                        <span className='label-user-logout'>{this.CONSTANT_TEXT[language].logout}</span>
                                    </div>
                                    :
                                    <Redirect to="/login" />
                                }
                            </div>
                            :
                            ""
                        }
                        <div className="icon-setting action-navbar" onClick={this.onOpenActionSetting}>
                            <FaCog />
                        </div>
                        {this.state.groupActionSetting
                            ?
                            <div className='group-action-user group-setting' >
                                <div className='action-user action-setting' data-bs-toggle="modal" data-bs-target="#modalLanguage">
                                    <div className='icon-action-user'>
                                        <FaGlobe />
                                    </div>
                                    <span>{this.CONSTANT_TEXT[language].language}</span>
                                </div>
                            </div>
                            :
                            ''
                        }
                        <div className="modal fade" id="modalLanguage" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content modal-list-language">
                                    <div className="modal-body">
                                        <div className='label-language'>
                                            <p>{this.CONSTANT_TEXT[language].label_password}</p>
                                        </div>
                                        <div className='group-input-language' onChange={this.setLanguage}>
                                            <input className='input-language' type="radio" id='vi' name="language" value="vi" defaultChecked={language == 'vi'} />
                                            <label htmlFor="vi">Vietnamese</label><br />
                                            <input className='input-language' type="radio" id='en' name="language" value="en" defaultChecked={language == 'en'} />
                                            <label htmlFor="en">English</label><br />
                                        </div>
                                        <div className='group-button-language'>
                                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={this.changeLanguage}>
                                                {this.CONSTANT_TEXT[language].apply}
                                            </button>
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                {this.CONSTANT_TEXT[language].cancel}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="changePass" tabIndex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-change-password">
                        <div className="modal-content ">
                            <div className="modal-body">
                                <ChangePass onSuccess={() => this.setState({ isShow: false })} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* {this.state.isShow && <div className="modal fade" id="changePass" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-change-password">
                        <div className="modal-content ">
                            <div className="modal-body">
                                <ChangePass onSuccess={() => this.setState({ isShow: false })}></ChangePass>
                            </div>
                        </div>
                    </div>
                </div>} */}
            </>
        );
    }
}
