import React, { Component } from 'react';
import '../../css/SlideShowComponent.css'
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import { FaStar } from "react-icons/fa";
import { env } from '../data/constants';
import SaoVang from '../../../public/images/hotels/saovang.png'
import CommonLanguage from "../utils/CommonLanguage";


class SlideShowComponent extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            vi: {
                hotel: 'Khách sạn'
            },
            en: {
                hotel: 'Hotels'
            }
        }
    }

    App = () => {
        let images = [];
        if (!this.props.DataSlide.images?.length) {
            images.push({ src: env.APP_URL + "images/image_hotel_default.jpg" })
        } else {
            images = this.props.DataSlide.images.map((value) => ({
                src: env.APP_URL + value.url
            }));
        }
        return (
            <Carousel images={images} className="d-block w-100" />
        );

    };
    generateStar = () => {
        let arrStar = [];
        for (let i = 0; i < this.props.DataSlide.evaluation; i++)
            arrStar.push(<img key={i} className="fastar-slideShow" src={SaoVang} />);
        return arrStar;
    };

    render() {
        let language = this.currentLanguages;
        return (
            <div className="show-Img">
                <div className="show-slider">
                    <div className="contentHeader">
                        <div className="itemLeft">
                            <span className='titleItem'>{this.CONSTANT_TEXT[language].hotel}</span>
                            <h1>{this.props.DataSlide.name}</h1>
                            <span className="slideStar">
                                {this.generateStar()}
                            </span>
                        </div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div className="carousel-container">
                    {this.App()}
                </div>

            </div>
        );
    }
}

export default SlideShowComponent;
