import React, { Component } from 'react'
import { BrowserRouter as Router, Link, NavLink, Route, Switch } from 'react-router-dom'
import '../../../css/MenuLeft.css'
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/scss/styles.scss';
import dataMenu from './dataMenu.js'
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
export default class MenuLeft extends Component {
    constructor(props) {
        super(props);

        super(props);
        this.state = {
            dataLoad: false,
            srcImg: '',
            activeMenu: '',
        }
    }

    onActiveMenu = (to) => {
        this.setState({
            activeMenu: to,
        })
        // let url = window.location.href;
        // let index = url.lastIndexOf('/');
        // let route = url.substring(index + 1);
        // let urlName = '/admin/' + route;
        // if (this.state.activeMenu === urlName) {
        //     this.props.setDataLoad(true)
        //     this.setState({
        //         dataLoad: true
        //     })
        // } else if (this.state.activeMenu != urlName) {
        //     this.props.setDataLoad(false)
        //     this.setState({
        //         dataLoad: false
        //     })
        // }

    };

    render() {

        let menuItems = dataMenu;
        if (Cookies.get('authUser')) {
            let authUser = JSON.parse(Cookies.get('authUser'));
            if (authUser.role_id != 1) {
                menuItems = menuItems.filter(item => item.label != 'User' && item.label != 'Page' && item.label != 'Config');
            }
        }
        let url = window.location.href;
        let index = url.lastIndexOf('/');
        let route = url.substring(index + 1);
        let urlName = '/admin/' + route;
        return (
            <div>
                {this.props.setMenu === true
                    ? (<nav className="nav-menu">
                        <ProSidebar>
                            <SidebarHeader>
                                <div className='header-menu'>
                                    <Link to="/">
                                        <div className='img-menu'></div>
                                    </Link>
                                    {/* <p>Pi Travel</p> */}
                                </div>
                            </SidebarHeader>
                            <SidebarContent>
                                <Menu iconShape="circle">
                                    {menuItems.map((item, index) => {
                                        return (
                                            <MenuItem key={index} icon={item.icon}
                                                onClick={() => this.onActiveMenu(item.to)}
                                                className={item.to === urlName ? "activeMenu" : ""}
                                            >
                                                <Link
                                                    to={item.to}
                                                    onClick={item.to === urlName ? this.refreshPage : this.function}
                                                >{sessionStorage.getItem('language') === 'vi' && item.label_vi || item.label}
                                                </Link>
                                            </MenuItem>
                                        )
                                    })}
                                </Menu>
                            </SidebarContent>
                        </ProSidebar>
                    </nav>)
                    : (<nav className="nav-menu-close">
                        <ProSidebar>
                            <SidebarHeader>
                                <Link to="/admin">
                                    <div className='img-menu-close'></div>
                                </Link>

                            </SidebarHeader>
                            <SidebarContent>
                                <Menu iconShape='circle'>
                                    {menuItems.map((item, index) => {
                                        return (
                                            <MenuItem key={index} icon={item.icon}
                                                onClick={() => this.onActiveMenu(item.to)}
                                                className={item.to === urlName ? "activeMenu-close" : "menu-close"}>
                                                <Link to={item.to} onClick={item.to === urlName ? this.refreshPage : this.function} />
                                            </MenuItem>
                                        )
                                    })}
                                </Menu>
                            </SidebarContent>
                        </ProSidebar>
                    </nav>)
                }
            </div>
        )
    }
}
