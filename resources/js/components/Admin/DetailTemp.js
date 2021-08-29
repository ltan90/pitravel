import React, { Component } from "react";
import PanelComponent from "../PanelComponent";
import RoomType from "../RoomTypeComponent";
import Services from "../ServiceComponent";

class DetailTemp extends Component {

    render() {
        return (
            <div className=" detail-container">
                <div className=" grid-detail">
                    <PanelComponent hiddenWhenEmptyImage={true} colClass="col-9" dataPanel={this.props.dataHotelDetail}>
                        <div className="content-title">
                            <div className="content-left-detail">
                                <p>Address: {this.props.dataHotelDetail.address}</p>
                            </div>
                            <div className="contentRight">
                                <p>Location: {this.props.locationName(this.props.dataHotelDetail.location_id)}</p>
                                <p>Phone: {this.props.dataHotelDetail.phone} </p>
                                <p>Email: {this.props.dataHotelDetail.email} </p>
                            </div>
                        </div>
                    </PanelComponent>
                    <div className="detail-bottom">
                        <RoomType
                            dataRoom={this.props.dataHotelDetail.hotel_rooms}
                            className="col-3"
                        />
                        <Services
                            titleService={"Dịch Vụ"}
                            className="col-3"
                            dataService={this.props.dataHotelDetail.services}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailTemp;
