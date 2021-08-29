import React, { Component } from "react";
import "../../css/BookingComponent.css";
import HotelMiddleware from "../utils/HotelMiddleware";
import CommonLanguage from "../utils/CommonLanguage";
import { FaRegCalendarAlt } from "react-icons/fa";
import ShowMess from "./ShowMess";
import ShowSuccess from "./ShowSuccess";
import { BrowserRouter as Router, Redirect } from "react-router-dom";

class BookingComponent extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        let currentTempDate = new Date().toISOString().split("T")[0];
        this.state = {
            hotel_id: 0,
            name: "",
            email: "",
            phone: "",
            date_from: JSON.parse(sessionStorage.getItem("dateFrom")) || "",
            date_to: JSON.parse(sessionStorage.getItem("dateTo")) || "",
            adult_amount: JSON.parse(sessionStorage.getItem("adult")) || 1,
            children_amount: JSON.parse(sessionStorage.getItem("kid")) || 0,
            room_amount: JSON.parse(sessionStorage.getItem("room")) || 1,
            note: "",
            is_business: false,
            currentDate: currentTempDate,
            checkPhone: true,
            checkName: true,
            checkEmail: true,
            checkDateTo: Boolean(sessionStorage.getItem('dateTo')) || true,
            checkDateFrom: Boolean(sessionStorage.getItem('dateFrom')) || true,
            isSubmit: false,
            isShowSuccess: false,
            isShowMess: false,
            redirectHome: false
            // currentLanguagues: 'vi'
        };
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            vi: {
                info_customer: 'Thông tin khách hàng',
                property_name: 'Tên chỗ nghỉ/ Điểm đến:',
                name_customer: 'Tên khách hàng',
                incorrect_name: 'Tên không đúng',
                phone_number: 'Số điện thoại:',
                phone_number_incorrect: 'Số điện thoại không đúng',
                email: 'Địa chỉ email:',
                email_incorrect: 'Email không đúng.',
                received_date: 'Ngày nhận',
                received_date_incorrect: 'Ngày nhận không đúng.',
                pay_day: 'Ngày trả phòng',
                pay_day_incorrect: 'Ngày trả phòng không đúng',
                adults: 'Người lớn:',
                kids: 'Trẻ em:',
                rooms: 'Phòng:',
                go_to_work: 'Tôi Đi Công Tác',
                contact: 'Liên hệ đặt phòng',
                more_request: 'Thêm yêu cầu đặt biệt',
                question_confirm: 'Xác nhận thông tin của bạn.',
                text_confirm: 'Mời bạn kiểm tra Email và cuộc gọi đến của tư vấn viên.',
                cancel: 'Hủy bỏ',
                confirm: 'Xác nhận',
                successful_contact: 'Liên hệ đặt phòng thành công',
                showMess: 'Khách sạn không tồn tại'
            },
            en: {
                info_customer: 'Customer information',
                property_name: 'Property name/ Destination:',
                name_customer: 'Customer name',
                incorrect_name: 'Name is valid',
                phone_number: 'Phone number:',
                phone_number_incorrect: 'Phone is valid',
                email: 'Email address:',
                email_incorrect: 'Email is valid.',
                received_date: 'Received day',
                received_date_incorrect: 'Received day is valid.',
                pay_day: 'Pay day',
                pay_day_incorrect: 'Pay day is valid',
                adults: 'Adult:',
                kids: 'Child:',
                rooms: 'Room:',
                go_to_work: 'I go to work',
                contact: 'Contact booking',
                more_request: 'Add special request',
                question_confirm: 'Confirm your information.',
                text_confirm: 'Please check your email and incoming call of the consultant.',
                cancel: 'Cancel',
                confirm: 'Confirm',
                successful_contact: 'Contact booking successful!',
                showMess: "The hotel doesn't exist"
            }
        }
        this.HotelMiddleware = new HotelMiddleware();
    }
    getInput = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (
            name === "date_from" &&
            Date.parse(value) > Date.parse(this.state.date_to)
        ) {
            this.setState({ date_to: value });
        }
        this.setState({
            [name]: value,
            hotel_id: this.props.dataBook.id,
            is_business: !this.state.is_business,
        });
    };
    modalBooking = () => {
        let modelLanguage = this.currentLanguages;
        return (
            <div className="container-booking">
                <div className="modal-booking">
                    <div className="modal-content ">
                        <div className="modal-body modal-more-request">
                            <h5 className="modal-title">{this.CONSTANT_TEXT[modelLanguage].more_request}</h5>
                            <textarea name="note" id="note" onChange={this.getInput} value={this.state.note}>
                                {this.state.note}
                            </textarea>
                            <p className="text-confirm text-center">
                                {this.CONSTANT_TEXT[modelLanguage].question_confirm}<br />
                                {this.CONSTANT_TEXT[modelLanguage].text_confirm}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-cancel" onClick={this.handleClose}>
                                {this.CONSTANT_TEXT[modelLanguage].cancel}
                            </button>
                            <button type="submit" onClick={this.handleSubmit} className="btn btn-confirm">
                                {this.CONSTANT_TEXT[modelLanguage].confirm}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    handleSubmit = async (event) => {
        event.preventDefault();
        const bookingData = {
            ...this.state,
            date_from: new Date(this.state.date_from),
            date_to: new Date(this.state.date_to),
        };
        const result = await this.HotelMiddleware.createBooking(bookingData);
        if (result.status == 200) {
            this.setState({
                name: '',
                email: '',
                phone: '',
                date_from: '',
                date_to: '',
                is_business: true,
                adult_amount: 1,
                children_amount: 0,
                room_amount: 1,
                checkPhone: true,
                checkEmail: true,
                checkDateFrom: true,
                checkDateTo: true,
                isShow: false,
                isShowSuccess: true
            });
            this.removeItem();
            setTimeout(
                function () {
                    this.setState({
                        isShowSuccess: false,
                    });
                }.bind(this), 1000
            );
        }
        if (result.status == 404) {
            this.setState({
                isShowMess: true,
                isShow: false,
            })
            setTimeout(
                function () {
                    this.setState({
                        isShowMess: false,
                        redirectHome: true
                    });
                }.bind(this), 1000
            );
        }
    };
    handleInputValidationPhone = () => {
        const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (this.state.phone.length === 0 || this.state.phone.match(regex) === null) {
            this.setState({
                checkPhone: false,

            })
        } else {
            this.setState({
                checkPhone: true,
            })
        }
    };
    handleInputValidateEmail = () => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (this.state.email.length === 0 || this.state.email.match(regex) === null) {
            this.setState({
                checkEmail: false,
            })

        } else {
            this.setState({
                checkEmail: true,
            })
        }
    };
    handleInputValidationName = () => {
        const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/;
        if (this.state.name.length === 0 || this.state.name.match(regex)) {
            this.setState({
                checkName: false,
            })
        } else {
            this.setState({
                checkName: true,
            })
        }
    };
    handleInputValidateDateTo = () => {
        if (this.state.date_to.length === 0) {
            this.setState({
                checkDateTo: false,
            })
        } else {
            this.setState({
                checkDateTo: true,
            })
        }
    };
    handleInputValidateDateFrom = () => {
        if (this.state.date_from.length === 0) {
            this.setState({
                checkDateFrom: false,
            })
        } else {
            this.setState({
                checkDateFrom: true,
            })
        }
    };
    handleNumber = () => {
        if (this.state.adult_amount < 1)
            this.setState({ adult_amount: 1 })
        if (this.state.room_amount < 1)
            this.setState({ room_amount: 1 })
        if (this.state.children_amount < 0)
            this.setState({ children_amount: 0 })
    }
    handleClick = () => {
        this.handleInputValidationName();
        this.handleInputValidateDateFrom();
        this.handleInputValidateDateTo();
        if (this.state.phone.length > 0) {
            this.handleInputValidationPhone();
        }
        else {
            this.handleInputValidateEmail();
        }
        if ((this.state.name.length > 0 && this.state.checkName) &&
            (this.state.phone.length > 8 && this.state.checkPhone
                || this.state.email.length > 0 && this.state.checkEmail)
            && this.state.date_from.length > 0 && this.state.date_to.length > 0) {
            this.setState({
                isShow: true
            })
        } else {
            this.setState({
                flatDateTo: true
            })
        }
    };
    handleClose = () => {
        this.setState({
            isShow: false
        })
    }
    removeItem = () => {
        localStorage.removeItem("dateTo");
        localStorage.removeItem("dateFrom");
        localStorage.removeItem("adult");
        localStorage.removeItem("kid");
        localStorage.removeItem("room");
    };
    componentDidMount = () => {
        let dateFrom = Date.parse(this.state.date_from)
        let dateTo = Date.parse(this.state.date_to)
        if (dateFrom > dateTo) {
            this.setState({
                date_to: this.state.date_from
            })
        }
    };
    render() {
        let language = this.currentLanguages;
        return (
            <div className="contact-form">
                <h2>{this.CONSTANT_TEXT[language].info_customer}</h2>
                <form className="form-booking">
                    <div className="form-group">
                        <label className='label-info'>{this.CONSTANT_TEXT[language].property_name}</label>
                        <input name="hotel_id" onChange={this.getInput} defaultValue={this.props.dataBook.name}
                            type="text" className="form-control hotel-name" readOnly />
                    </div>
                    <div className="form-group">
                        <label className='label-info'>{this.CONSTANT_TEXT[language].name_customer}<span className="checkActive"> (*)</span> : </label>
                        <input id="name" required onBlur={this.handleInputValidationName} name="name"
                            value={this.state.name}
                            onChange={this.getInput} type="text"
                            className={this.state.checkName ? "form-control format" : "form-control format checkInputOpen"} />
                        <label className={this.state.checkName ? "checkLabel" : "checkLabel checkLabelOpen"}
                            id='validName'>{this.CONSTANT_TEXT[language].incorrect_name}</label>
                    </div>
                    <div className="row row-infor-responsive">
                        <div className="col md-right">
                            <div className="form-group">
                                <label className='label-info'>{this.CONSTANT_TEXT[language].phone_number} </label>
                                <input id="phone" required onBlur={this.handleInputValidationPhone} name="phone"
                                    value={this.state.phone} onChange={this.getInput} type="text"
                                    className={this.state.checkPhone ? "form-control" : "form-control checkInputOpen"} />
                                <label className={this.state.checkPhone ? "checkLabel" : "checkLabel checkLabelOpen"}>
                                    {this.CONSTANT_TEXT[language].phone_number_incorrect}
                                </label>
                            </div>
                        </div>
                        <div className="col md-left">
                            <div className="form-group">
                                <label className='label-info'>{this.CONSTANT_TEXT[language].email} </label>
                                <input id="email" required onBlur={this.handleInputValidateEmail} name="email"
                                    value={this.state.email} onChange={this.getInput} type="email"
                                    className={this.state.checkEmail ? "form-control" : "form-control checkInputOpen"}
                                />
                                <label className={this.state.checkEmail ? "checkLabel" : "checkLabel checkLabelOpen"}
                                    id="validEmail">
                                    {this.CONSTANT_TEXT[language].email_incorrect}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row row-calendar-responsive">
                        <div className="col md-right">
                            <div className="form-group date_from">
                                <label className='label-info'>{this.CONSTANT_TEXT[language].received_date}<span className="checkActive"> (*)</span> :
                                </label>
                                <input required onBlur={this.handleInputValidateDateFrom}
                                    name="date_from" value={this.state.date_from}
                                    onChange={this.getInput}
                                    type="date"
                                    onKeyDown={(e) => e.preventDefault()}
                                    data-date-format="DD MMMM YYYY"
                                    className={this.state.checkDateFrom ? "form-control" : "form-control checkInputOpen"}
                                    id="date_to"
                                    min={this.state.currentDate}
                                />
                                <FaRegCalendarAlt className="iconFrom" />
                                <label
                                    className={this.state.checkDateFrom ? "checkLabel" : "checkLabel checkLabelOpen"}
                                    id="validDateTo">
                                    {this.CONSTANT_TEXT[language].received_date_incorrect}
                                </label>
                            </div>
                        </div>
                        <div className="col md-left">
                            <div className="form-group date_to">
                                <label className='label-info'>
                                    {this.CONSTANT_TEXT[language].pay_day}
                                    <span className="checkActive"> (*)</span>
                                </label>
                                <input
                                    required
                                    onBlur={this.handleInputValidateDateTo}
                                    name="date_to"
                                    value={this.state.date_to}
                                    onChange={this.getInput}
                                    data-date-format="DD MMMM YYYY"
                                    type="date"
                                    onKeyDown={(e) => e.preventDefault()}
                                    id="date_from"
                                    className={
                                        this.state.checkDateTo
                                            ? "form-control"
                                            : "form-control checkInputOpen"
                                    }
                                    min={this.state.date_from}
                                />
                                <FaRegCalendarAlt className="iconTo" />
                                <label className={this.state.checkDateTo ? "checkLabel" : "checkLabel checkLabelOpen"}
                                    id='validDateFrom'>{this.CONSTANT_TEXT[language].pay_day_incorrect}</label>
                            </div>
                        </div>
                    </div>
                    <div className="row row-selection-responsive">
                        <div className="col col-right">
                            <div className="form-group">
                                <label className='label-info'>{this.CONSTANT_TEXT[language].adults}</label>
                                <input required name="adult_amount" value={this.state.adult_amount}
                                    onChange={this.getInput} onBlur={this.handleNumber}
                                    min="1" type="number" className="form-control" />
                            </div>
                        </div>
                        <div className="col col">
                            <div className="form-group">
                                <label className='label-info'>{this.CONSTANT_TEXT[language].kids}</label>
                                <input required name="children_amount" value={this.state.children_amount}
                                    onChange={this.getInput} onBlur={this.handleNumber}
                                    min="0" type="number" className="form-control" />
                            </div>
                        </div>
                        <div className="col col-left">
                            <div className="form-group">
                                <label className='label-info'>{this.CONSTANT_TEXT[language].rooms}</label>
                                <input required name="room_amount" value={this.state.room_amount}
                                    onChange={this.getInput} onBlur={this.handleNumber}
                                    min="1" type="number" className="form-control" />
                            </div>
                        </div>
                    </div>
                    <label className="checkbox-inline">
                        <input onChange={this.getInput} type="checkbox" value={this.state.is_business}
                            className='checkbox-i-go' />
                        <span className='checkbox-inline-text'>{this.CONSTANT_TEXT[language].go_to_work}</span>
                    </label>
                    <button type="button" onClick={this.handleClick}
                        className="contact btn btn-block">
                        {this.CONSTANT_TEXT[language].contact}
                    </button>
                </form>
                {this.state.isShow ? this.modalBooking() : null}
                {this.state.isShowMess ? <ShowMess showMess={this.CONSTANT_TEXT[language].showMess} /> : null}
                {this.state.isShowSuccess ? <ShowSuccess textConfirm={this.CONSTANT_TEXT[language].successful_contact} /> : null}
                {this.state.redirectHome ? <Redirect to="/" /> : ''}
            </div>
        );
    }
}

export default BookingComponent;
