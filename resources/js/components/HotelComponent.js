import React, { Component } from "react";
import { FaChevronRight, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { BrowserRouter as Router, Link, Redirect } from "react-router-dom";
import MapComponent from "./MapComponent";
import SaoVang from '../../../public/images/hotels/saovang.png'
import CommonLanguage from "../utils/CommonLanguage";
import { HotelLang } from "../lang/hotels";
export default class HotelComponent extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.state = { isShow: false };
        this.CONSTANT_TEXT = HotelLang;
        this.currentLanguages = this.CommonLanguage.getData();
    }
    formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    handleOpenMap = () => {
        this.setState({
            isShow: true
        });
    }
    handleCloseMap = () => {
        this.setState({
            isShow: false
        });
    }
    generateStar = (reviews) => {
        let arrStar = [];
        for (let i = 0; i < reviews; i++)
            arrStar.push(<img key={i} className="fastar" src={SaoVang} />);
        
        return arrStar;
    };
    mapHotel = () => {
        return (
            <div className="container-map">
                <div className="modal-map">
                    <div className="modal-content">
                        <div className="modal-body body-map">
                            <div className="itemMap">
                                <h5 className="modal-title">{this.props.item.name}</h5>
                                <span className="slideStar">
                                    {this.generateStar(this.props.item.reviews)}
                                </span>
                            </div>
                            <button type="button" className="btn-close close-map" onClick={() => this.handleCloseMap()}></button>
                        </div>
                        <div className="footer-map">
                            <MapComponent id={this.props.item.id} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        let language = this.currentLanguages;
        const id = this.props.item.id;
        return (
            <div className="product-item">
                <div className="row row-product-item">
                    <div className="product-img col-2">
                        <Link to={"/booking/" + id}>
                            <img
                                src={this.props.item.url ? this.props.item.url : './images/image_hotel_default.jpg'}
                                className="img-responsive"
                                alt="Image"
                            />
                        </Link>
                    </div>
                    <div className="product-detail col-6">
                        <div className="hotel-title">
                            <span className="hotel-title-name">
                                <Link to={"/booking/" + id}>
                                    {this.props.item.name}
                                </Link>
                            </span>
                            <span className="hotel-title-star">
                                {this.generateStar(this.props.item.reviews)}
                            </span>
                        </div>
                        <div className="hotel-location">
                            <span className="hotel-location-icon">
                                <FaMapMarkerAlt />
                            </span>
                            <span className="hotel-location-name">
                                {this.props.item.address}
                            </span>
                        </div>
                        <div className='group-hotel-price'>
                            <div className="hotel-notes">
                                {this.CONSTANT_TEXT['vi'].price}
                            </div>
                            <div className="hotel-price">
                                {this.formatPrice(this.props.item.price_min)}
                            </div>
                        </div>
                    </div>
                    <div className="product-order col-4">
                        <div className="hotel-distance">
                            {this.CONSTANT_TEXT['vi'].range} {Math.floor(this.props.item.distance) || 0} km
                        </div>
                        <div className="map-link">
                            <a onClick={() => this.handleOpenMap()}>{this.CONSTANT_TEXT['vi'].map}</a>
                        </div>
                        <Link className="btn-contact" to={"/booking/" + id}>{this.CONSTANT_TEXT['vi'].contact}</Link>
                    </div>
                </div>
                <Link to={"/booking/" + id} className=''>
                    <div className='chevronRight-responsive'>
                        <FaChevronRight />
                    </div>
                </Link>
                {/*{this.state.isShow ? this.mapHotel() : null}*/}
            </div>
        );
    }
}
