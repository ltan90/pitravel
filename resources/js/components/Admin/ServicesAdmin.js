import React, { Component } from 'react';

class ServicesAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceOfHotel: [],
            servicesAll: []
        };
        this.service_ids = [];
    }
    static getDerivedStateFromProps(props, state) {
        return {
            servicesAll: props.dataServicesAll,
            serviceOfHotel: props.dataServiceOfHotel
        };
    }
    handleAddServices = (e, id) => {
        let value = e.target.checked;
        if (value) {
            this.service_ids = [...this.service_ids, id]
        } else {
            this.service_ids = this.service_ids.filter(idService => idService != id);
        }
        this.props.getDataService(this.service_ids);
    };
    render() {
        if (this.state.serviceOfHotel) {
            this.service_ids = this.state.serviceOfHotel.map(service => Number(service.service_id));
        }
        return (
            <div>
                {this.state.servicesAll && this.state.servicesAll.map((item, index) => {
                    return (
                        <div key={index} className="service-list-item" >
                            <label>
                                <input
                                    className='checkbox-hotel'
                                    type="checkbox"
                                    name="check-hotel"
                                    onChange={(e) =>
                                        this.handleAddServices(e,
                                            item.id
                                        )
                                    }
                                    defaultChecked={this.service_ids.includes(item.id)}
                                />
                                {item.name}
                            </label>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default ServicesAdmin;