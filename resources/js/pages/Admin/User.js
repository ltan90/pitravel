import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
    FaEdit,
    FaPlusCircle,
    FaTrashAlt,
    FaSearch,
    FaSave,
    FaArrowLeft,
    FaSquare,
    FaMinusSquare,
    FaCheckSquare,
    FaRegSquare,
} from "react-icons/fa";
import "../../../css/ServiceAdmin.css";
import { Drawer, DrawerSize, Position, Icon } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "../../../css/ListRoomAdmin.css";
import PaginationComponent from "../../components/PaginationComponent";
import UserMiddleware from "../../utils/UserMiddleware"
import RoleMiddleware from "../../utils/RoleMiddleware";
import CommonLanguage from "../../utils/CommonLanguage";
import '../../../css/User.css'
import Cookies from "js-cookie";
import ShowSuccess from "../../components/ShowSuccess";
export default class User extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.state = {
            users: [],
            roles: [],
            isOpen: false,
            user: {
                role_id: 3,
                id: 0,
                username: "",
                firstname: "",
                lastname: "",
                gender: 0,
                phone: '',
                email: ""
            },
            mode: "add",
            timeout: 0,
            searchText: "",
            limit: 15,
            total: 0,
            currentPage: 1,
            isReady: false,
            checkIcon: "none",
            checkPhone: true,
            checkLastname: true,
            checkFirstname: true,
            checkUsername: true,
            checkEmail: true,
            disableSubmit: false,
            openModal: false,
            succeed_message: '',
        };
        this.currentLanguages = this.CommonLanguage.getData()
        this.idsDelete = [];
        this.UserMiddleware = new UserMiddleware();
        this.RoleMiddleware = new RoleMiddleware();
        this.current_auth_id = 0;
        this.CONSTANT_TEXT = {
            vi: {
                actions: 'Hành động',
                delete: 'Xoá',
                add: 'Thêm',
                addUser: 'Thêm người dùng',
                editUser: 'Chỉnh sửa người dùng',
                cancel: 'Huỷ bỏ',
                save: 'Lưu',
                search: 'Tìm kiếm',
                name: 'Tên',
                content: 'Nội dung',
                page: 'Trang',
                role: 'Vai trò',
                username: 'Tên đăng nhập',
                fullname: 'Họ tên',
                firstname: 'Tên',
                lastname: 'Họ',
                gender: 'Giới tính',
                phone: 'Số điện thoại',
                email: 'Email',
                back: 'Quay lại',
                female: 'Nữ',
                male: 'Nam'
            },
            en: {
                actions: 'Actions',
                delete: 'Delete',
                add: 'Add',
                addUser: 'Add new user',
                editUser: 'Edit user',
                cancel: 'Cancel',
                save: 'Save',
                search: 'Search',
                name: 'Name',
                content: 'Content',
                page: 'Page',
                role: 'Role',
                username: 'Username',
                fullname: 'Fullname',
                firstname: 'Firstname',
                lastname: 'Lastname',
                gender: 'Gender',
                phone: 'Phone',
                email: 'Email',
                back: 'Back',
                female: 'Female',
                male: 'Male'
            }
        }
        if (Cookies.get('authUser')) {
            let authUser = JSON.parse(Cookies.get('authUser'));
            if (authUser.role_id != 1) {
                return <Redirect to="/admin" />
            } else this.current_auth_id = authUser.id;
        }
    }

    createSelectionByRoleId = (roleId) => {
        let roles = [...this.state.roles];
        if (roleId == 0) {
            // roles.unshift({ id: 0, name: "-- Choose Role --" });
            let userRole = roles.find(role => role.name == 'user');
            if (userRole) roleId = userRole.id;
        }

        return (
            <select className="form-select" name="role_id" defaultValue={roleId}
                onChange={this.handleInputChange} required>
                {roles.map((role, index) => {
                    return (
                        <option key={index} value={role.id}>
                            {role.name}
                        </option>);
                })}
            </select>
        );
    }

    async componentDidMount() {
        const userParams = {
            limit: this.state.limit,
            offset: 0,
        };
        const roleParams = {
            limit: this.state.limit,
            offset: 0,
        };
        let dataRoles = [];
        if (typeof (Storage) !== "undefined" && sessionStorage.getItem('roles')) {
            dataRoles = JSON.parse(sessionStorage.getItem('roles'));
        } else {
            dataRoles = await this.RoleMiddleware.getRoles(roleParams);
            typeof (Storage) !== "undefined" && sessionStorage.setItem('roles', JSON.stringify(dataRoles));
        }

        // let language = this.CommonLanguage.getData();
        let roles = dataRoles;

        const dataUsers = await this.UserMiddleware.getUsers(
            userParams
        );
        if (dataUsers.status != 400) {
            let users = dataUsers?.users || [];
            let total = dataUsers?.total || 0;

            this.setState({ users, roles, total, isReady: true });
        }
    }

    handleAddUser = () => {
        this.setState({
            isOpen: true,
            mode: "add",
            user: {
                role_id: 3,
                id: 0,
                username: "",
                firstname: "",
                lastname: "",
                gender: 0,
                phone: '',
                email: ""
            },
            checkPhone: true,
            checkLastname: true,
            checkFirstname: true,
            checkUsername: true,
            checkEmail: true,
            disableSubmit: false,
        });
    };

    handleEditUser = (item) => {
        this.setState({
            user: JSON.parse(JSON.stringify(item)),
            isOpen: true,
            mode: "edit",
            checkPhone: true,
            checkLastname: true,
            checkFirstname: true,
            checkUsername: true,
            checkEmail: true,
            disableSubmit: false,
        });
    };

    handleClose = () => {
        this.setState({ isOpen: false });
    };
    handleInputChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let type = e.target.type;

        let user = { ...this.state.user };
        if (type == "number") value = parseInt(value);
        user[name] = value;
        this.setState({ user });
    };

    validateInput = (input, key) => {
        let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        let formatUserName = /^[#$%^&*()+\=\[\]{};'"\\|,<>\?]*$/;
        let formatedInput = input.trim()
        if (key === 'username') {
            for (let c of formatedInput) if (c.match(formatUserName)) return false;
            return true;
        } else if (key === 'firstname' || key === 'lastname') {
            for (let c of formatedInput) if (c.match(format)) return false;
            return true;
        }
        if (formatedUserName.length === 0) return false
        return true
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.state.mode === "add") {
            const user = this.state.user;
            if (user.role_id == 0) {
                alert('Please choose the role of new user');
                return;
            }
            if (this.validateAll()) {
                const params = {
                    ...user
                };
                this.setState({ disableSubmit: true });
                const response = await this.UserMiddleware.createUser(
                    params
                );
                if (response.status && response.status === 200) {
                    // let newUser = response.data;
                    // let users = [newUser, ...this.state.users];
                    // this.setState({users, isOpen: false});
                    await this.refreshItemsWhenAdd();
                    alert(response.message);
                    this.setState({ isOpen: false });
                } else if (response.response.status === 400) {
                    let messages = response.response.data.message;
                    let messageAlert = '';
                    for (let message in messages) {
                        let messageArr = messages[message];
                        for (let messageEle of messageArr) {
                            messageAlert += messageEle + '\n'
                        }
                    }
                    alert(messageAlert);
                }
            }

        } else if (this.state.mode === "edit") {
            if (this.validateAll()) {
                let editedUser = this.state.user;
                const params = {
                    ...editedUser
                };
                this.setState({ disableSubmit: true });
                const response = await this.UserMiddleware.updateUser(editedUser.id, params);
                if (response.status && response.status === 200) {
                    // let users = [...this.state.users];
                    // let index = users.findIndex(user => user.id == editedUser.id);
                    // users[index] = editedUser;
                    await this.refreshItemsWhenAdd();
                    this.setState({
                        openModal: true,
                        succeed_message: response.message
                    })
                    this.setState({ isOpen: false });
                } else if (response.response.status === 400) {
                    let messages = response.response.data.message;
                    let messageAlert = '';
                    for (let message in messages) {
                        let messageArr = messages[message];
                        for (let messageEle of messageArr) {
                            messageAlert += messageEle + '\n'
                        }
                    }
                    alert(messageAlert);
                }
            }
        }
        this.setState({ disableSubmit: false });
    };
    handlePageChange = async (pageNumber) => {
        const params = {
            limit: this.state.limit,
            offset: (pageNumber - 1) * this.state.limit,
            search: this.state.searchText,
        };

        const dataUsers = await this.UserMiddleware.getUsers(params);

        let users = dataUsers?.users || [];
        let total = dataUsers?.total || 0;

        this.setState({ users, total, currentPage: pageNumber });
        this.deCheckAll();
    };
    handleDeleteUser = async (id) => {
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [id],
            };
            let response = await this.UserMiddleware.deleteUser(params);
            if (response.status && response.status === 200) {
                let users = this.state.users.filter((user) => user.id != id);
                this.idsDelete = this.idsDelete.filter((idDelete) => idDelete != id);
                if (users.length == 0 && this.isLastPageNow()) {
                    if (this.currentPage == 1) this.refreshItemsWhenDelete(1);
                    else this.refreshItemsWhenDelete(this.state.currentPage - 1);
                } else this.refreshItemsWhenDelete(this.state.currentPage);
                this.setState({
                    openModal: true,
                    succeed_message: response.message
                })
            } else {
                alert(response.message)
            }
        }
    };
    doSearch = (e) => {
        let searchText = e.target.value; // this is the search text
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.doCallApiSearch(searchText);
        }, 500);
        this.setState({ searchText: searchText });
    };
    doCallApiSearch = async (searchText) => {
        const params = {
            limit: this.state.limit,
            offset: 0,
            search: searchText,
        };

        const dataUsers = await this.UserMiddleware.getUsers(params);
        if (dataUsers) {
            let users = dataUsers.users;
            let total = dataUsers.total;

            this.setState({ users, total, currentPage: 1 });
        } else alert('Error Search');

    };
    handleToggleCheck = (e, id) => {
        let value = e.target.checked;
        if (value) {
            this.idsDelete = [...this.idsDelete, id]
        } else {
            this.idsDelete = this.idsDelete.filter(idDelete => idDelete != id);
        }
        let checkIcon;
        if (this.idsDelete.length == this.state.users.length) checkIcon = 'all';
        else if (this.idsDelete.length == 0) checkIcon = 'none';
        else checkIcon = 'deAll';
        this.setState({ checkIcon });
    };
    deCheckAll = () => {
        this.idsDelete = [];
        let checks = document.querySelectorAll('.check-user');
        checks.forEach(check => {
            check.checked = false;
        })

        this.setState({ checkIcon: "none" });
    };
    checkAll = () => {
        this.idsDelete = this.state.users.map(user => user.id).filter(userId => userId != this.current_auth_id);
        let checks = document.querySelectorAll('.check-user');
        checks.forEach(check => {
            check.checked = true;
        })

        this.setState({ checkIcon: "all" });
    };
    handleDeleteCheckedUsers = async () => {
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [...this.idsDelete],
            };
            let response = await this.UserMiddleware.deleteUser(params);
            if (response.status && response.status === 200) {
                let users = this.state.users.filter(
                    (user) => !this.idsDelete.includes(user.id)
                );

                if (users.length == 0 && this.isLastPageNow()) {
                    if (this.currentPage == 1) this.refreshItemsWhenDelete(1);
                    else this.refreshItemsWhenDelete(this.state.currentPage - 1);
                } else this.refreshItemsWhenDelete(this.state.currentPage);

                this.setState({
                    openModal: true,
                    succeed_delete_message: response.message
                })
            } else {
                alert(response.message)
            }

        }
    };
    getFullname = (firstName, lastName) => {
        return firstName + ' ' + lastName;
    }
    getRoleName = (id) => {
        let roleName = this.state.roles.find(role => role.id == id);
        if (roleName) return roleName.name;
        return id;
    }
    setGender = (e) => {
        let genderType = e.target.id;
        let user = { ...this.state.user };
        if (genderType == 'female') user.gender = 0;
        else user.gender = 1;
        this.setState({ user });
    }
    refreshItemsWhenAdd = async () => {
        await this.handlePageChange(1);
    }
    refreshItemsWhenDelete = async (page) => {
        await this.handlePageChange(page);
    }
    isLastPageNow = () => {
        if (this.state.currentPage == Math.ceil(this.state.total / this.state.limit)) return true;
        return false;
    }
    handleInputValidationPhone = () => {
        const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (this.state.user.phone.length === 0 || this.state.user.phone.match(regex) === null) {
            this.setState({
                checkPhone: false,
            })
            return false;
        } else {
            this.setState({
                checkPhone: true,
            })
            return true;
        }
    };
    handleInputValidationUsername = () => {
        const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;
        if (this.state.user.username.length === 0
            || this.state.user.username.length < 8
            || this.state.user.username.match(regex)
            || this.state.user.username[0].match(/[0-9]/)
        ) {
            this.setState({
                checkUsername: false,
            })
            return false;
        } else {
            this.setState({
                checkUsername: true,
            })
            return true;
        }
    };
    handleInputValidationFirstname = () => {
        const regex = /[!@#$%^&*()_+\-=\[\]{};:"\\|,<>\/?0-9]/;
        if (this.state.user.firstname.length === 0 || this.state.user.firstname.match(regex)) {
            this.setState({
                checkFirstname: false,
            })
            return false;
        } else {
            this.setState({
                checkFirstname: true,
            })
            return true;
        }
    };
    handleInputValidationLastname = () => {
        const regex = /[!@#$%^&*()_+\-=\[\]{};:"\\|,<>\/?0-9]/;
        if (this.state.user.lastname.length === 0 || this.state.user.lastname.match(regex)) {
            this.setState({
                checkLastname: false,
            })
            return false;
        } else {
            this.setState({
                checkLastname: true,
            })
            return true;
        }
    };
    handleInputValidationEmail = () => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (this.state.user.email.length === 0 || this.state.user.email.match(regex) === null) {
            this.setState({
                checkEmail: false,
            })
            return false;
        } else {
            this.setState({
                checkEmail: true,
            })
            return true;
        }
    };
    validateAll = () => {
        let checkEmail = this.handleInputValidationEmail();
        let checkLastname = this.handleInputValidationLastname();
        let checkFirstname = this.handleInputValidationFirstname();
        let checkUsername = this.handleInputValidationUsername();
        let checkPhone = this.handleInputValidationPhone();
        return checkPhone && checkUsername && checkFirstname && checkLastname && checkEmail;
    }
    getIconCheck = (nameIcon) => {
        switch (nameIcon) {
            case 'all': return (<FaCheckSquare onClick={this.deCheckAll} />)
            case 'deAll': return (<FaMinusSquare onClick={this.deCheckAll} />)
            case 'none': return (<FaRegSquare onClick={this.checkAll} />)
        }
    }

    showModal = () => {
        setTimeout(() => {
            this.setState({
                openModal: false,
            })
        }, 1200);
        return (
            <ShowSuccess textConfirm={this.state.succeed_message} />
        )
    }


    render() {
        let language = this.currentLanguages;
        let nameIcon = this.state.checkIcon;
        if (Cookies.get('authUser')) {
            let authUser = JSON.parse(Cookies.get('authUser'));
            if (authUser.role_id != 1) {
                return <Redirect to="/admin" />
            }
        }
        return (
            <div className="service hotel-rooms-container">
                <div className="table-service table-hotelroom">
                    <div className="actions-table">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={this.handleDeleteCheckedUsers}
                            disabled={this.idsDelete.length === 0}
                        >
                            <FaTrashAlt />
                            &ensp;{this.CONSTANT_TEXT[language].delete}
                        </button>
                        <div className='group-search-add'>
                            <div className="search-table">
                                <input
                                    placeholder={`${this.CONSTANT_TEXT[language].search}...`}
                                    onChange={this.doSearch}
                                    name="search"
                                    value={this.state.searchText}
                                />
                                <span>
                                    <FaSearch />
                                </span>
                            </div>
                            &ensp;
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.handleAddUser}
                            >
                                <FaPlusCircle className="fa-plus" />
                                &ensp;{this.CONSTANT_TEXT[language].add}
                            </button>
                        </div>

                    </div>

                    <table className="table table-striped table-hover table-users">
                        <thead>
                            <tr>
                                <th>
                                    {this.getIconCheck(nameIcon)}
                                </th>
                                <th>#</th>
                                <th>{this.CONSTANT_TEXT[language].role}</th>
                                <th>{this.CONSTANT_TEXT[language].username}</th>
                                <th>{this.CONSTANT_TEXT[language].fullname}</th>
                                <th>{this.CONSTANT_TEXT[language].gender}</th>
                                <th>{this.CONSTANT_TEXT[language].phone}</th>
                                <th>{this.CONSTANT_TEXT[language].email}</th>
                                <th>{this.CONSTANT_TEXT[language].actions}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Array.isArray(this.state.users) && this.state.users.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {item.id != this.current_auth_id && <input
                                                className='check-user'
                                                type="checkbox"
                                                name="check"
                                                id="check"
                                                onChange={(e) =>
                                                    this.handleToggleCheck(e, item.id
                                                    )
                                                }
                                                defaultChecked={false}
                                            />}
                                        </td>
                                        <td>{item.id}</td>
                                        <td>{this.getRoleName(item.role_id)}</td>
                                        <td className="text-truncate-table">
                                            {item.username}
                                        </td>
                                        <td className="text-truncate-table">
                                            {this.getFullname(item.firstname, item.lastname)}
                                        </td>
                                        <td>{item.gender ? 'Male' : 'Female'}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <FaEdit
                                                className="fa fa-edit"
                                                onClick={() =>
                                                    this.handleEditUser(item)
                                                }
                                            />
                                            &ensp;
                                            {item.id != this.current_auth_id && <FaTrashAlt
                                                className="fa fa-delete"
                                                onClick={() =>
                                                    this.handleDeleteUser(
                                                        item.id
                                                    )
                                                }
                                            />}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <Drawer
                    isOpen={this.state.isOpen}
                    autoFocus
                    canEscapeKeyClose
                    canOutsideClickClose
                    enforceFocus
                    hasBackdrop
                    position={Position.RIGHT}
                    size={"30%"}
                    usePortal
                    icon="info-sign"
                    onClose={this.handleClose}
                    title={
                        this.state.mode === "add" ? this.CONSTANT_TEXT[language].addUser : this.CONSTANT_TEXT[language].editUser
                    }
                >
                    <form
                        className="form form-edit-beds"
                        method="post"
                        onSubmit={this.handleSubmit}
                    >
                        <div className="room-inputs">
                            <div className='group-info-beds'>
                                <div className="form-group-bed">
                                    <label htmlFor="role_id">{this.CONSTANT_TEXT[language].role}:</label>
                                    {this.createSelectionByRoleId(this.state.user.role_id)}
                                </div>
                                <div className="form-group-bed">
                                    <label htmlFor="username">
                                        {this.CONSTANT_TEXT[language].username}:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        id="username"
                                        value={this.state.user.username}
                                        onChange={this.handleInputChange}
                                        required
                                        disabled={this.state.mode == 'edit'}
                                    // onBlur={this.handleInputValidationUsername}
                                    />
                                    <label className={`default-validation ${!this.state.checkUsername && 'show'}`}>Invalid Username. At least 8 characters!</label>
                                </div>
                                <div className="form-group-bed">
                                    <label htmlFor="firstname">
                                        {this.CONSTANT_TEXT[language].firstname}:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstname"
                                        id="firstname"
                                        value={this.state.user.firstname}
                                        onChange={this.handleInputChange}
                                        required
                                    // onBlur={this.handleInputValidationFirstname}
                                    />
                                    <label className={`default-validation ${!this.state.checkFirstname && 'show'}`}>Invalid Firstname!</label>
                                </div>
                                <div className="form-group-bed">
                                    <label htmlFor="lastname">
                                        {this.CONSTANT_TEXT[language].lastname}:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastname"
                                        id="lastname"
                                        value={this.state.user.lastname}
                                        onChange={this.handleInputChange}
                                        required
                                    // onBlur={this.handleInputValidationLastname}
                                    />
                                    <label className={`default-validation ${!this.state.checkLastname && 'show'}`}>Invalid Lastname!</label>
                                </div>
                                <div className="form-group-bed">
                                    <label htmlFor="lastname">
                                        {this.CONSTANT_TEXT[language].gender}:
                                    </label>
                                    <div onChange={this.setGender}>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" id="female"
                                                defaultChecked={this.state.user.gender == 0} />
                                            <label className="form-check-label" htmlFor="female">
                                                {this.CONSTANT_TEXT[language].female}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" id="male"
                                                defaultChecked={this.state.user.gender == 1} />
                                            <label className="form-check-label" htmlFor="male">
                                                {this.CONSTANT_TEXT[language].male}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group-bed">
                                    <label htmlFor="phone">
                                        {this.CONSTANT_TEXT[language].phone}:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        id="phone"
                                        value={this.state.user.phone}
                                        onChange={this.handleInputChange}
                                        // onBlur={this.handleInputValidationPhone}
                                        required
                                    />
                                    <label className={`default-validation ${!this.state.checkPhone && 'show'}`}>Invalid phone number!</label>
                                </div>
                                <div className="form-group-bed">
                                    <label htmlFor="email">
                                        {this.CONSTANT_TEXT[language].email}:
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        id="email"
                                        value={this.state.user.email}
                                        onChange={this.handleInputChange}
                                        required
                                    // onBlur={this.handleInputValidationEmail}
                                    />
                                    <label className={`default-validation ${!this.state.checkEmail && 'show'}`}>Invalid email!</label>
                                </div>
                            </div>
                            <div className="room-buttons">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-md"
                                    onClick={() =>
                                        this.setState({ isOpen: false })
                                    }
                                >
                                    <FaArrowLeft /> {this.CONSTANT_TEXT[language].back}
                                </button>
                                <button
                                    disabled={this.state.disableSubmit}
                                    type="submit"
                                    className="btn btn-primary btn-md button-save-bed"
                                >
                                    <FaSave className="fa-icon-save" /> {this.CONSTANT_TEXT[language].save}
                                </button>
                            </div>
                        </div>
                    </form>
                </Drawer>

                {this.state.openModal && this.showModal()}

                {this.state.isReady && <PaginationComponent
                    total={this.state.total}
                    limit={this.state.limit}
                    currentPage={this.state.currentPage}
                    itemsCount={this.state.users.length}
                    onPageChange={(pageNumber) =>
                        this.handlePageChange(pageNumber)
                    }
                />}
            </div>
        );
    }
}
