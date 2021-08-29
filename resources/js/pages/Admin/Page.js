import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import HotelMiddleware from '../../utils/HotelMiddleware';
import CommonLanguage from '../../utils/CommonLanguage';
import PageMiddleware from '../../utils/PageMiddleware';
import PaginationComponent from "../../components/PaginationComponent";
import ShowSuccess from '../../components/ShowSuccess';
import {
    FaEdit,
    FaTrashAlt,
} from "react-icons/fa";
import '../../../css/Page.css';
import Cookies from "js-cookie";
import Editor from '../../components/Admin/Editor';
class Page extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.state = {
            pages: [],
            page: {
                type: '',
                name: '',
                content: '',
            },
            limit: 10,
            total: 0,
            mode: 'add',
            checkIcon: 'none',
            isReady: false,
            currentPage: 1,
            checkPageName: true,
            checkPageTitle: true,
            checkPageContent: true,
            disableSubmit: false,
            removeContent: true,
            succeed_message: '',
            onModal: false
        };
        this.CONSTANT_TEXT = {
            vi: {
                title: 'Tiêu đề',
                actions: 'Hành động',
                delete: 'Xoá',
                addPage: 'Thêm trang',
                editPage: 'Chỉnh sửa trang',
                cancel: 'Huỷ bỏ',
                save: 'Lưu',
                search: 'Tìm kiếm',
                name: 'Tên',
                content: 'Nội dung',
                page: 'Trang'
            },
            en: {
                title: 'Title',
                actions: 'Actions',
                delete: 'Delete',
                addPage: 'Add page',
                editPage: 'Edit page',
                cancel: 'Cancel',
                save: 'Save',
                search: 'Search',
                name: 'Name',
                content: 'Content',
                page: 'Page'
            }
        }
        this.currentLanguages = this.CommonLanguage.getData()
        this.idsDelete = [];
        this.PageMiddleware = new PageMiddleware();
        this.HotelMiddleware = new HotelMiddleware();
    }
    handleToggleCheck = (e, id) => {
        let value = e.target.checked;
        if (value) {
            this.idsDelete = [...this.idsDelete, id]
        } else {
            this.idsDelete = this.idsDelete.filter(idDelete => idDelete != id);
        }
        let checkIcon;
        if (this.idsDelete.length == this.state.pages.length) checkIcon = 'all';
        else if (this.idsDelete.length == 0) checkIcon = 'none';
        else checkIcon = 'deAll';
        this.setState({ checkIcon });
    };

    async componentDidMount() {
        const params = {
            limit: 10,
        }
        let language = this.CommonLanguage.getData();
        // if (!localStorage.getItem('language')) {
        //     language = 'en';
        //     localStorage.setItem('language', 'en');
        // } else {
        //     language = localStorage.getItem('language');

        //     if (!this.CONSTANT_TEXT[language]) {
        //         language = 'en';
        //         localStorage.setItem('language', 'en');
        //     }
        // }
        const response = await this.PageMiddleware.getHomePage();
        if (response) {
            let pages = response;
            this.setState({ pages, isReady: true });
        } else {
            alert('Error load');
        }
    };
    handleEditPage = (item) => {
        this.setState({ page: JSON.parse(JSON.stringify(item)), mode: 'edit', checkPageName: true, checkPageTitle: true, checkPageContent: true, disableSubmit: false, });
    }
    handleAddPage = () => {
        this.setState({
            page: {
                type: '',
                name: '',
                content: '',
            },
            mode: 'add',
            checkPageName: true,
            checkPageTitle: true,
            checkPageContent: true,
            disableSubmit: false,
            removeContent: true
        });
    }

    getInputEditor = (content) => {
        let page = { ...this.state.page };
        page.content = content;
        this.setState({
            page
        })
    }
    getInputTitle = (title) => {
        let page = { ...this.state.page };
        page.name = title;
        this.setState({
            page
        })
    }
    handleInputChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        let page = { ...this.state.page };
        page[name] = value;
        this.setState({ page });
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.validateAll()) {
            if (this.state.mode === "add") {
                const params = {
                    ...this.state.page,
                    hotel_id: null
                };
                this.setState({ disableSubmit: true });
                let response = await this.PageMiddleware.createPage(params);
                if (response.status && response.status === 200) {
                    await this.refreshItems();
                    this.setState({
                        succeed_message: response.message,
                        openModal: true
                    })
                } else if (response.response.status === 400) {
                    let messages = response.response.data;
                    let messageAlert = '';
                    for (let message in messages) {
                        let messageArr = messages[message];
                        for (let messageEle of messageArr) {
                            messageAlert += messageEle + '\n'
                        }
                    }
                    alert(messageAlert);
                }
            } else if (this.state.mode === "edit") {
                const params = {
                    ...this.state.page,
                };
                this.setState({ disableSubmit: true });
                let response = await this.PageMiddleware.updatePage(this.state.page.id, params);
                if (response.status && response.status === 200) {
                    await this.refreshItems();
                    this.setState({
                        succeed_message: response.message,
                        openModal: true,
                    })
                } else if (response.response.status === 400) {
                    let messages = response.response.data;
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

    }
    handleDeletePage = async (id) => {
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [id],
            };
            let response = await this.PageMiddleware.deletePage(params);
            if (response.status && response.status === 200) {
                let pages = this.state.pages.filter((page) => page.id != id);

                await this.refreshItems();

                this.idsDelete = this.idsDelete.filter(idDelete => idDelete != id);
                this.setState({ checkIcon: 'none' });
                if (this.state.mode == 'edit') this.handleAddPage();
                this.setState({
                    openModal: true,
                    succeed_message: response.message
                })
            } else {
                alert(response.message);
            }

        }
    }
    refreshItems = async () => {
        const response = await this.PageMiddleware.getHomePage();
        if (response) {
            let pages = response;
            this.setState({ pages, isReady: true });
        } else {
            alert('Error load');
        }
    }
    validateInput = (input) => {
        let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        let formatedInput = input.trim();
        if (formatedInput.length === 0) return false
        for (let c of formatedInput) if (c.match(format)) return false;
        return true;
    }
    handleInputValidationPageName = () => {
        const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;
        if (this.state.page.type.length === 0
            || this.state.page.type.match(regex)
        ) {
            this.setState({
                checkPageName: false,
            })
            return false;
        } else {
            this.setState({
                checkPageName: true,
            })
            return true;
        }
    };
    handleInputValidationPageTitle = () => {
        const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;
        if (this.state.page.name.length === 0
            || this.state.page.name.match(regex)
        ) {
            this.setState({
                checkPageTitle: false,
            })
            return false;
        } else {
            this.setState({
                checkPageTitle: true,
            })
            return true;
        }
    };
    handleInputValidationPageContent = () => {
        if (this.state.page.name.trim().length === 0) {
            this.setState({
                checkPageContent: false,
            })
            return false;
        } else {
            this.setState({
                checkPageContent: true,
            })
            return true;
        }
    };
    validateAll = () => {
        let checkPageName = this.handleInputValidationPageName();
        let checkPageTitle = this.handleInputValidationPageTitle();
        let checkPageContent = this.handleInputValidationPageContent();
        return checkPageName && checkPageTitle && checkPageContent;
    }

    showEdit = () => {
        setTimeout(() => {
            this.setState({ openModal: false });
            this.handleAddPage()
        }, 1200);
        return (
            <ShowSuccess textConfirm={this.state.succeed_message} />
        )
    }

    render() {
        let language = this.currentLanguages;
        if (Cookies.get('authUser')) {
            let authUser = JSON.parse(Cookies.get('authUser'));
            if (authUser.role_id != 1) {
                return <Redirect to="/admin" />
            }
        }
        return (
            <div className="row">
                <div className="row">
                    <div className="col-8 service-4">
                        <div className="service bed-table-container">
                            <div
                                className='table-service table-page pd-4'
                            >
                                <form className="postPage"
                                    method="post"
                                    onSubmit={this.handleSubmit}
                                >
                                    <div className="mt-4">
                                        {this.state.mode === "add" ? (
                                            <h4>{this.CONSTANT_TEXT[language].addPage}</h4>
                                        ) : (
                                            <h4>{this.CONSTANT_TEXT[language].editPage} #{this.state.page.id}</h4>
                                        )}
                                        <div className="form-group mb-3 leftify-children">
                                            <label className="mb-2">{this.CONSTANT_TEXT[language].name}:</label>
                                            <input type="text" className="form-control inputClear" name='type' disabled={this.state.mode == 'edit'}
                                                value={this.state.page.type} onChange={this.handleInputChange}
                                            />
                                            <label className={`default-validation ${!this.state.checkPageName && 'show'}`}>Invalid name!</label>
                                        </div>
                                        <Editor
                                            // removeContent={true}
                                            handleInputPostName={(params) => this.getInputTitle(params)}
                                            handleInputEditor={(params) => this.getInputEditor(params)}
                                            page={this.state.page}
                                            checkPageTitle={this.state.checkPageTitle}
                                            checkPageContent={this.state.checkPageContent}
                                        />

                                        <div className="btn-container btn-page-container">
                                            <button
                                                disabled={this.state.disableSubmit}
                                                type="submit"
                                                className="btn btn-primary submitService mr-3"
                                            >
                                                {this.CONSTANT_TEXT[language].save}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary submitService"
                                                onClick={this.handleAddPage}
                                            >
                                                {this.CONSTANT_TEXT[language].cancel}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 service-8">
                        <div className="service">
                            <div className="table-service">
                                <div className="table-container p-3 table-page-container">
                                    <table className="table table-service-col8 table-page-col8 ">
                                        <thead className="table-th">
                                            <tr>
                                                <th>ID</th>
                                                <th className="td-nameService table-page-width">
                                                    {this.CONSTANT_TEXT[language].page}
                                                </th>
                                                <th>{this.CONSTANT_TEXT[language].actions}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(this.state.pages) && this.state.pages.map(
                                                (item, index) => {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td>{item.id}</td>
                                                            <td>{item.type}</td>

                                                            <td>
                                                                <FaEdit
                                                                    className="fa fa-edit"
                                                                    onClick={() =>
                                                                        this.handleEditPage(
                                                                            item
                                                                        )
                                                                    }
                                                                />{" "}
                                                                {item.type != 'home' && <FaTrashAlt
                                                                    className="fa fa-delete"
                                                                    onClick={() =>
                                                                        this.handleDeletePage(
                                                                            item.id
                                                                        )
                                                                    }
                                                                />}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {this.state.openModal && this.showEdit()}
                                {this.state.isReady && <PaginationComponent
                                    total={this.state.total}
                                    limit={this.state.limit}
                                    currentPage={this.state.currentPage}
                                    itemsCount={this.state.pages.length}
                                    onPageChange={(pageNumber) =>
                                        this.handlePageChange(pageNumber)
                                    }
                                />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;
