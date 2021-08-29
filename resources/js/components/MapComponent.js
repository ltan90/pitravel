import React, { Component } from 'react';
import '../../css/map.css'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import HotelMiddleware from '../utils/HotelMiddleware';
class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 0,
            lng: 0,
            data: [],
            location: [],
        }
        this.HotelMiddleware = new HotelMiddleware();
    }
    async componentDidMount() {
        const hotelId = this.props.id;
        const dataHotel = await this.HotelMiddleware.getHotelById(hotelId);
        const dataLocation = JSON.parse(sessionStorage.getItem('locationsHasHotel'))
        this.setState({
            data: dataHotel,
            lat: dataHotel.lat,
            lng: dataHotel.long
        });
        dataLocation.map(value => {
            if (value.id === dataHotel.location_id) {
                if (!dataHotel.lat || !dataHotel.long) {
                    this.setState({
                        lat: value.lat,
                        lng: value.long
                    });

                }
            }
        })
    }
    render() {
        const MyMapComponent = withScriptjs(withGoogleMap((props) =>
            <GoogleMap
                defaultZoom={16}
                defaultCenter={{ lat: +this.state.lat, lng: +this.state.lng }}
            >
                {props.isMarkerShown && <Marker position={{ lat: +this.state.lat, lng: +this.state.lng }} />}
            </GoogleMap>
        ));

        return (
            <MyMapComponent
                isMarkerShown
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA8DGU3eoWef7XvukrFIbWDQZMAV-KPcLs&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div className="map" />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        );
    }
}

// export default GoogleApiWrapper({
//     apiKey: 'AIzaSyA8DGU3eoWef7XvukrFIbWDQZMAV-KPcLs'
// })(MapComponent);
export default MapComponent;
