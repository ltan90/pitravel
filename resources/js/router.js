import React, { Component } from 'react';
import Book from './pages/Book'
import Home from './pages/Home'
import Admin from '../js/Admin';
import Login from './pages/Login';

const routers = [
    {
        path: '/',
        exact: true,
        main: () => <Home />,
    },
    {
        path: '/home',
        exact: false,
        main: () => <Home />,
    },
    {
        path: "/booking/:id",
        main: (props) => <Book {...props} />
    },
    {
        path: "/admin",
        main: (props) => <Admin {...props} />,
    },
    {
        path: "/login",
        main: () => <Login />,
    }
];

export default routers;
