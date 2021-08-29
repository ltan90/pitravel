import React, { Component } from "react";
import "../../css/PanelComponent.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "../../css/SlideShowComponent.css";
import "react-gallery-carousel/dist/index.css";
import SlideShowComponent from "./SlideShowComponent";
import { env } from "../data/constants";
import { FaCog, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import SaoVang from '../../../public/images/hotels/saovang.png'
import CommonLanguage from "../utils/CommonLanguage";
import CarouselResponsive from "./CarouselResponsive";
import BookingComponent from "./BookingComponent";
import MapComponent from "./Admin/MapComponent";



class PanelComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenSetting: false,
            showBookingResponsive: false
        }
        this.toggleContainer = React.createRef();
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            vi: {
                hotel: 'Khách Sạn',
                price: 'Giá chỉ từ',
                range: 'Cách trung tâm',
                map: 'Hiển thị trên bản đồ',
                contact: 'Liên hệ đặt phòng',
                language: 'Ngôn ngữ',
                vn: 'Tiếng Việt',
                en: 'Tiếng Anh',
                contact: 'Liên hệ đặt phòng',
                map: 'Xem trên bản đồ'
            },
            en: {
                hotel: 'Hotel',
                price: 'Price from',
                range: 'Center range',
                map: 'Show on map',
                contact: 'Contact booking',
                language: 'Languages',
                vn: 'Vietnamese',
                en: 'English',
                contact: 'Contact Booking',
                map: 'Show on map'
            }

        }
    }
    componentDidMount = () => {
        window.addEventListener('click', this.onClickOutsideHandler);
    }

    componentWillUnmount = () => {
        window.removeEventListener('click', this.onClickOutsideHandler);
    }
    onClickOutsideHandler = (event) => {
        if (this.state.isOpenSetting && !this.toggleContainer.current.contains(event.target)) {
            this.setState({ isOpenSetting: false });
        }
    }
    onClickHandler = () => {
        this.setState(currentState => ({
            isOpenSetting: !currentState.isOpenSetting
        }));
    };
    format = () => {
        let number = this.props.dataPanel.price;
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(number);
    };
    showImg = () => {
        if (this.props.dataPanel.images == null || !this.props.dataPanel.images[0] || !this.props.dataPanel.images[0].url) {
            return (
                <LazyLoadImage src="./images/image_hotel_default.jpg" />
            )
        }
        return (
            <LazyLoadImage src={env.APP_URL + this.props.dataPanel.images[0].url} />
        );

    };

    showImgItem = () => {
        if (!this.props.dataPanel.images) {
            return null;
        }
        return this.props.dataPanel.images.map((value, index) => {
            if (index > 0 && index < 4) {
                return (
                    <div key={index} className=" panel" data-toggle="modal" data-target="#slideModel">
                        <img src={env.APP_URL + value.url} alt={''} />
                    </div>
                );
            }
        });
    };
    displayShowImgItem = () => {
        return (
            <div className={`${this.props.colClass} itemPanel`} data-bs-toggle="modal" data-bs-target="#slideModal">
                <div className="col">{this.showImgItem()}</div>
            </div>
        );
    };
    showImage = (isCheck, isDisplay) => {
        const hiddenWhenEmptyImage = this.props.hiddenWhenEmptyImage;
        if (hiddenWhenEmptyImage && !this.props.dataPanel.images?.length) {
            return null;
        }
        if (this.props.colClass === 'col-9') {
            return (
                <div className="row row-modal">
                    <div className='group-img-detail'>
                        <div data-bs-toggle="modal" data-bs-target="#slideModal"
                            className={isDisplay ? `${this.props.colNameAdmin}
                            panel-img col-4` : `${this.props.colNameClient} col panel-img`}>
                            {this.showImg()}
                        </div>
                        {isCheck}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="row row-modal">
                    <div data-bs-toggle="modal" data-bs-target="#slideModal"
                        className={isDisplay ? `${this.props.colNameAdmin}
                         panel-img col-3` : `${this.props.colNameClient} col panel-img`}>
                        {this.showImg()}
                    </div>
                    {isCheck}
                </div>
            )
        }
    };
    showPost = () => {
        if (!this.props.dataPanel.posts) {
            return null;
        }
        return (
            <div className='content-panel'>
                <h4 className="tittle"> {this.props.dataPanel.posts.name}</h4>
                <p className="titlePanel" dangerouslySetInnerHTML={{ __html: this.props.dataPanel.posts.content }}>
                </p>
            </div>
        );
    };
    generateStar = () => {
        let arrStar = [];
        for (let i = 0; i
            < this.props.dataPanel.evaluation; i++) arrStar.push(<img key={i} className="fastar-panel" src={SaoVang} />);
        return arrStar;
    };
    loadAllHotels = () => {
        sessionStorage.clear();
    };
    showBooking = () => {
        this.setState({
            isShowBooking: true
        })
    }
    setLanguage = (e) => {
        let value = e.target.value;
        this.currentLanguage = value;

        if (this.CommonLanguage.getData() != this.currentLanguage) {
            sessionStorage.setItem('language', this.currentLanguage);
            window.location.reload();
        }
    }
    render() {
        let language = this.currentLanguages;
        let isCheck = null, isDisplay = false, isShow = false;
        if (!this.props.dataPanel.images || this.props.dataPanel.images.length > 1) {
            isCheck = this.displayShowImgItem();
            isDisplay = true;
        }
        if (!this.props.dataPanel.images || this.props.dataPanel.images.length > 0) {
            isShow = true
        }

        return (
            <div className="container-panel">
                <div className="contentPanel">
                    <div className="contentLeft">
                        <div className="contentLeftItem">
                            <span className="titleItem">{this.CONSTANT_TEXT[language].hotel}</span>
                            <div className='name-star-panel'>
                                <h1>{this.props.dataPanel.name}</h1>
                                <span className="slideStarPanel">
                                    {this.generateStar()}
                                </span>
                            </div>
                        </div>
                        {this.props.isCheckedPanel ? <div className="contentItem">
                            <ul>
                                <li onClick={this.loadAllHotels}>
                                    <Link to="/">
                                        <img src="../../../../images/Home2.png" alt={'Home Icon'} />
                                    </Link>
                                </li>
                                <li className="icon-back">
                                    <Link to="/">
                                        <img src="../../../../images/Back2.png" alt={'Back Icon'} />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                            : null
                        }
                        {this.props.children}
                        <p>
                            <i className="fas fa-map-marker-alt"></i>
                            {this.props.dataPanel.address}
                        </p>
                    </div>
                    <div className="contentRight">
                        <p>{this.CONSTANT_TEXT[language].range} {Math.floor(this.props.dataPanel.distance) || 0} km</p>
                        <p>{this.CONSTANT_TEXT[language].price} {this.format()}</p>
                    </div>
                    <div className='show-map-panel'>
                        - <a data-bs-toggle="modal" data-bs-target="#modalShowMapResponsive" >{this.CONSTANT_TEXT[language].map}</a>
                    </div>
                    <div className="modal fade" id="modalShowMapResponsive" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-map-responsive">
                            <div className="modal-content modal-content-bookingresponsive">
                                <div className="modal-body modal-body-bookingresponsive">
                                    <MapComponent id={this.props.idHotel} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='carousel-responsive-booking'>
                    <CarouselResponsive urlImgs={this.props.dataPanel.images} />
                </div>

                {!this.state.showBookingResponsive ?
                    <div className='button-contact-responsive'>
                        <button className='button-contact' onClick={() => this.setState({ showBookingResponsive: !this.state.showBookingResponsive })}>{this.CONSTANT_TEXT[language].contact}</button>
                    </div> : ''}
                {this.state.showBookingResponsive ?
                    <div className='form-booking-responsive'>
                        <div>
                            <FaTimes className='fatimes_booking' onClick={() => this.setState({ showBookingResponsive: false })} />
                            <BookingComponent dataBook={this.props.dataPanel} />
                        </div>
                    </div> : ''}

                {this.showImage(isCheck, isDisplay)}
                {this.showPost()}
                {isShow ?
                    <div className="modal fade modal-slideshow" id="slideModal" tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content modal-slide-img">
                                <SlideShowComponent DataSlide={this.props.dataPanel} />
                            </div>
                        </div>
                    </div> : null}

            </div>
        );
    }
}
export default PanelComponent;
