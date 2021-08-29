import React, { Component } from 'react'
import HotelMiddleware from '../../utils/HotelMiddleware';
import Editor from './Editor';
import UploadImages from './UploadImages';
import ReactStars from "react-rating-stars-component";
import MapComponent from "./MapComponent";
import { FaTrashAlt } from "react-icons/fa";
import CommonLanguage from '../../utils/CommonLanguage';
import NumberFormat from 'react-number-format';
import ServicesAdmin from './ServicesAdmin';
export default class AddHotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            removeImgId: 0,
            hotels: [],
            hotelId: this.props.hotel.id,
            hotel: this.props.hotel,
            mode: this.props.mode,
            dataGeneral: [],
            data: [],
            total: 0,
            dataLocation: [],
            locations: this.props.locations,
            isOpen: false,
            status: 0,
            remove_ids: [],
            typeAdd: '',
            addSuccess: true,
            multipleFile: [],
            post_name: "",
            post_content: "",
            is_activated: 1,
            isServices: [],
            services: [],
            message: '',
            isChecked: false,
            removeImg: false,
            removeContent: false,
            isDefaultCoordinates: false,
            checkPhone: true,
            checkPrice: true,
            disableSubmit: false,
        };
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            en: {
                hotel_info: 'Hotel Information',
                location: 'Location',
                hotel_name: 'Hotel name',
                email: 'Email',
                phone: 'Phone',
                address: 'Address',
                price: 'Price',
                service: 'Service',
                description: 'Description',
                introduce: 'Introduce',
                evaluation: 'Evaluation',
                active: 'Active',
                add_image: 'Add image',
                coordinate: 'Coordinate',
                title: 'Title',
                content: 'Content',
                add_more: 'Add More',
                add: 'Add',
                cancel: 'Cancel',
                edit: 'Edit'
            },
            vi: {
                hotel_info: 'Thông tin khách sạn',
                location: 'Tỉnh thành',
                hotel_name: 'Tên khách sạn',
                email: 'Email',
                phone: 'Số điện thoại',
                address: 'Địa chỉ',
                price: 'Giá',
                service: 'Dịch vụ',
                description: 'Mô tả',
                introduce: 'Giới thiệu',
                evaluation: 'Đánh giá',
                active: 'Trạng thái',
                add_image: 'Thêm ảnh',
                coordinate: 'Toạ độ',
                title: 'Tiêu đề',
                content: 'Nội dung',
                add_more: 'Thêm tiếp',
                add: 'Thêm',
                cancel: 'Huỷ bỏ',
                edit: 'Chỉnh sửa'
            }
        }
        this.service_ids = [];
        this.HotelMiddleware = new HotelMiddleware();
    }
    componentWillMount() {
        if (!this.state.hotel.description) {
            this.setState({
                ...this.state,
                hotel: {
                    ...this.state.hotel,
                    description: ""
                }
            })
        }
    }
    async componentDidMount() {
        const params_service = {
            limit: 20,
            offset: 0,
        };

        const dataServices = await this.HotelMiddleware.getServices(params_service);
        const services = dataServices.services

        const hotelId = this.props.hotel.id;
        const data = await this.HotelMiddleware.getHotelById(hotelId);
        if (data.services) {
            this.service_ids = data.services.map(service => service.service_id);
        }
        this.setState({
            data: data,
            services: services,
            total: dataServices.total,
        });
        if (this.state.data.id > 0) {
            this.setState({
                ...this.state,
                hotel: {
                    ...this.state.hotel,
                    lat: this.state.data.lat,
                    long: this.state.data.long,
                }
            })
            if (this.state.data.posts) {
                this.setState({
                    ...this.state,
                    hotel: {
                        ...this.state.hotel,
                        post_name: this.state.data.posts.name ? this.state.data.posts.name : "",
                        post_content: this.state.data.posts.content ? this.state.data.posts.content : "",
                    }
                })
            }
        }
    }
    createSelectionByLocationId = (locationId) => {
        let locationName = '';
        let locations = [...this.state.locations];
        if (locationId > 0) {
            locations.map((location, index) => {
                if (location.id === locationId) {
                    locationName = location.name;
                    return;
                }
            })
        }
        return (
            <>
                <input className="form-control" list="dataLocal" autoComplete="off" required defaultValue={locationName}
                    id="location_id" name="location_id" placeholder="Type to search..."
                    onChange={this.changeLocation} />
                <datalist id="dataLocal">
                    {locations.map((location, index) =>
                        <option key={index} value={location.name} />
                    )}
                </datalist>
            </>
        );
    }
    changeLocation = (e) => {
        let id = 0;
        let name = e.target.value;
        let locations = [...this.state.locations];
        locations.map((location, index) => {

            if (location.name.toLowerCase() === name.toLowerCase()) {
                id = location.id;
                return;
            }
        })
        this.setState({
            ...this.state,
            hotel: {
                ...this.state.hotel,
                location_id: id
            }
        })
    }
    ratingChanged = (newRating) => {
        this.setState({
            ...this.state,
            hotel: {
                ...this.state.hotel,
                evaluation: newRating
            }
        })
    }
    handleAdd = () => {
        this.setState({
            ...this.state,
            hotel: {
                ...this.state.hotel,
                id: 0,
                name: '',
                email: '',
                phone: '',
                address: '',
                description: '',
                locationId: 0,
                is_activated: 1,
                evaluation: 1,
                price: '',
                image: [],
                disableSubmit: false,
            },
            removeContent: true,
        })
        // this.createSelectionByLocationId(0);
        let input = document.getElementsByClassName("inputClear");
        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
    };
    deleteImage = (id) => {
        let removeTag = document.getElementById(`${id}`)
        removeTag.parentElement.remove();
        let remove_ids = [...this.state.remove_ids, id];
        this.setState({
            ...this.state,
            hotel: {
                ...this.state.hotel,
            }, remove_ids
        })
    }
    handleInputPostName = (name) => {
        this.setState({
            ...this.state,
            hotel: {
                ...this.state.hotel,
                post_name: name
            }
        })
    }
    handleInputEditor = (content) => {
        this.setState({
            ...this.state,
            hotel: {
                ...this.state.hotel,
                post_content: content
            }
        })
    }
    handleUpload = (files) => {
        let input = [];
        files.map(value => {
            input.push(value.file);
        })
        this.setState({
            ...this.state,
            hotel: {
                ...this.state.hotel,
                image: input
            }
        })
    }
    handleCoordinates = (lat, lng) => {
        this.setState({
            ...this.state,
            isDefaultCoordinates: true,
            hotel: {
                ...this.state.hotel,
                lat, lng
            }
        })
    }
    addAHotel = (e) => {
        this.setState({
            typeAdd: e.target.innerHTML
        })
        document.getElementsByClassName('add-more')[0].click()
    }
    onRemoveInput = () => {
        this.setState({
            ...this.state,
            hotel: {
                ...this.state.hotel,
                image: []
            }
        })
    }
    showImg = () => {
        if (this.state.data.images) {
            return (
                this.state.data.images.map((image, index) => {
                    return (
                        <div className="col-2 m-1 img-hotel position-relative" key={index}>
                            <img key={index} src={image.url} />
                            <div id={image.id}
                                onClick={(e) => this.deleteImage(image.id)}>
                                <span className="position-absolute delete-sign">  <FaTrashAlt /></span>
                            </div>
                        </div>
                    )
                })
            )
        }
    }
    isAddHotel = () => {
        if (this.state.mode === "add") {
            return (
                <>
                    <button disabled={this.state.disableSubmit} type="submit" className="btn btn-primary add-more me-3">{this.CONSTANT_TEXT[this.currentLanguages].add_more}</button>
                    <button disabled={this.state.disableSubmit} className="btn btn-primary me-3" onClick={(e) => this.addAHotel(e)}>{this.CONSTANT_TEXT[this.currentLanguages].add}</button>
                </>
            )
        }
        else return <button disabled={this.state.disableSubmit} type="submit" className="btn btn-primary add-more me-3">{this.CONSTANT_TEXT[this.currentLanguages].edit}</button>
    }
    handleInputChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let type = e.target.type;
        let hotel = this.state.hotel;
        if (type == "checkbox") {
            this.setState({
                ...this.state,
                hotel: {
                    ...this.state.hotel,
                    is_activated: e.target.checked === true ? 1 : 0
                }
            })
        } else {
            hotel[name] = value;
            this.setState({ hotel: hotel });
        }
    }
    handleInputValidationPhone = () => {
        const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (this.state.hotel.phone.length === 0 || this.state.hotel.phone.match(regex) === null) {
            this.setState({
                checkPhone: false,

            })
        } else {
            this.setState({
                checkPhone: true,
            })
        }
    };
    handleInputValidationPrice = () => {
        const regex = !/^[0-9]\d*(\.\d+)?$/.test(this.state.hotel.price);
        if (this.state.hotel.price.length > 0 && regex) {
            this.setState({
                checkPrice: false,

            })
        } else {
            this.setState({
                checkPrice: true,
            })
        }
    }
    getDataService = (data) => {
        this.service_ids = data;
    }
    setPrice = () => {
        if (this.state.hotel.price < 0) {
            this.setState({
                ...this.state,
                hotel: {
                    ...this.state.hotel,
                    price: 0
                }
            })
        }
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        let response;
        const formData = new FormData();
        const params = {
            ...this.state.hotel,
        };
        formData.append('location_id', params.location_id);
        formData.append('name', params.name);
        formData.append('email', params.email);
        formData.append('phone', params.phone);
        formData.append('address', params.address);
        if (params.price) {
            formData.append('price', params.price.toString().replaceAll('.', ''));
        }
        formData.append('description', params.description)
        formData.append('evaluation', params.evaluation);
        formData.append('is_activated', params.is_activated);
        if (this.state.isDefaultCoordinates === true) {
            formData.append('lat', params.lat);
            formData.append('long', params.lng);
        }
        formData.append('post_content', params.post_content);
        formData.append('post_name', params.post_name);
        formData.delete('image[]', this.state.removeImgId);
        if (params.image) {
            params.image.forEach(file => {
                formData.append('image[]', file);
            })
        }
        if (this.service_ids) {
            this.service_ids.forEach(file => {
                formData.append('service_ids[]', file);
            })
        }
        if (this.state.remove_ids) {
            this.state.remove_ids.forEach(id => {
                formData.append('remove_ids[]', id);
            })
        }
        if (this.state.mode === "add") {
            this.setState({ disableSubmit: true });
            response = await this.HotelMiddleware.createHotel(formData);
            if (response.status === 200) {
                alert('Add Success')
                await this.props.onPageChange(1);
                if (this.state.typeAdd == 'Add' || this.state.typeAdd == 'Thêm') {
                    this.props.isOpenForm(this.state.isOpen)
                }
                this.props.isAddSuccess(this.state.addSuccess)
                this.handleAdd();
                this.setState({ removeContent: false })
            }
            else {
                this.setState({
                    ...this.state,
                    message: response.message || ''
                })

            }
        } else if (this.state.mode === "edit") {
            formData.append('_method', 'PUT');
            this.setState({ disableSubmit: true });
            let response = await this.HotelMiddleware.updateHotel(params.id, formData);
            if (response.status === 200) {
                alert('Edit Success');
                await this.props.onPageChange(1);
                this.props.isOpenForm(this.state.isOpen)
            }
        }
        this.setState({ disableSubmit: false });
    }
    handlePrice = () => {
        if (this.state.hotel.price < 0) {
            this.setState({
                ...this.state,
                hotel: {
                    ...this.state.hotel,
                    price: 0
                },
            })
        }
    }
    render() {
        let language = this.currentLanguages;
        return (
            <form className="form needs-validation" id="form" name="contact-form" method="post" onSubmit={this.handleSubmit} encType="multipart/form-data">
                <div className="row mx-3 mt-3">
                    <div className="col-3">
                        <div className="card">
                            <h5 className="card-header">
                                {this.CONSTANT_TEXT[language].hotel_info}:
                            </h5>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">{this.CONSTANT_TEXT[language].location}:</label>
                                    {this.createSelectionByLocationId(this.state.hotel.location_id)}
                                    {this.state.message ? <lable className="text-danger mt-1">{this.state.message}</lable> : ''}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{this.CONSTANT_TEXT[language].hotel_name}:</label>
                                    <input className="form-control inputClear" type="text" name="name" required
                                        value={this.state.hotel.name} onChange={this.handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{this.CONSTANT_TEXT[language].email}:</label>
                                    <div className="input-group inputClear">
                                        <span className="input-group-text" id="inputGroupPrepend2">@</span>
                                        <input className="form-control inputClear" type="email" name="email" required
                                            value={this.state.hotel.email}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{this.CONSTANT_TEXT[language].phone}:</label>
                                    <input className="form-control inputClear" type="text" name="phone" required
                                        value={this.state.hotel.phone} onChange={this.handleInputChange}
                                        onBlur={this.handleInputValidationPhone}
                                    />
                                    <label className={this.state.checkPhone ? "d-none mt-1" : "d-block text-danger mt-1"}>Incorrect phone number</label>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{this.CONSTANT_TEXT[language].address}:</label>
                                    <input className="form-control inputClear" type="text" name="address" required
                                        value={this.state.hotel.address} onChange={this.handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" >{this.CONSTANT_TEXT[language].price}:</label>
                                    <div className="input-group">
                                        <span className="input-group-text" id="inputGroupPrepend2">đ</span>
                                        <NumberFormat thousandSeparator={'.'} decimalSeparator={','} onChange={this.handleInputChange}
                                            value={this.state.hotel.price} onBlur={this.setPrice} className="form-control" type="text" name="price" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{this.CONSTANT_TEXT[language].service}:</label>
                                    <div className="group-services">
                                        <ServicesAdmin
                                            dataServiceOfHotel={this.state.data.services}
                                            dataServicesAll={this.state.services}
                                            getDataService={(data) => this.getDataService(data)} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{this.CONSTANT_TEXT[language].description}:</label>
                                    <textarea className="form-control inputClear" name="description"
                                        value={this.state.hotel.description} rows="3" onChange={this.handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="card">
                            <h5 className="card-header">
                                Introduce
                            </h5>
                            <div className="card-body">
                                <div className="form-group mb-3">
                                    <label className="form-label">{this.CONSTANT_TEXT[language].evaluation}:</label>
                                    <ReactStars count={5}
                                        onChange={this.ratingChanged}
                                        size={30}
                                        activeColor="#ffd700" value={this.state.hotel.evaluation}
                                    />
                                </div>

                                <div className="form-group my-3">
                                    <div className="form-check form-switch">
                                        <input className="form-control form-check-input px-4 py-2 me-2" type="checkbox"
                                            name="is_activated" defaultChecked={this.state.hotel.is_activated}
                                            onChange={this.handleInputChange}
                                        />
                                        <label className="form-check-label">{this.CONSTANT_TEXT[language].active}</label>
                                    </div>
                                </div>
                                <div className="row mx-1 mb-3">
                                    {this.showImg()}
                                </div>
                                <UploadImages isMultiple={true} handleUpload={(files) => this.handleUpload(files)} onRemoveInput={this.onRemoveInput}
                                    removeImg={this.state.removeImg}
                                // removeContent={this.state.removeContent}
                                />
                                <div className="gg-map mx-2">
                                    <label className="form-label">{this.CONSTANT_TEXT[language].coordinate}:</label>
                                    <MapComponent
                                        dataLocation={this.state.dataLocation}
                                        hotelId={this.state.hotelId}
                                        lat={this.state.hotel.lat}
                                        lng={this.state.hotel.long}
                                        handleCoordinates={(lat, lng) => this.handleCoordinates(lat, lng)} />
                                    <p className="mt-2">Note: Drag and drop marker or double click to mark coordinates</p>
                                </div>
                                <Editor post_content={this.state.hotel.post_content} hotelId={this.state.hotelId}
                                    removeContent={this.state.removeContent}
                                    handleInputPostName={(params) => this.handleInputPostName(params)}
                                    handleInputEditor={(params) => this.handleInputEditor(params)} />
                            </div>
                        </div>
                        <div className="d-grid d-md-flex justify-content-md-end mb-5 mt-3" role="group" aria-label="Basic example">
                            {this.isAddHotel()}
                            <span className="btn btn-secondary cancel-add"
                                onClick={() => this.props.isOpenForm(this.state.isOpen)}>{this.CONSTANT_TEXT[language].cancel}</span>
                        </div>

                    </div>
                </div>
            </form>
        )
    }
}