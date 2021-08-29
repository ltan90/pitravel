import React, { Component } from "react";
import {
    FaWrench, FaHome, FaHotel, FaList, FaUser, FaRegFile, FaBed,
    FaServicestack, FaNewspaper
} from "react-icons/fa";

const dataMenu = [
    {
        id: 4,
        label: "Hotel",
        label_vi: 'Khách Sạn',
        icon: <FaHotel />,
        to: "/admin/list-hotel",
        exact: false,
        cName: "nav-text",
    },
    {
        id: 5,
        label: "Service",
        label_vi: 'Dịch Vụ',
        icon: <FaServicestack />,
        to: "/admin/service",
        exact: false,
        cName: "nav-text",
    },
    {
        id: 6,
        label: "Bed",
        label_vi: 'Giường',
        icon: <FaBed />,
        to: "/admin/bed",
        exact: false,
        cName: "nav-text",
    },
    {
        id: 7,
        label: "User",
        label_vi: 'Tài Khoản',
        icon: <FaUser />,
        to: "/admin/user",
        exact: false,
        cName: "nav-text",
    },
    {
        id: 8,
        label: "Page",
        label_vi: 'Trang',
        icon: <FaNewspaper />,
        to: "/admin/page",
        exact: false,
        cName: "nav-text",
    },
    {
        id: 9,
        label: "Config",
        label_vi: 'Cấu Hình',
        icon: <FaWrench />,
        to: "/admin/config",
        exact: false,
        cName: "nav-text",
    },
];

export default dataMenu;
