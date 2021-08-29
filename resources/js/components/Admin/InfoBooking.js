import React, { Component } from 'react';
import '../../../css/InfoBooking.css'
import CommonLanguage from '../../utils/CommonLanguage';

class InfoBooking extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.CONSTANT_TEXT = {
            vi: {
                label_header: 'HỆ THỐNG THÔNG TIN PIBOOKING.VN',
                info_booking: 'THÔNG TIN BOOKING',
                info_customer: 'Thông Tin Khách Hàng',
                label_name: 'Họ Tên Khách Hàng:',
                label_address: 'Địa Chỉ',
                label_phone: 'Số điện thoại:',
                info_hotel: 'Thông Tin Khách Sạn',
                name_hotel: 'Tên Khách Sạn:',
                day_to: 'Ngày Đến',
                days_go: 'Ngày Đi',
                adults: 'Người Lớn',
                kids: 'Trẻ Em',
                rooms: 'SL.Phòng',
                business: 'Đi công tác',
                request: 'Nội Dung Yêu Cầu Đặc Biệt:',
                note: 'Thông tin được gửi từ hệ thống Booking của website'
            },
            en: {
                label_header: 'PIBOOKING.VN INFORMATION SYSTEM',
                info_booking: 'BOOKING INFORMATION',
                info_customer: 'Customer information',
                label_name: 'Customer full name: ',
                label_address: 'Address',
                label_phone: 'Phone Number:',
                info_hotel: 'Hotel Information',
                name_hotel: 'Hotel Name:',
                day_to: 'Arrival Date',
                days_go: 'Days to go',
                adults: 'Adults',
                kids: 'Kids',
                rooms: 'Rooms',
                business: 'Business travel',
                request: 'Special Request Content:',
                note: 'Information sent from the website Booking system'
            }
        }
        this.currentLanguages = this.CommonLanguage.getData()
    }

    render() {
        let language = this.currentLanguages;
        return (
            <div className='group-info-booking'>
                <div className='info-booking'>
                    <div className='header-info-booking'>
                        <h3>{this.CONSTANT_TEXT[language].label_header}</h3>
                        <p>01/02/2021</p>
                    </div>
                    <div className='content-info-booking'>
                        <div className='label-content-info'>
                            <p>{this.CONSTANT_TEXT[language].info_booking}</p>
                        </div>
                        <div className='group-info'>
                            <div className='label-group-info'>{this.CONSTANT_TEXT[language].info_customer}g</div>
                            <div className='info-customer'>
                                <p>{this.CONSTANT_TEXT[language].label_name}</p>
                                <span>NGUYỄN VĂN A</span>
                            </div>
                            <div className='info-customer'>
                                <p>{this.CONSTANT_TEXT[language].label_address}</p>
                                <span>06 Lê Lợi, Thành phố Huế</span>
                            </div>
                            <div className='info-customer'>
                                <p>{this.CONSTANT_TEXT[language].label_phone}</p>
                                <span>076217198</span>
                            </div>
                            <div className='info-customer'>
                                <p>Email:</p>
                                <span>pibooking@gmail.com</span>
                            </div>
                        </div>
                        <div className='group-info'>
                            <div className='label-group-info'>{this.CONSTANT_TEXT[language].info_hotel}</div>
                            <div className='info-customer'>
                                <p>{this.CONSTANT_TEXT[language].name_hotel}</p>
                                <a href="">Pi Hotel</a>
                            </div>
                            <div className='info-customer'>
                                <p>{this.CONSTANT_TEXT[language].label_address}</p>
                                <span>22 Hà Nội, Phường A, Quận B</span>
                            </div>
                            <div className='info-customer'>
                                <p>{this.CONSTANT_TEXT[language].label_phone}</p>
                                <span>092217198</span>
                            </div>
                            <div className='info-customer'>
                                <p>Email:</p>
                                <span>pihotelhanoi@gmail.com</span>
                            </div>
                        </div>
                        <div className='group-info'>
                            <table className='table-group-info'>
                                <thead className='table-group-info-th'>
                                    <tr>
                                        <th>{this.CONSTANT_TEXT[language].day_to}</th>
                                        <th>{this.CONSTANT_TEXT[language].label_go}</th>
                                        <th>{this.CONSTANT_TEXT[language].adults}</th>
                                        <th>{this.CONSTANT_TEXT[language].kids}</th>
                                        <th>{this.CONSTANT_TEXT[language].rooms}</th>
                                        <th>{this.CONSTANT_TEXT[language].business}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>01/01/2021</td>
                                        <td>01/05/2021</td>
                                        <td>2</td>
                                        <td>1 (2 tuổi)</td>
                                        <td>1</td>
                                        <td>Có</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='group-info'>
                            <div className='label-group-info'>{this.CONSTANT_TEXT[language].request}</div>
                            <div>
                                <p>...</p>
                            </div>
                        </div>
                        <div className='note-info-booking'>
                            {this.CONSTANT_TEXT[language].note}
                            <a className='ml-5' href='http://pibooking.vn'>http://pibooking.vn</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoBooking;