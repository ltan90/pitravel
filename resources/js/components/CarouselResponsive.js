import React, { Component } from 'react';

class CarouselResponsive extends Component {
    render() {
        let urlImgCarousel = this.props.urlImgs;
        let firstImage;
        let urls;
        if (urlImgCarousel) {
            urls = JSON.parse(JSON.stringify(urlImgCarousel));
            firstImage = urls.shift();
        }
        
        return (
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    {urls && urls.map((item, index) => (
                        <button key={index} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index + 1} aria-label={`Slide ${index + 2}`}></button>
                    ))}
                </div>
                <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={firstImage && firstImage.url} className="d-block w-100" alt="..." />
                        </div>
                    {urls && urls.map((item, index) => (
                        <div className="carousel-item" key={index}>
                            <img src={item.url} className="d-block w-100" alt="..." />
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        );
    }
}

export default CarouselResponsive;