import React, { Component } from 'react';
import { InfoWindow, withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import HotelMiddleware from '../../utils/HotelMiddleware';
class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.googleMap = React.createRef();
        this.lat = React.createRef();
        this.lng = React.createRef();
        this.state = {
            hotelId: this.props.hotelId,
            // dataLocation: this.props.dataLocation,
            lat: this.props.lat || 16.4527,
            lng: this.props.lng || 107.6061,
            zoom: 18,
            center: {
                latitude: 0,
                longitude: 0
            }
            // newLat: 16.4527,
            // newLng: 107.6061
        }
        this.HotelMiddleware = new HotelMiddleware();
    }
    async componentDidMount() {
        const data = await this.HotelMiddleware.getHotelById(this.state.hotelId);
        if (this.state.hotelId > 0) {
            const dataLocation = JSON.parse(sessionStorage.getItem('location'))
            if (!data.lat || !data.long) {
                dataLocation.map(value => {
                    if (value.id === data.location_id) {
                        this.setState({
                            lat: value.lat,
                            lng: value.long
                        });
                    }
                })
            }
            else {
                this.setState({
                    lat: data.lat,
                    lng: data.long,
                })
            }
        }
    }
    markerPosition = (e) => {
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();
        this.setState({
            lat: lat,
            lng: lng,
            zoom: +localStorage.getItem('zoom') ? +localStorage.getItem('zoom') : 18,
        })
        this.props.handleCoordinates(lat, lng)
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.lng === nextState.lng && this.state.lat === nextState.lat) {
            return false
        } else {
            return true
        }
    }
    choosePosition = (e) => {
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();
        this.setState({
            lat: lat,
            lng: lng,
            zoom: +localStorage.getItem('zoom') ? +localStorage.getItem('zoom') : 18,
        })
        this.props.handleCoordinates(lat, lng)
    }
    onZoomChanged = (zoom) => {
        zoom = this.googleMap.current.getZoom()
        localStorage.setItem('zoom', zoom)
    };
    handleMarkLatLng = () => {
        let lat = this.lat.current.value;
        let lng = this.lng.current.value;
        this.setState({ lat: lat, lng: lng });
        this.googleMap.current.props.defaultCenter.lat = +lat;
        // this.googleMap.current.props.defaultCenter.lng = +lng;
        this.props.handleCoordinates(lat, lng);
    }
    showInput = () => {
        return (
            <div className='class-lat-long'>
                long:
                <input className="form-control"
                    ref={this.lng}
                    step={0.0000000000000000001}
                    type="number" id="lng" name="lng"
                    defaultValue={this.state.lng}
                />
                lat:
                <input className="form-control"
                    ref={this.lat}
                    step={0.0000000000000000001}
                    type="number" id="lat" name="lat"
                    defaultValue={this.state.lat}
                />

                <button type='button' className="btn btn-success" onClick={this.handleMarkLatLng}>Change</button>
            </div>
        )
    }
    handleInputCoordinates = () => {
        // to do
    }
    render() {
        // let zoom = 10;
        const MapWithAMarker = withScriptjs(withGoogleMap(props =>
            <GoogleMap
                ref={this.googleMap}
                defaultZoom={this.state.zoom}
                defaultCenter={{ lat: +this.state.lat, lng: +this.state.lng }}
                onZoomChanged={this.onZoomChanged}
                onDblClick={this.choosePosition}>
                <Marker
                    defaultPosition={{ lat: +this.state.lat, lng: +this.state.lng }}
                    draggable={true}
                    onDragEnd={e => this.markerPosition(e)}>
                    <InfoWindow>
                        <div>
                            Long: {this.state.lng} Lat: {this.state.lat}
                        </div>
                    </InfoWindow>
                </Marker>
            </GoogleMap>
        ));
        return (
            <div>
                <MapWithAMarker
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA8DGU3eoWef7XvukrFIbWDQZMAV-KPcLs&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `450px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}>
                </MapWithAMarker>
                {this.showInput()}
            </div>

        );
    }
}

export default MapComponent;
