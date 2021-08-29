import React, { Component } from "react";
import {
    FaChevronDown,
    FaChevronLeft,
    FaChevronUp,
    FaMapMarkerAlt,
    FaRegCalendarAlt,
    FaRegMinusSquare,
    FaRegPlusSquare,
    FaSearch,
    FaUser,
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../css/search.css";
import HotelMiddleware from '../utils/HotelMiddleware'
import CommonLanguage from "../utils/CommonLanguage";
import { SearchLang } from '../lang/search';
export default class SearchComponent extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.state = {
            adult: 1,
            kid: 0,
            room: 1,
            cities: [],
            result: [],
            showLocation: false,
            searchValue: JSON.parse(sessionStorage.getItem('dataLocation')) || "",
            dateFrom: "",
            dateTo: "",
            data: [],
            dataHotels: [],
            location_id: null,
            minDate: new Date(),
            maxDate: new Date(),
            setIdSearchNull: '',
            handleGroupSearch: false,
            loaderButton: false,
            chevron_mobile: false,
        };
        this.CONSTANT_TEXT = SearchLang,
            this.HotelMiddleware = new HotelMiddleware();
        this.currentLanguages = this.CommonLanguage.getData();
    }
    async componentDidMount() {

        const data = await this.HotelMiddleware.getLocationsHasHotel();

        this.setState({
            cities: data,
            result: data,
        });

        sessionStorage.setItem('locationsHasHotel', JSON.stringify(data))
    }
    // Gợi ý ô search
    handleInput = (event) => {
        if (event.target.value.length == 0) {
            this.setState({
                location_id: null
            })
        }
        this.setState({
            searchValue: event.target.value,
        });
        let result = this.state.cities.filter((val) =>
            val.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        this.setState({
            result: result,
        });

    };
    // Lấy ra tên,id của City -> hiển thị ở ô Nhập vị trí
    handleClickCity = (city) => {
        this.setState({
            searchValue: city.name, location_id: city.id,
            handleGroupSearch: false,
        });
    };
    formatDate = (date1) => {
        if (date1 < 10) {
            date1 = `0${date1}`;
        }
        return date1
    };
    // On change date from and date to
    onChangeDate = (e, key) => {
        let dd = this.formatDate(e.getDate());
        let mm = this.formatDate(e.getMonth() + 1);
        let yyyy = e.getFullYear();
        let time = dd + "/" + mm + "/" + yyyy;
        key == 'dateFrom'
            ? sessionStorage.setItem('dateFrom', JSON.stringify(yyyy + "-" + mm + "-" + dd))
            : sessionStorage.setItem('dateTo', JSON.stringify(yyyy + "-" + mm + "-" + dd));
        const dateLimit = key === 'dateFrom' ? 'minDate' : 'maxDate';
        this.setState({
            [key]: time,
            [dateLimit]: e,
        });
    };
    onChangeAge = (value, key) => {
        if ((key == 'room' ? this.state[key] + value >= 1 : this.state[key] + value >= 0)
            && (key == 'adult' ? (this.state[key] + value <= 20 && this.state[key] + value >= 1) : this.state[key] + value <= 9)) {
            this.setState({
                [key]: this.state[key] + value,
            });
        }
    };
    // Children's age selection
    kidAge = () => {
        let kidAgeArr = [];
        for (let i = 0; i < this.state.kid; i++) {
            kidAgeArr.push(
                <select key={i}>
                    <option value="0">--</option>
                    <option value="1">0-5</option>
                    <option value="1">5-10</option>
                    <option value="2">10-12</option>
                </select>
            );
        }
        return kidAgeArr;
    };
    onClickSearch = async () => {
        sessionStorage.setItem('dataLocation', JSON.stringify(this.state.searchValue));
        const params = {
            limit: 10,
            offset: 0,
            location_id: this.state.location_id
        };
        // window.location.href = 'location' + this.state.location_id
        // let route = url.substring(index + 1);
        const hotelData = await this.HotelMiddleware.getHotels(params);
        const dataResponce = {
            dataHotel: hotelData,
            total: hotelData.general.total,
            locationId: this.state.location_id
        };
        this.props.onCallbackParent(dataResponce);
        if (this.state.searchValue === '') {
            this.setState({
                setIdSearchNull: 'inputSearch-red'
            })
        }
        if (this.state.searchValue != "") {
            this.setState({
                loaderButton: true
            })
        }
        setTimeout(
            function () {
                this.setState({ loaderButton: false });
            }
                .bind(this),
            1200
        );
    };

    setBorderInput = () => {
        this.setState({
            setIdSearchNull: '',
            handleGroupSearch: true,
        })
    };

    render() {

        let language = this.currentLanguages;
        sessionStorage.setItem('adult', JSON.stringify(this.state.adult));
        sessionStorage.setItem('kid', JSON.stringify(this.state.kid));
        sessionStorage.setItem('room', JSON.stringify(this.state.room));

        let cityName = this.state.result.map((city, index) => {
            return (
                <li key={index} onClick={() => this.handleClickCity(city)}>
                    <span>
                        <FaMapMarkerAlt className="icon-map icon-map-location" />
                        {city.name}
                    </span>
                </li>

            );
        });

        let listCity = ''
        if (this.state.handleGroupSearch === true) {
            listCity = (
                <div className="group-location">
                    <ul>
                        {cityName}
                    </ul>
                </div>
            )
        }

        let today = new Date();
        const { minDate, maxDate } = this.state

        return (
            <div className="searchComponent">
                <div className={this.state.chevron_mobile === false ? "group-searchComponent" : "group-searchComponent group-searchComponent-responsive"}>
                    <div className="where">
                        <div className="group-search">
                            <input
                                type='text'
                                value={this.state.searchValue}
                                className="input-search"
                                placeholder={this.CONSTANT_TEXT[language].search1}
                                onChange={this.handleInput}
                                onClick={this.setBorderInput}
                                id={this.state.searchValue === '' ? `${this.state.setIdSearchNull}` : ''}
                            />
                            <FaSearch className="icon-search" />
                        </div>

                        {this.state.result.length
                            ? listCity
                            : ''
                        }
                    </div>
                    {/*-------------- Choose room ---------------------*/}
                    <div className="group-room">
                        <div className="room">
                            <span>
                                <FaRegCalendarAlt className="icon" />
                                &ensp;
                                {this.state.dateFrom === ""
                                    ? `${this.CONSTANT_TEXT[language].receivedDate}`
                                    : `${this.state.dateFrom}`}
                                &nbsp; - &nbsp;
                                {this.state.dateTo === "" || maxDate.getTime() < minDate.getTime()
                                    ? `${this.CONSTANT_TEXT[language].payDay}`
                                    : `${this.state.dateTo}`}
                            </span>
                            <FaChevronLeft className="chevron-down" />
                        </div>
                        <div className="group-action-room">
                            <div className="two-calendar">
                                <div className="from">
                                    <Calendar
                                        onClickDay={(e) => this.onChangeDate(e, 'dateFrom')}
                                        minDate={today}
                                    />
                                    <div className="day take">{this.CONSTANT_TEXT[language].receivedDate}</div>
                                </div>
                                <div className="to">
                                    <Calendar
                                        onClickDay={(e) => this.onChangeDate(e, 'dateTo')}
                                        minDate={today.getTime() > minDate.getTime() ? today : minDate}
                                    />
                                    <div className="day pay">{this.CONSTANT_TEXT[language].payDay}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*------------ Amount people  --------------*/}
                    <div className="group-people">
                        <div className="people">
                            <span>
                                <FaUser className="icon" />
                                &nbsp; {this.state.adult} {this.CONSTANT_TEXT[language].adults} <b>.</b>{" "}
                                {this.state.kid} {this.CONSTANT_TEXT[language].kids} <b>.</b> {this.state.room}{" "}
                                {this.CONSTANT_TEXT[language].rooms}
                            </span>
                            <FaChevronLeft className="chevron-down" />
                        </div>
                        <div className="group-action-people">
                            <div className="action">
                                <p>{this.CONSTANT_TEXT[language].adults}</p>
                                <span>
                                    <FaRegMinusSquare
                                        className={
                                            this.state.adult === 1
                                                ? "minus-gray"
                                                : "minus"
                                        }
                                        onClick={() => this.onChangeAge(-1, 'adult')}
                                    />
                                    <span className="number">
                                        {this.state.adult}
                                    </span>
                                    <FaRegPlusSquare
                                        className={
                                            this.state.adult === 20
                                                ? "plus-gray"
                                                : "plus"
                                        }
                                        onClick={() => this.onChangeAge(+1, 'adult')}
                                    />
                                </span>
                            </div>
                            <div className="action">
                                <p>{this.CONSTANT_TEXT[language].kids}</p>
                                <span>
                                    <FaRegMinusSquare
                                        className={
                                            this.state.kid === 0
                                                ? "minus-gray"
                                                : "minus"
                                        }
                                        onClick={() => this.onChangeAge(-1, "kid")}
                                    />
                                    <span className="number">{this.state.kid}</span>
                                    <FaRegPlusSquare
                                        className={
                                            this.state.kid === 9
                                                ? "plus-gray"
                                                : "plus"
                                        }
                                        onClick={() => this.onChangeAge(+1, 'kid')}
                                    />
                                </span>
                            </div>
                            <div className="action">
                                <p>{this.CONSTANT_TEXT[language].rooms}</p>
                                <span>
                                    <FaRegMinusSquare
                                        className={
                                            this.state.room === 1
                                                ? "minus-gray"
                                                : "minus"
                                        }
                                        onClick={() => this.onChangeAge(-1, 'room')}
                                    />
                                    <span className="number">
                                        {this.state.room}
                                    </span>
                                    <FaRegPlusSquare
                                        className={
                                            this.state.room === 9
                                                ? "plus-gray"
                                                : "plus"
                                        }
                                        onClick={() => this.onChangeAge(+1, 'room')}
                                    />
                                </span>
                            </div>
                            <div className="action-kid">
                                {this.state.kid != 0 ? <p>{this.CONSTANT_TEXT[language].child_age}</p> : ''}
                                <div className="kidAge">{this.kidAge()}</div>
                            </div>
                            <div className="btn-checkbox">
                                <input type="checkbox" />
                                <p>{this.CONSTANT_TEXT[language].family_room}</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={this.onClickSearch} className="button-search">
                        {this.CONSTANT_TEXT[language].button_search}
                        &nbsp;
                        {this.state.loaderButton ? <span className="loading-search spinner-grow spinner-grow-lg" role="status" aria-hidden="true"></span> : ''}
                    </button>
                    <div className='chevron-mobile' onClick={() => this.setState({ chevron_mobile: !this.state.chevron_mobile })}>
                        {this.state.chevron_mobile ? <FaChevronUp className='fa-chevron-mobile' /> : <FaChevronDown className='fa-chevron-mobile' />}
                    </div>
                </div>
            </div>
        );
    }
}
