import React, { Component } from 'react'
import '../../css/layouts.css';
import { BrowserRouter as Router, Link, } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import logoVenu from '../../../public/images/logoVenu.png'
import iconSetting from '../../../public/images/setting.png'

export default class Header extends Component {
    constructor(props) {
        super(props);
    }
    loadAllHotels = () => {
        sessionStorage.clear();
        window.location.reload()
    }
    render() {
        const LANG = {
            login: 'LOGIN'
        };
        return (
            <div className='group-header'>
                <div className='actions-header'>
                    <div className='group-actions-header'>
                        <img className='icon-setting-header' src={iconSetting} alt={'Icon Setting'}/>
                        <Link to='/login' className="login">
                            <img src="../images/iconLogin.png" alt={'Login Icon'} />{LANG.login}
                        </Link>
                    </div>
                </div>
                <div className="header">
                    <div className="content-header">
                        <div className="logo" onClick={this.loadAllHotels}>
                            <Link to="/" ><img id='logoPi' src={logoVenu} alt={'PiBooking Logo'} /></Link>
                        </div>
                        <div className='download'>
                            <img className='logoStore' src="../images/CHplay.png" alt={'Google Play'} />
                            <img className='logoStore' src="../images/appstore.png" alt={'Apple Appstore'} />


                        </div>

                    </div>

                </div>

                {this.props.children}
            </div>
        )
    }
}
