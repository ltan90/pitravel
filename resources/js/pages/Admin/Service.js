import React, { Component } from "react";
import {
    FaEdit,
    FaSearch,
    FaTrashAlt,
    FaMinusSquare,
    FaCheckSquare,
    FaRegSquare,
} from "react-icons/fa";
import LoadingComponent from "../../components/LoadingComponent";
import HotelMiddleware from "../../utils/HotelMiddleware";
import "../../../css/ServiceAdmin.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import PaginationComponent from "../../components/PaginationComponent";
import UploadSingleFile from "../../components/Admin/UploadSingleFile";
import CommonLanguage from "../../utils/CommonLanguage";
import ShowSuccess from "../../components/ShowSuccess";

export default class Service extends Component {
    constructor(props) {
        super(props);
        this.CONSTANT_TEXT = {
            vi: {
                id: 'ID',
                name: 'Tên dịch vụ',
                image: 'Ảnh',
                action: 'Hành động',
                add: 'Thêm',
                edit: 'Chỉnh sửa',
                delete: 'Xóa',
                cancel: 'Hủy bỏ',
                save: 'Lưu'
            },
            en: {
                id: 'ID',
                name: 'Service Name',
                image: 'Image',
                action: 'Action',
                add: 'Add',
                edit: 'Edit',
                delete: 'Delete',
                cancel: 'Cancel',
                save: 'Save'
            },
        }
        this.CommonLanguage = new CommonLanguage();

        this.state = {
            loading: true,
            removeImgId: 0,
            dataById: [],
            services: [],
            isOpen: false,
            service: {
                id: 0,
                name: "",
                image_url: "",
            },
            mode: "add",
            show: false,
            limit: 15,
            total: 0,
            currentPage: 1,
            isChecked: false,
            checkIcon: "none",
            error_message_image: '',
            error_message_name: '',
            succeed_message: '',
            remove_id: 0,
            imgRemove: '',
            hidden: false,
            disableSubmit: false,
            openModel: false,
        };
        this.idsDelete = [];
        this.HotelMiddleware = new HotelMiddleware();
        this.currentLanguages = this.CommonLanguage.getData();
    }
    // region handler Event
    handlePageChange = async (pageNumber) => {
        const params = {
            limit: this.state.limit,
            offset: (pageNumber - 1) * this.state.limit,
        };
        const response = await this.HotelMiddleware.getServices(params);
        this.setState({ services: response.services, currentPage: pageNumber, total: response.total });
    };
    handleInputChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let service = this.state.service;
        service[name] = value;
        this.setState({ service: service });
    };
    handleAddService = () => {
        this.setState({
            // isOpen: true,
            mode: "add",
            service: {
                id: 0,
                name: '',
                image_url: ''
            },
            remove_id: 0,
            error_message_image: '',
            error_message_name: '',
            disableSubmit: false,
        });
        this.handlePageChange(1)
        document.getElementsByClassName("inputClear")[0].value = "";
    };
    handleEditService = async (item) => {
        const dataById = await this.HotelMiddleware.getServiceById(item.id);
        this.setState({
            mode: "edit",
            hidden: false,
            service: JSON.parse(JSON.stringify(item)),
            dataById: dataById,
            error_message_image: '',
            error_message_name: '',
            disableSubmit: false,
        });
    };
    handleDeleteServices = async () => {
        await this.setState({ mode: 'delete' })
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [...this.idsDelete],
                ...this.state.service,
            };
            let data = await this.HotelMiddleware.deleteServices(params);
            let service_API = await this.HotelMiddleware.getServices(params);

            let filterServices = this.state.services.filter(
                (service) => !this.idsDelete.includes(service.id)
            );
            let checks = document.querySelectorAll('.input-checkbox-service');
            checks.forEach(check => {
                check.checked = false;
            })
            this.setState({
                filterServices,
                checkIcon: 'none',
                services: service_API.services.map((service) => ({
                    ...service,
                })),
                total: service_API.total,
            });
            this.deCheckAll();
            if (this.state.mode == 'edit') this.handleAddService();
            if (data.status && data.status === 200) {
                this.setState({
                    succeed_message: data.message,
                    openModal: true
                })
            }
        }
    };
    handleDeleteService = async (id) => {
        await this.setState({ mode: 'delete' })
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [id],
                ...this.state.service,
            };
            let data = await this.HotelMiddleware.deleteServices(params);
            let service_API = await this.HotelMiddleware.getServices(params);
            let filterServices = this.state.services.filter((service) => service.id != id);
            this.setState({
                filterServices,
                checkIcon: 'none',
                services: service_API.services.map((service) => ({
                    ...service,
                })),
                total: service_API.total,
            });
            this.deCheckAll();
            if (this.state.mode == 'edit') this.handleAddService();
            if (data.status && data.status === 200) {
                this.setState({
                    succeed_message: data.message,
                    openModal: true
                })
            }
        }
    };
    handleUpload = (files) => {
        if (files) {
            this.setState({
                ...this.state,
                service: {
                    ...this.state.service,
                    image_url: files,
                },
                hidden: true
            })
        }
    };
    handleToggleCheck = (e, id) => {
        let value = e.target.checked;
        if (value) {
            this.idsDelete = [...this.idsDelete, id]
        } else {
            this.idsDelete = this.idsDelete.filter(idDelete => idDelete != id);
        }
        let checkIcon;
        if (this.idsDelete.length == this.state.services.length) checkIcon = 'all';
        else if (this.idsDelete.length == 0) checkIcon = 'none';
        else checkIcon = 'deAll';
        this.setState({ checkIcon });
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        let services = [...this.state.services];
        if (this.state.services.id == 0) return;
        let response;
        if (!this.validateInput(this.state.service.name)) {
            this.setState({
                error_message_name: 'Name cannot contain special characters!'
            })
            return;
        }
        if (this.state.service.image_url === '') {
            this.setState({
                error_message_image: 'Image not Valid!'
            })
            return;
        }
        if (this.state.service.image_url === '') {
            alert('Image not Valid')
            return;
        }
        const formData = new FormData();
        const params = {
            ...this.state.service,
        };
        if (this.state.mode === "add") {
            formData.append('name', params.name);
            formData.append('image', this.state.service.image_url[0]);
            this.setState({ disableSubmit: true });

            response = await this.HotelMiddleware.createServices(formData);
            if (response.status === 200) {
                this.setState({
                    succeed_message: response.message,
                    openModal: true
                })
            }
            let newService = response.data;
            services = [newService, ...services]
            this.setState({
                services,
                show: true,
            });
            this.handleAddService();
        } else if (this.state.mode === "edit") {
            formData.append('name', params.name);
            formData.delete('image', params.removeImgId);
            if (this.state.remove_id) {
                formData.append('remove_id', this.state.remove_id);
            }
            if (this.state.hidden === true && params.image_url) {
                formData.append('image', this.state.service.image_url[0]);
            }
            formData.append('_method', 'PUT');
            this.setState({ disableSubmit: true });

            response = await this.HotelMiddleware.updateServices(params.id, formData);
            if (response.status === 200) {

                this.setState({
                    succeed_message: response.message,
                    openModal: true
                })
            }

        }
        this.setState({ disableSubmit: false });
    };
    handleClose = () => {
        this.setState({ isOpen: false });
    };
    // endregion
    showModal = () => {
        setTimeout(() => {
            this.setState({ openModal: false });
            this.handleAddService();
        }, 1200);
        return (
            <ShowSuccess textConfirm={this.state.succeed_message} />
        )
    }

    deCheckAll = () => {
        this.idsDelete = [];
        let checks = document.querySelectorAll('.input-checkbox-service');
        checks.forEach(check => {
            check.checked = false;
        })
        this.setState({ checkIcon: "none" });
    };
    checkAll = () => {
        this.idsDelete = this.state.services.map(service => service.id);
        let checks = document.querySelectorAll('.input-checkbox-service');
        checks.forEach(check => {
            check.checked = true;
        })
        this.setState({ checkIcon: "all" });
    };
    validateInput = (input) => {
        let format = /^[!@#$%^*()_+\-=\[\]{};':"\\|,.<>\?]*$/;
        let formatedInput = input.trim()
        if (formatedInput.length === 0) return false
        for (let c of formatedInput) {
            if (c.match(format)) return false;
            return true;
        }
    };
    componentDidMount = async () => {
        const params = {
            limit: this.state.limit,
            offset: 0,
        };
        const data = await this.HotelMiddleware.getServices(params);
        const services = data.services
        this.setState({
            services,
            total: data.total,
            loading: false,
        });
    };
    ChangeInput = () => {
        let language = this.currentLanguages;
        return (
            <div>
                <div className="title-service">
                    <h5>{this.CONSTANT_TEXT[language].name}:</h5>
                </div>
                <input
                    className="form-control inputService inputService-name"
                    type="text" id="name" name="name" required
                    value={this.state.service.name}
                    onChange={
                        this.handleInputChange
                    }
                />
                {this.state.error_message_name
                    ? <div className="error-image">{this.state.error_message_name}</div>
                    : null
                }
                <h5>{this.CONSTANT_TEXT[language].image}</h5>
                <UploadSingleFile isMultiple={false} handleUpload={(files) => this.handleUpload(files)} />
                {this.state.error_message_image
                    ? <div className="error-image">{this.state.error_message_image}</div>
                    : null
                }
            </div>
        );
    };
    DeleteImg = (id) => {
        let remove_id = id;
        this.setState({
            ...this.state,
            hidden: true,
            service: {
                ...this.state.service,
            }, remove_id,
            imgRemove: id
        })
    };
    showImg = () => {
        if (this.state.dataById.images) {
            return (
                <div className='list-edit-img'>
                    {this.state.dataById.images.map((image, index) => {
                        return (
                            <div id={image.id} className={this.state.hidden === true ? 'img-edit-service-remove' : 'img-edit-service'} key={index}>
                                <img key={index} className="image-service"
                                    src={image.url} alt={'Service'} />
                                <span className='delete-img-edit-service' onClick={(e) => this.DeleteImg(image.id)}>
                                </span>
                            </div>
                        )
                    })}
                </div>
            )
        }
    };
    getIconCheck = (nameIcon) => {
        switch (nameIcon) {
            case 'all': return (<FaCheckSquare onClick={this.deCheckAll} />)
            case 'deAll': return (<FaMinusSquare onClick={this.deCheckAll} />)
            case 'none': return (<FaRegSquare onClick={this.checkAll} />)
        }
    }
    render() {
        let language = this.currentLanguages
        let nameIcon = this.state.checkIcon;
        const { loading } = this.state
        if (loading) return <LoadingComponent />
        return (
            <div>
                <div className="row">
                    <div className="col-4 service-4">
                        <div className="service service-add-edit">
                            <div className="table-service">
                                <form
                                    method="post"
                                    onSubmit={this.handleSubmit}
                                >
                                    <div className=".search__form_service">
                                        {this.state.mode === "add" ?
                                            <h4>{this.CONSTANT_TEXT[language].add}</h4> :
                                            <div>
                                                <h4>{this.CONSTANT_TEXT[language].edit}</h4>
                                                <label className="inputService"><h5>Id: {this.state.service.id}</h5></label>
                                                {this.showImg()}
                                            </div>
                                        }
                                        <div className='group-input'>
                                            <div className="search__list">
                                                {this.ChangeInput()}
                                            </div>
                                        </div>
                                    </div>
                                    <button disabled={this.state.disableSubmit} type="submit" className="btn btn-primary submitService" >
                                        {this.CONSTANT_TEXT[language].save}
                                    </button>
                                    {this.state.mode === "edit" ? <button
                                        type="button"
                                        className="btn btn-secondary  submitService"
                                        onClick={this.handleAddService}
                                    >
                                        {this.CONSTANT_TEXT[language].cancel}
                                    </button> : null}
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-8 service-8">
                        <div className="service table-list-service">
                            <div className="table-service table-service-8">
                                <div className="actions-table">
                                    <button
                                        disabled={nameIcon == "none"}
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={this.handleDeleteServices}
                                    >
                                        <FaTrashAlt />
                                        &ensp;{this.CONSTANT_TEXT[language].delete}
                                    </button>
                                </div>
                                <table className="table table-service-col8">
                                    <thead className="table-th">
                                        <tr>
                                            <th>
                                                {this.getIconCheck(nameIcon)}
                                            </th>
                                            <th>{this.CONSTANT_TEXT[language].id}</th>
                                            <th className='td-nameService'>{this.CONSTANT_TEXT[language].name}</th>
                                            <th>{this.CONSTANT_TEXT[language].image}</th>
                                            <th>{this.CONSTANT_TEXT[language].action}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.services.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            name="check"
                                                            id="check"
                                                            className='input-checkbox-service'
                                                            onChange={(e) => this.handleToggleCheck(e, item.id)}
                                                            defaultChecked={false}
                                                        />
                                                    </td>
                                                    <td>{item.id}</td>
                                                    <td className="text-truncate-table">{item.name}</td>
                                                    <td><img className="list-img" src={item.image_url} alt={'Service'} /></td>
                                                    <td>
                                                        <FaEdit
                                                            className="fa fa-edit me-2"
                                                            onClick={() => this.handleEditService(item)}
                                                        />
                                                        <FaTrashAlt
                                                            className="fa fa-delete"
                                                            onClick={() => this.handleDeleteService(item.id)}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <PaginationComponent
                                    total={this.state.total}
                                    limit={this.state.limit}
                                    currentPage={this.state.currentPage}
                                    itemsCount={this.state.services.length}
                                    onPageChange={(pageNumber) => this.handlePageChange(pageNumber)} />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.openModal && this.showModal()}
            </div>
        );
    }
}
