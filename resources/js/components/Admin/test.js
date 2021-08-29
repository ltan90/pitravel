import React, { Component } from 'react'
import { FaBars } from 'react-icons/fa'
import { BrowserRouter as Router, Link, NavLink, Route, Switch } from 'react-router-dom'
import dataMenu from './dataMenu.js'


const MenuLink = ({ label, to, activeOnlyWhenExact, cName, icon }) => {
    return (
        <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => {
            var active = match ? 'active abc' : '';
            return (
                <li className={active} className={cName}>
                    <Link to={to}>
                        {icon}<span>{label}</span>
                    </Link>
                </li>
            )
        }} />
    )
}
// Custom menu: add ClassName mới vào khi click vào mỗi mục


export class MenuLeft extends Component {

    showMenu = (dataMenu) => {
        var result = null
        if (dataMenu.length > 0) {
            result = dataMenu.map((dataMenu, index) => {
                return (
                    <MenuLink
                        key={index}
                        label={this.state.bars === true ? `${dataMenu.label}` : ""}
                        to={dataMenu.to}
                        activeOnlyWhenExact={dataMenu.exact}
                        cName={this.state.bars === true ? `${dataMenu.cName}` : "nav-text-2"}
                        icon={dataMenu.icon}
                    />
                )
            })
        }
        return result
    }

    render() {
        return (
            <nav className="nav-menu">
                <ul className="nav-menu-items">
                    {this.showMenu(dataMenu)}
                    {/* Hiển thị Menu */}
                </ul>
            </nav>
        )
    }
}

export default MenuLeft
