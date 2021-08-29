import React, { Component } from "react";
import "../../css/RoomComponent.css";
import { env } from "../data/constants";
import CommonLanguage from "../utils/CommonLanguage";


class RoomType extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            vi: {
                kind_room: 'Loại phòng'
            },
            en: {
                kind_room: 'Room type'
            }
        }
    }

    room = () => {
        return this.props.dataRoom.map((value, index) => {
            return (
                <div key={index} className={`${this.props.className} room-news-right-info list-room-responsive`}>
                    <div className="row info-room">
                        <div className="col-9 room-news-info">
                            <h5>
                                <a href="#">{value.name}</a>
                            </h5>
                            {value.beds.map((item, index) => {

                                return (
                                    <div className="room-type" key={index}>
                                        <p className="room-type-amount">
                                            {item.amount}
                                        </p>
                                        <p>
                                            {item.name}
                                            <img src={env.APP_URL + item.url} alt="" />
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="col-3 room-news-img">
                            <img src="../../images/room_types/iconRoom.png" width="100%" alt={'Room Icon'} />
                        </div>
                    </div>
                </div>
            );
        });
    };

    render() {
        let language = this.currentLanguages;
        if (!this.props.dataRoom || !this.props.dataRoom?.length) {
            return null;
        }
        return (
            <div className="group-room group-service-booking">
                <div className="room-heading">
                    <h4>{this.CONSTANT_TEXT[language].kind_room}</h4>
                </div>
                <div className="row rowRoom rowRoomBooking">{this.room()}</div>
            </div>
        );
    }
}

export default RoomType;
