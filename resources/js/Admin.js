import React, { Component } from "react";
import MenuLeft from "./components/Admin/MenuLeft";
import {
    BrowserRouter as Router,
    HashRouter,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import "../css/Admin.css";
import Home from "./pages/Admin/Home";
import User from "./pages/Admin/User";
import ListRoom from "./pages/Admin/HotelRoom";
import Hotel from "./pages/Admin/Hotel";
import Service from "./pages/Admin/Service";
import Navbar from "./components/Admin/Navbar.js";
import HotelMiddleware from "./utils/HotelMiddleware";
import CommonMiddleware from "./utils/CommonMiddleware";
import Bed from "./pages/Admin/Bed";
import Cookies from 'js-cookie';
import Page from "./pages/Admin/Page";
import logoVenuSmall from '../../public/images/logoVenu_small.png'
import Config from "./pages/Admin/Config";
import NotFound from "./components/PageNotFound/pageNotFound";
import InfoBooking from "./components/Admin/InfoBooking";
export default class Admin extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loginSuccess: true,
            setMenu: true,
        };
        this.CommonMiddleware = new CommonMiddleware();
        this.HotelMiddleware = new HotelMiddleware();
    }
    async componentDidMount() {
        if (!sessionStorage.getItem('locations')) {
            let locations = await this.HotelMiddleware.getLocations();
            sessionStorage.setItem('locations', JSON.stringify(locations));
        }
        if (!sessionStorage.getItem('language')) {
            sessionStorage.setItem('language', 'en');
        }
    }
    onCloseMenu = () => {
        this.setState({
            setMenu: !this.state.setMenu
        })
    }
    welcome = () => {
        return (
            this.props.location.pathname === '/admin' ?
                <div className="item-admin">
                    <img src={logoVenuSmall} />
                    <h1>Welcome VENUESTAY</h1>
                </div>
                : null
        );
    }
    render() {
        if (!Cookies.get('token')) {
            return <Redirect to="/login" />
        }
        const authUser = JSON.parse(Cookies.get('authUser'));
        const user_role_id = authUser.role_id;
        return (
            <HashRouter>
                <MenuLeft onHandleMenu={this.onHandleMenu} setMenu={this.state.setMenu} />
                <div className={this.state.setMenu === true ? "col-contentAd" : "col-contentAd-close"}>
                    <Navbar onCloseMenu={this.onCloseMenu} />
                    <div className='content-admin'>
                        {this.welcome()}
                        <Switch>
                            <Route path="/admin/home">
                                <Home />
                            </Route>
                            <Route path="/admin/service">
                                <Service />
                            </Route>
                            <Route path="/admin/listroom">
                                <ListRoom />
                            </Route>
                            <Route path="/admin/list-hotel">
                                <Hotel />
                            </Route>
                            <Route path="/admin/bed">
                                <Bed />
                            </Route>
                            <Route path="/admin/infobooking">
                                <InfoBooking />
                            </Route>
                            {user_role_id == 1 && <Route path="/admin/user">
                                <User />
                            </Route>}
                            {user_role_id == 1 && <Route path="/admin/page">
                                <Page />
                            </Route>}
                            {user_role_id == 1 && <Route path="/admin/config">
                                <Config />
                            </Route>}
                            <Route path="/admin/*">
                                <NotFound />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </HashRouter>
        );
    }
}
