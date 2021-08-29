import React, { Component } from "react";
import {
    FaEdit,
    FaSearch,
    FaTrashAlt,
    FaMinusSquare,
    FaCheckSquare,
    FaRegSquare,
} from "react-icons/fa";
import "../../../css/ServiceAdmin.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import PaginationComponent from "../../components/PaginationComponent";
import BedMiddleware from "../../utils/BedMiddleware";
import CommonLanguage from "../../utils/CommonLanguage";
import "../../../css/Bed.css";
import ShowSuccess from "../../components/ShowSuccess";

export default class Bed extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.state = {
            beds: [],
            isOpen: false,
            bed: {
                id: 0,
                name: "",
                image_url: "",
            },
            mode: "add",
            timeout: 0,
            searchText: "",
            limit: 15,
            total: 0,
            currentPage: 1,
            checkIcon: "none",
            isReady: false,
            currentLanguagues: 'en',
            disableSubmit: false,
            openModal: false,
            succeed_message: '',
        };
        this.currentLanguages = this.CommonLanguage.getData();
        this.idsDelete = [];
        this.titleBed = [
            { name: "name", text: "Name" },
        ];
        this.BedMiddleware = new BedMiddleware();
        this.CONSTANT_TEXT = {
            vi: {
                bedName: 'Tên giường',
                actions: 'Hành động',
                delete: 'Xoá',
                addBed: 'Thêm giường',
                editBed: 'Chỉnh sửa giường',
                cancel: 'Huỷ bỏ',
                save: 'Lưu',
                search: 'Tìm kiếm',
                name: 'Tên',
            },
            en: {
                bedName: 'Bed name',
                actions: 'Actions',
                delete: 'Delete',
                addBed: 'Add bed',
                editBed: 'Edit bed',
                cancel: 'Cancel',
                save: 'Save',
                search: 'Search',
                name: 'Name',
            }
        }
    }

    handlePageChange = async (pageNumber) => {
        const params = {
            limit: this.state.limit,
            offset: (pageNumber - 1) * this.state.limit,
            search: this.state.searchText,
        };
        const data = await this.BedMiddleware.getBeds(params);

        this.setState({ beds: data?.beds || [], total: data?.total || 0, currentPage: pageNumber });
        this.deCheckAll();
    };
    handleInputChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let bed = this.state.bed;
        bed[name] = value;
        this.setState({ bed: bed });
    };
    handleAddBed = () => {
        this.setState({
            isOpen: true,
            mode: "add",
            bed: {
                id: 0,
                name: "",
                image_url: "",
            },
            disableSubmit: false
        });
    };
    handleEditBed = (item) => {
        this.setState({
            mode: "edit",
            bed: JSON.parse(JSON.stringify(item)),
            isCollapse: false,
            disableSubmit: false
        });
    };
    // handleUpload = (files) => {
    //     this.setState({
    //         ...this.state,
    //         service: {
    //             ...this.state.service,
    //             image_url: files,
    //         },
    //     });
    // };
    handleClose = () => {
        this.setState({ isOpen: false });
    };
    componentDidMount = async () => {
        const params = {
            limit: this.state.limit,
            offset: 0,
        };
        // let language = this.CommonLanguage.getData();
        const data = await this.BedMiddleware.getBeds(params);
        this.setState({ beds: data?.beds || [], total: data?.total || 0, isReady: true });
    };
    deCheckAll = () => {
        this.idsDelete = [];
        let checks = document.querySelectorAll('.checkbox-bed');
        checks.forEach(check => {
            check.checked = false;
        })

        this.setState({ checkIcon: "none" });
    };
    checkAll = () => {
        this.idsDelete = this.state.beds.map(bed => bed.id);
        let checks = document.querySelectorAll('.checkbox-bed');
        checks.forEach(check => {
            check.checked = true;
        })
        this.setState({ checkIcon: "all" });
    };
    handleToggleCheck = (e, id) => {
        let value = e.target.checked;
        if (value) {
            this.idsDelete = [...this.idsDelete, id]
        } else {
            this.idsDelete = this.idsDelete.filter(idDelete => idDelete != id);
        }
        let checkIcon;
        if (this.idsDelete.length == this.state.beds.length) checkIcon = 'all';
        else if (this.idsDelete.length == 0) checkIcon = 'none';
        else checkIcon = 'deAll';
        this.setState({ checkIcon });
    };

    validateInput = (input) => {
        let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        let formatedInput = input.trim();
        if (formatedInput.length === 0) return false
        for (let c of formatedInput) if (c.match(format)) return false;
        return true;
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        let beds = [...this.state.beds];

        let response;
        if (this.state.mode === "add") {
            if (!this.validateInput(this.state.bed.name)) {
                alert('Name cannot contain special characters')
                return;
            }
            const params = {
                ...this.state.bed,
            };
            this.setState({ disableSubmit: true });
            response = await this.BedMiddleware.createBed(params);
            if (response.status && response.status === 200) {
                this.setState({
                    openModal: true,
                    succeed_message: response.message
                })
                await this.refreshItemsWhenAdd();
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

        } else if (this.state.mode === "edit") {
            if (!this.validateInput(this.state.bed.name)) {
                alert('Name cannot contain special characters')
                return;
            }
            let bed = this.state.bed;
            const params = {
                ...bed
            };
            this.setState({ disableSubmit: true });
            response = await this.BedMiddleware.updateBed(
                bed.id,
                params
            );
            if (response.status && response.status === 200) {
                this.setState({
                    openModal: true,
                    succeed_message: response.message
                })
                await this.handlePageChange(this.state.currentPage);
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
            // this.setState({beds: beds, isCollapse: true});
        }
        this.setState({ disableSubmit: false });
    };
    handleDeleteBed = async (id) => {
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [id],
            };
            let response = await this.BedMiddleware.deleteBed(params);
            if (response.status && response.status === 200) {
                let beds = this.state.beds.filter((bed) => bed.id != id);

                if (beds.length == 0 && this.isLastPageNow()) {
                    if (this.currentPage == 1) this.refreshItemsWhenDelete(1);
                    else this.refreshItemsWhenDelete(this.state.currentPage - 1);
                } else this.refreshItemsWhenDelete(this.state.currentPage);

                this.idsDelete = this.idsDelete.filter(idDelete => idDelete != id);
                this.setState({ checkIcon: 'none' });
                if (this.state.mode == 'edit')
                    this.handleAddBed();
                this.setState({
                    openModal: true,
                    succeed_message: response.message
                })
            } else {
                this.setState({
                    openModal: true,
                    succeed_message: response.message
                })
            }

        }
    };
    handleDeleteCheckedBeds = async () => {
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [...this.idsDelete],
            };
            let response = await this.BedMiddleware.deleteBed(params);
            if (response.status && response.status === 200) {
                let beds = this.state.beds.filter(
                    (bed) => !this.idsDelete.includes(bed.id)
                );
                if (beds.length == 0 && this.isLastPageNow()) {
                    if (this.currentPage == 1) this.refreshItemsWhenDelete(1);
                    else this.refreshItemsWhenDelete(this.state.currentPage - 1);
                } else this.refreshItemsWhenDelete(this.state.currentPage);

                this.idsDelete = [];
                this.setState({ checkIcon: 'none' });
                if (this.state.mode == 'edit') this.handleAddBed();
                this.setState({
                    openModal: true,
                    succeed_message: response.message
                })
            } else {
                this.setState({
                    openModal: true,
                    succeed_message: response.message
                })
            }
        }
    };
    doSearch = (e) => {
        let searchText = e.target.value; // this is the search text
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.doCallApiSearch(searchText);
        }, 500);
        this.setState({ searchText });
    };
    doCallApiSearch = async (searchText) => {
        const params = {
            limit: this.state.limit,
            offset: 0,
            search: searchText,
        };

        const data = await this.BedMiddleware.getBeds(params);

        this.setState({ beds: data?.beds || [], total: data?.total || 0, currentPage: 1 });
    };
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
    getIconCheck = (nameIcon) => {
        switch (nameIcon) {
            case 'all': return (<FaCheckSquare onClick={this.deCheckAll} />)
            case 'deAll': return (<FaMinusSquare onClick={this.deCheckAll} />)
            case 'none': return (<FaRegSquare onClick={this.checkAll} />)
        }
    }
    showEdit = () => {
        setTimeout(() => {
            this.setState({ openModal: false });
            this.handleAddBed();
        }, 1200);
        return (
            <ShowSuccess textConfirm={this.state.succeed_message} />
        )
    }
    render() {
        let language = this.currentLanguages;
        // if (!language in this.CONSTANT_TEXT) {
        //     language = 'en';
        // }
        let nameIcon = this.state.checkIcon;
        return (
            <div>
                <div className="row">
                    <div className="col-4 service-4">
                        <div className="service bed-table-container bed-add-edit">
                            <div
                                className={`table-service form-bed-container ${this.state.isCollapse
                                    ? "collapse-form"
                                    : "expand-form"
                                    }`}
                            >
                                <form
                                    method="post"
                                    onSubmit={this.handleSubmit}
                                >
                                    <div className=".search__form_service flex-items">
                                        {this.state.mode === "add" ? (
                                            <h4>{this.CONSTANT_TEXT[language].addBed}</h4>
                                        ) : (
                                            <h4>{this.CONSTANT_TEXT[language].editBed} #{this.state.bed.id}</h4>
                                        )}
                                        <div className="group-input container">
                                            <div className="title-service title-name-bed">
                                                <h5>{this.CONSTANT_TEXT[language].name}:</h5>
                                                <div className="col-sm-9 input-name-bed">
                                                    <input
                                                        className="form-control-plaintext border border-2 rounded"
                                                        type="text"
                                                        required
                                                        id="name"
                                                        name="name"
                                                        value={
                                                            this.state.bed.name
                                                        }
                                                        onChange={this.handleInputChange}
                                                        onKeyDown={this.handleKeyDown}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btn-container">
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
                                                onClick={this.handleAddBed}
                                            >
                                                {this.CONSTANT_TEXT[language].cancel}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-8 service-8">
                        <div className="service table-list-beds">
                            <div className="table-service">
                                <div className="actions-table-rooms top-actions">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={this.handleDeleteCheckedBeds}
                                        disabled={nameIcon == "none" || this.state.beds.length == 0}
                                    >
                                        <FaTrashAlt />
                                        &ensp;{this.CONSTANT_TEXT[language].delete}
                                    </button>
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
                                </div>
                                <div className="table-container">
                                    <table className="table table-service-col8">
                                        <thead className="table-th">
                                            <tr>
                                                <th>
                                                    {this.getIconCheck(nameIcon)}
                                                </th>
                                                <th>ID</th>
                                                <th className="td-nameService">
                                                    {this.CONSTANT_TEXT[language].bedName}
                                                </th>
                                                <th>{this.CONSTANT_TEXT[language].actions}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.beds.map(
                                                (item, index) => {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <input
                                                                    className='checkbox-bed'
                                                                    type="checkbox"
                                                                    name="check-bed"
                                                                    onChange={(e) =>
                                                                        this.handleToggleCheck(e,
                                                                            item.id
                                                                        )
                                                                    }
                                                                    defaultChecked={false}
                                                                />
                                                            </td>
                                                            <td>{item.id}</td>
                                                            <td>{item.name}</td>

                                                            <td>
                                                                <FaEdit
                                                                    className="fa fa-edit"
                                                                    onClick={() =>
                                                                        this.handleEditBed(
                                                                            item
                                                                        )
                                                                    }
                                                                />{" "}
                                                                <FaTrashAlt
                                                                    className="fa fa-delete"
                                                                    onClick={() =>
                                                                        this.handleDeleteBed(
                                                                            item.id
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {this.state.isReady && <PaginationComponent
                                    total={this.state.total}
                                    limit={this.state.limit}
                                    currentPage={this.state.currentPage}
                                    itemsCount={this.state.beds.length}
                                    onPageChange={(pageNumber) =>
                                        this.handlePageChange(pageNumber)
                                    }
                                />}
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.openModal && this.showEdit()}
            </div>
        );
    }
}
