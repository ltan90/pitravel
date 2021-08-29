import React, { Component } from "react";
import { HotelLang } from "../lang/hotels";
import HotelComponent from "./HotelComponent";
import "../../css/ProductComponent.css";
import CommonLanguage from "../utils/CommonLanguage";
export default class HotelsComponent extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = HotelLang
    }

    formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    render() {
        let language = this.currentLanguages;
        if (!this.props.priceAvg || !this.props.hotels) return;
        
        let hotel = this.props.hotels.map((item, index) => <HotelComponent key={index} item={item} />);

        return (
            <div className="product-container">
                <div className="introduce">
                    <div className="left-title">
                        <div className="country">
                            {this.CONSTANT_TEXT[language].lang_default}
                        </div>
                        <div className="country-note">
                            {this.CONSTANT_TEXT[language].best_selection}
                        </div>
                    </div>
                    <div className="right-title">
                        <div className="hotel-count">
                            {this.props.hotels.length} {this.CONSTANT_TEXT[language].stay}
                        </div>
                        <div className="hotel-count">
                            {this.CONSTANT_TEXT[language].average_price} {this.formatPrice(this.props.priceAvg)}
                        </div>
                    </div>
                </div>
                <div className='group-product-item'>
                    {hotel}
                </div>
            </div>
        );
    }

}
