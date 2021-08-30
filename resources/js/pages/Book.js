import React, { Component } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import ReactDOM from "react-dom";
import "../../css/home.css";
import HotelMiddleware from "../utils/HotelMiddleware";
import PanelComponent from "../components/PanelComponent";
import Services from "../components/ServiceComponent";
import BookingComponent from "../components/BookingComponent";
import RoomType from "../components/RoomTypeComponent";
import MapComponent from "../components/MapComponent";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import ShowMess from "../components/ShowMess";
class Book extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            location: [],
            idHotel: this.props.match.params.id,
            isShow: false,
            redirectHome: false
        };
        this.HotelMiddleware = new HotelMiddleware();
    }
    async componentDidMount() {
        const hotelId = this.props.match.params.id;
        const data = await this.HotelMiddleware.getHotelById(hotelId);
        
        if (data.status === 404) {
            this.setState({
                isShow: true,
            })
            setTimeout(
                function () {
                    this.setState({
                        isShow: false,
                        redirectHome: true
                    });
                }.bind(this), 1000
            );
        }
        this.setState({
            data: data,
        });
    }
    render() {
        return (
            <div>
                <Header />
                {this.state.isShow ? <ShowMess /> : ''}
                {this.state.redirectHome ? <Redirect to="/" /> : ''}
                <div className="row content">
                    <div className="col-8 detail-hotel-ctn">
                        <PanelComponent
                            isCheckedPanel={true}
                            colNameAdmin="col-9"
                            colNameClient="col-12"
                            colClass="col-3"
                            dataPanel={this.state.data}
                            idHotel={this.state.idHotel}
                        />
                        <Services dataService={this.state.data.services}
                            className="col-3" />
                        <RoomType
                            className="col-6"
                            dataRoom={this.state.data.hotel_rooms}
                        />
                    </div>
                    <div className="col-4 book-left">
                        <BookingComponent
                            dataBook={this.state.data}
                        />
                        <MapComponent id={this.state.idHotel} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Book;

