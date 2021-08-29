import React, { Component } from 'react';
import { Route, HashRouter } from "react-router-dom";
import ReactDOM from 'react-dom';
import routers from './router'

class AppRouter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HashRouter>
                {this.showContentMenu(routers)}
            </HashRouter>

        );
    }
    showContentMenu = (routers) => {
        let result = null;
        if (routers.length) {
            result = routers.map((route, index) => {
                return (
                    <Route
                        key={index}
                        path={route.path}
                        exact={!!route.exact}
                        component={route.main}
                    />
                );
            });
        }
        return result;
    };
}

export default AppRouter;

if (document.getElementById("app")) {
    ReactDOM.render(<AppRouter />, document.getElementById("app"));
}
