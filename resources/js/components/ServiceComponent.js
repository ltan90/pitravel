import React, { Component } from "react";
import "../../css/ServiceComponent.css";
import { env } from "../data/constants";

class Services extends Component {
    constructor(props) {
        super(props);
    }

    services = () => {
        if (!this.props.dataService) {
            return null;
        }
        return (
            this.props.dataService.map((item, index) => {
                return (
                    <div
                        key={index}
                        className={`${this.props.className} room-news-right-info`}
                    >
                        <div className="row info-room service-item">
                            <img
                                src={env.APP_URL + item.url}
                                className="glyphicon style-img"
                                alt="Image"
                            />
                            <p className="text-service">{item.name}</p>
                        </div>
                    </div>

                );
            })
        )
    };

    render() {
        if (!this.props.dataService || !this.props.dataService?.length) {
            return null;
        }
        return (
            <div className="row" id="services">
                <div className="group-room group-room-service">
                    <div className="room-heading">
                        <h4 className="style-title">
                            {this.props.titleService}
                        </h4>
                    </div>
                    {this.props.children}
                    <div className="row rowRoom rowRoom-service">
                        {this.services()}
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Services;
