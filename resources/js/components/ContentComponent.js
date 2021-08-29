import React, { Component } from "react";
import "../../css/Content.css";
import CommonLanguage from "../utils/CommonLanguage";
import HotelMiddleware from "../utils/HotelMiddleware";
import mapVN from "../../../public/images/mapVN.png";
import HueBackdrop from "../../../public/images/hue_backdrop.png";
import KhanhHoaBackdrop from "../../../public/images/khanhhoa_backdrop.png";
import LaoCaiBackdrop from "../../../public/images/laocai_backdrop.png";
import provincial from "./provincial.js";
export default class ContentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provincial: [],
            cities: [],
            result: [],
            location_id: null,
        };
        this.CommonLanguage = new CommonLanguage();
        this.HotelMiddleware = new HotelMiddleware();

        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            vi: {
                map: "Bản Đồ",
            },
            en: {
                map: "Map",
            },
        };
        this.refImages = {};
        this.refMap = React.createRef();
    }
    async componentDidMount() {
        const data = await this.HotelMiddleware.getLocationsHasHotel();
        this.setState({
            cities: data,
            result: data,
        });
        sessionStorage.setItem("locationsHasHotel", JSON.stringify(data));
        for (let name in this.refImages) {
            const imgDom = this.refImages[name].current;
            imgDom.addEventListener("mouseover", () => {
                this.refMap.current.src = this.getImageByName(name);
            });
            imgDom.addEventListener("mouseout", () => {
                this.refMap.current.src = mapVN;
            });
        }
    }
    getImageByName = (name) => {
        switch (name) {
            case "hue":
                return HueBackdrop;
            case "lao_cai":
                return LaoCaiBackdrop;
            case "khanh_hoa":
                return KhanhHoaBackdrop;
            default:
                return "";
        }
    };
    onClickCity = async (id) => {
        const params = {
            limit: 10,
            offset: 0,
            location_id: id,
        };

        const hotelData = await this.HotelMiddleware.getHotels(params);
        const dataResponce = {
            dataHotel: hotelData,
            total: hotelData.general.total,
            locationId: id,
        };
        this.props.onCallbackParent(dataResponce);
    };
    render() {
        let prov = provincial;
        let language = this.currentLanguages;
        if (!this.props.dataContent) {
            return null;
        }

        return (
            <div className="product-container">
                <div className="product-map">
                    <div className="left-title">
                        <div className="country-name">
                            {this.CONSTANT_TEXT[language].map}
                        </div>
                    </div>
                </div>
                <div className="content-left">
                    <img
                        ref={this.refMap}
                        src={mapVN}
                        className="img-responsive"
                        alt="Image"
                    />
                    {prov.map((item, index) => {
                        this.refImages[item.name] = React.createRef();
                        return (
                            <img
                                ref={this.refImages[item.name]}
                                style={{
                                    position: "absolute",
                                    top: item.top,
                                    left: item.left,
                                    width: item.width,
                                }}
                                key={index}
                                src={item.url}
                                onClick={() => this.onClickCity(item.id)}
                                className="img-responsive city-prov"
                                alt="Image"
                            />
                        );
                    })}
                </div>


                <div className="content-poss">
                    <br />
                    <h4
                        className="hotel-title-name"
                        dangerouslySetInnerHTML={{
                            __html: this.props.dataContent.name,
                        }}
                    ></h4>
                    <span
                        className="text-content"
                        dangerouslySetInnerHTML={{
                            __html: this.props.dataContent.content,
                        }}
                    ></span>
                </div>
            </div>
        );
    }
}
