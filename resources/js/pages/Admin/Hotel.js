import React, { Component } from "react";
import {
    FaEdit,
    FaPlusCircle,
    FaSearch,
    FaTrashAlt,
    FaMapMarkerAlt,
    FaMinusSquare,
    FaCheckSquare,
    FaRegSquare,
    FaDoorClosed,
} from "react-icons/fa";
import HotelMiddleware from "../../utils/HotelMiddleware";
import Room from "./HotelRoom";
import "../../../css/HotelAdmin.css";
import "../../../css/ServiceAdmin.css";
import { Drawer, DrawerSize, Position } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "../../../css/ListRoomAdmin.css";
import Delete from "./Actions/Delete.js";
import PaginationComponent from "../../components/PaginationComponent";
import Switch from "react-input-switch";
import AddHotel from "../../components/Admin/AddHotel";
import DetailTemp from "../../components/Admin/DetailTemp";
import CommonLanguage from "../../utils/CommonLanguage";
import SaoVang from '../../../../public/images/hotels/saovang.png'
import ShowSuccess from "../../components/ShowSuccess";
export default class Hotel extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.state = {
            dataDetail: [],
            hotels: [],
            isOpen: false,
            dataLocationHasHotel: [],
            filterHotelByLocationId: 0,
            hotel: {
                id: 0,
                location_id: 0,
                name: "",
                email: "",
                phone: "",
                address: "",
                coordinate: "",
                description: "",
                is_activated: true,
                evaluation: 1,
                price: 0,
                post_name: "",
                post_content: "",
                image: [],
                remove_ids: [],
            },
            mode: "add",
            nameListRoom: "",
            dataGeneral: [],
            locations: [],
            show: false,
            timeout: 0,
            searchText: "",
            isOpenList: false,
            isOpenDetail: false,
            limit: 15,
            total: 0,
            currentPage: 1,
            value: true,
            idHotel: 0,
            onOpenActions: null,
            isOpenActions: false,
            checkIcon: 'none',
            isReady: false,
            addSuccess: false,
            succeed_message: '',
            openModal: false,
        };
        this.currentLanguages = this.CommonLanguage.getData();
        this.idsDelete = [];
        this.HotelMiddleware = new HotelMiddleware();
        this.timeOutId = null;
        this.locationNameArray = [];
        this.CONSTANT_TEXT = {
            vi: {
                actions: 'Hành động',
                delete: 'Xoá',
                add: 'Thêm',
                edit: 'Sửa',
                addHotel: 'Thêm khách sạn',
                editHotel: 'Chỉnh sửa khách sạn',
                cancel: 'Huỷ bỏ',
                save: 'Lưu',
                search: 'Tìm kiếm',
                name: 'Tên',
                phone: 'Số điện thoại',
                content: 'Nội dung',
                page: 'Trang',
                email: 'Email',
                back: 'Quay lại',
                location: 'Tỉnh thành',
                address: 'Địa chỉ',
                price: 'Giá',
                active: 'Trạng thái',
                listroom: 'Quản lý phòng của khách sạn',
                add_more: 'Thêm tiếp',
                rooms: 'Phòng',
                filter_hotel: 'Tìm khách sạn theo vị trí'
            },
            en: {
                actions: 'Actions',
                delete: 'Delete',
                add: 'Add',
                edit: 'Edit',
                addHotel: 'Add new hotel',
                editHotel: 'Edit hotel',
                cancel: 'Cancel',
                save: 'Save',
                search: 'Search',
                name: 'Name',
                content: 'Content',
                page: 'Page',
                phone: 'Phone',
                email: 'Email',
                back: 'Back',
                location: 'Location',
                address: 'Address',
                price: 'Price',
                active: 'Active',
                listroom: 'List rooms of hotel',
                add_more: 'Add More',
                rooms: 'Rooms',
                filter_hotel: 'Filter hotels by location'
            }
        }
    }

    doCallApiSearch = async (searchText) => {
        const params = {
            location_id: this.state.filterHotelByLocationId,
            limit: this.state.limit,
            offset: 0,
            search: searchText,
        };
        const reponse = await this.HotelMiddleware.getHotels(params);
        this.setState({ hotels: reponse.hotels, total: reponse.general.total });
    };

    doSearch = (evt) => {
        let searchText = evt.target.value; // this is the search text
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.doCallApiSearch(searchText);
        }, 500);
        this.setState({ searchText: searchText });
    };

    async componentDidMount() {
        const params = {
            limit: this.state.limit,
            offset: 0,
        };
        const data = await this.HotelMiddleware.getHotels(params);
        const dataLocation = await this.HotelMiddleware.getLocations();
        const dataLocationHasHotel = await this.HotelMiddleware.getLocationsHasHotel();
        sessionStorage.setItem('location', JSON.stringify(dataLocation))
        let locations = [];
        if (typeof (Storage) !== "undefined" && sessionStorage.getItem('locations')) {
            locations = JSON.parse(sessionStorage.getItem('locations'));
        } else {
            locations = await this.HotelMiddleware.getLocations();
            typeof (Storage) !== "undefined" && sessionStorage.setItem('locations', JSON.stringify(locations));
        }
        locations.forEach(location => {
            this.locationNameArray[location.id] = location.name;
        });
        this.setState({
            locations: locations,
            hotels: data?.hotels || [],
            total: data?.general.total || 0,
            isReady: true,
            dataLocationHasHotel
        });
    }

    getLocationNameBy = (locationId) => {
        if (this.locationNameArray[locationId]) return this.locationNameArray[locationId];
        return 'Unknown'
    };
    handleDeleteHotel = async (id) => {
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [id],
            };
            let response = await this.HotelMiddleware.deleteHotel(params);
            if (response.status && response.status === 200) {
                let hotels = this.state.hotels.filter((hotel) => hotel.id != id);
                if (hotels.length == 0 && this.isLastPageNow()) {
                    if (this.currentPage == 1) this.refreshItemsWhenDelete(1);
                    else this.refreshItemsWhenDelete(this.state.currentPage - 1);
                } else this.refreshItemsWhenDelete(this.state.currentPage);

                this.idsDelete = this.idsDelete.filter(idDelete => idDelete != id);
                this.setState({
                    checkIcon: 'none',
                    succeed_message: response.message,
                    openModal: true
                });
            } else {
                alert(response.message);
            }

        }
    };

    handleAddHotel = () => {
        this.setState({
            isOpen: true,
            mode: "add",
            hotel: {
                id: 0,
                location_id: 0,
                name: "",
                email: "",
                phone: "",
                address: "",
                coordinate: "",
                description: "",
                is_activated: 1,
                evaluation: 1,
                price: '',
                post_name: "",
                post_content: "",
                image: [],
                lat: 16.4527,
                lng: 107.6061,
            },
        });
    };

    handleEditHotel = (item) => {
        this.setState({
            isOpen: true,
            mode: "edit",
            hotel: item,
        });
    };
    handleDetailHotel = async (item) => {
        const dataDetail = await this.HotelMiddleware.getHotelById(item.id);
        this.setState({
            dataDetail: dataDetail,
            isOpenDetail: true,
            mode: "detail",
            hotel: item,
        });
    };

    handleCloseDetail = () => {
        this.setState({ isOpenDetail: false });
    };

    handleClose = () => {
        this.setState({ isOpen: false });
    };

    deCheckAll = () => {
        this.idsDelete = [];
        let checks = document.querySelectorAll('.checkbox-hotel');
        checks.forEach(check => {
            check.checked = false;
        });

        this.setState({ checkIcon: "none" });
    };
    checkAll = () => {
        this.idsDelete = this.state.hotels.map(hotel => hotel.id);
        let checks = document.querySelectorAll('.checkbox-hotel');
        checks.forEach(check => {
            check.checked = true;
        });
        this.setState({ checkIcon: "all" });
    };
    handleToggleCheck = (e, id) => {
        let value = e.target.checked;
        if (value) {
            this.idsDelete = [...this.idsDelete, id]
        } else {
            this.idsDelete = this.idsDelete.filter(idDelete => idDelete != id);
        }
        let checkIcon;
        if (this.idsDelete.length == this.state.hotels.length) checkIcon = 'all';
        else if (this.idsDelete.length == 0) checkIcon = 'none';
        else checkIcon = 'deAll';
        this.setState({ checkIcon });
    };

    handleDeleteHotels = async () => {
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [...this.idsDelete],
            };
            // todo: show message
            let response = await this.HotelMiddleware.deleteHotel(params);
            if (response.status && response.status === 200) {
                let hotels = this.state.hotels.filter(
                    (hotel) => !this.idsDelete.includes(hotel.id)
                );

                if (hotels.length == 0 && this.isLastPageNow()) {
                    if (this.currentPage == 1) this.refreshItemsWhenDelete(1);
                    else this.refreshItemsWhenDelete(this.state.currentPage - 1);
                } else this.refreshItemsWhenDelete(this.state.currentPage);

                this.idsDelete = [];

                this.setState({
                    checkIcon: 'none',
                    succeed_message: response.message,
                    openModal: true
                });

            } else this.setState({ succeed_message: response.message })

        }
    };
    onActionDelete = async (id) => {
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [id],
            };
            let data = await this.HotelMiddleware.deleteHotel(params);
            let hotels = this.state.hotels.filter((hotel) => hotel.id != id);
            this.setState({ hotels });
        }
    };

    // region handler Event
    handleOpenList = (name, idHotel) => {
        this.setState({
            isOpenList: true,
            nameListRoom: name,
            idHotel: idHotel,
        });
    };
    handleCloseList = () => {
        this.setState({
            isOpenList: false,
        });
    };
    handlePageChange = async (pageNumber) => {
        const params = {
            limit: this.state.limit,
            offset: (pageNumber - 1) * this.state.limit,
            search: this.state.searchText,
        };
        const reponse = await this.HotelMiddleware.getHotels(params);
        this.setState({ hotels: reponse.hotels, currentPage: pageNumber, total: reponse.general.total });
        this.deCheckAll();
    };
    handleChangeSwitch = async (id, value) => {
        let hotels = this.state.hotels;
        for (let hotel of hotels) {
            if (hotel.id == id) {
                hotel.is_activated = value;
                const params = { is_activated: hotel.is_activated ? true : false };
                let response = await this.HotelMiddleware.changeStatus(hotel.id, params);
                break;
            }
        }
        this.setState({ hotels: hotels });
    };
    // endregion
    format = (number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(number);
    };
    generateStar = (evaluation) => {
        let arrStar = [];
        for (let i = 0; i < evaluation; i++)
            arrStar.push(<img key={i} className="fastar-hotelList" src={SaoVang} />);
        return arrStar;
    };

    onOpenActions = (id) => {
        this.setState({
            onOpenActions: id
        });
        if (id === this.state.onOpenActions) {
            this.setState({
                onOpenActions: null,
                isOpenActions: false
            })
        } else {
            this.setState({ isOpenActions: true })
        }
    };
    isOpenForm = (param) => {
        this.setState({
            isOpen: param
        })
    };

    onBlurHandler = () => {
        this.timeOutId = setTimeout(() => {
            this.setState({
                onOpenActions: null,
                isOpenActions: false
            });
        });
    };
    onFocusHandler = () => {
        clearTimeout(this.timeOutId);
    };

    isAddSuccess = (result) => {
        this.setState({
            addSuccess: result
        })
    };
    refreshItemsWhenAdd = async () => {
        await this.handlePageChange(1);
    };
    refreshItemsWhenDelete = async (page) => {
        await this.handlePageChange(page);
    };
    isLastPageNow = () => {
        if (this.state.currentPage == Math.ceil(this.state.total / this.state.limit)) return true;
        return false;
    };
    getIconCheck = (nameIcon) => {
        switch (nameIcon) {
            case 'all': return (<FaCheckSquare onClick={this.deCheckAll} />)
            case 'deAll': return (<FaMinusSquare onClick={this.deCheckAll} />)
            case 'none': return (<FaRegSquare onClick={this.checkAll} />)
        }
    }
    createFilterLocation = () => {
        let dataLocationHasHotel = [...this.state.dataLocationHasHotel]
        return (
            <>
                <input className="filter-locations me-2" list="locationsHasHotel" autoComplete="off"
                    id="location_id" name="location_id" placeholder={`${this.CONSTANT_TEXT[this.currentLanguages].filter_hotel}`}
                    onChange={this.handleFilter} />
                <datalist id="locationsHasHotel">
                    {dataLocationHasHotel.map((location, index) =>
                        <option key={index} value={location.name} />
                    )}
                </datalist>
            </>
        );
    }
    handleFilter = async (e) => {
        let id = 0;
        let name = e.target.value;
        let dataLocationHasHotel = [...this.state.dataLocationHasHotel];
        dataLocationHasHotel.map((location, index) => {
            if (location.name.toLowerCase() === name.toLowerCase()) {
                id = location.id;
                return;
            }
        })
        const params = {
            limit: this.state.limit,
            offset: 0,
            location_id: id,

        };
        const response = await this.HotelMiddleware.getHotels(params);
        this.setState({ hotels: response.hotels, filterHotelByLocationId: id, total: response.general.total, });
    }

    showModal = () => {
        setTimeout(() => {
            this.setState({ openModal: false })
        }, 1200);
        return (
            <ShowSuccess textConfirm={this.state.succeed_message} />
        )
    }

    render() {
        let language = this.currentLanguages;
        let nameIcon = this.state.checkIcon;
        return (
            <div className="service">
                <div className="table-service">
                    <div className="actions-table">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={this.handleDeleteHotels}
                            disabled={nameIcon == "none" || this.state.hotels.length == 0}
                        >
                            <FaTrashAlt />
                            &ensp;{this.CONSTANT_TEXT[language].delete}
                        </button>
                        <div className='group-search-add'>
                            {this.createFilterLocation()}
                            <div className="search-table">
                                <input
                                    placeholder={`${this.CONSTANT_TEXT[language].search}...`}
                                    onChange={this.doSearch}
                                    name="search"
                                    value={this.state.searchText}
                                />
                                <span>
                                    <FaSearch />
                                </span>
                            </div>
                            &ensp;
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.handleAddHotel}
                            >
                                <FaPlusCircle className="fa-plus" />
                                &ensp;{this.CONSTANT_TEXT[language].add}
                            </button>
                        </div>

                    </div>

                    <div className='group-table-hotel'>
                        <table className="table table-striped">
                            <thead className="table-th">
                                <tr>
                                    <th>
                                        {this.getIconCheck(nameIcon)}
                                    </th>
                                    <th>#</th>
                                    <th>{this.CONSTANT_TEXT[language].location}</th>
                                    <th>{this.CONSTANT_TEXT[language].name}</th>
                                    <th>{this.CONSTANT_TEXT[language].email}</th>
                                    <th>{this.CONSTANT_TEXT[language].phone}</th>
                                    <th>{this.CONSTANT_TEXT[language].address}</th>
                                    <th>{this.CONSTANT_TEXT[language].price}</th>
                                    <th>{this.CONSTANT_TEXT[language].active}</th>
                                    {/* {this.titleHotel.map((title, index) => (
                                        <th key={index}>{title.text}</th>
                                    ))} */}
                                    <th>{this.CONSTANT_TEXT[language].actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.hotels.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    className='checkbox-hotel'
                                                    type="checkbox"
                                                    name="check-hotel"
                                                    onChange={(e) =>
                                                        this.handleToggleCheck(e,
                                                            item.id
                                                        )
                                                    }
                                                    defaultChecked={false}
                                                />
                                            </td>
                                            <td>{item.id}</td>
                                            <td>
                                                <FaMapMarkerAlt className="icon-map" />
                                                {this.getLocationNameBy(
                                                    item.location_id
                                                )}
                                            </td>
                                            <td
                                                className="click-detail"
                                                onClick={() =>
                                                    this.handleDetailHotel(item)
                                                }
                                            >
                                                {item.name + " "}
                                                {this.generateStar(item.evaluation)}
                                            </td>
                                            <td className="td-email text-truncate-table">
                                                {item.email}
                                            </td>
                                            <td>{item.phone}</td>
                                            <td className="text-truncate-table">
                                                {item.address}
                                            </td>
                                            <td>{this.format(item.price)}</td>
                                            <td>
                                                <Switch
                                                    value={Number(item.is_activated)}
                                                    onChange={(value) =>
                                                        this.handleChangeSwitch(
                                                            item.id,
                                                            value
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <div className='group-actions-hotel'>
                                                    <div className='icon-actions-hotel' onClick={() => this.handleEditHotel(item)}>
                                                        <FaEdit className='icon-actions icon-actions-edit' />
                                                        <span className="tooltiptext">{this.CONSTANT_TEXT[language].edit}</span>
                                                    </div>
                                                    <div className='icon-actions-hotel' onClick={() => this.handleDeleteHotel(item.id)}>
                                                        <FaTrashAlt className='icon-actions icon-actions-delete' />
                                                        <span className="tooltiptext">{this.CONSTANT_TEXT[language].delete}</span>
                                                    </div>
                                                    <div className='icon-actions-hotel' onClick={() => this.handleOpenList(item.name, item.id)}>
                                                        <FaDoorClosed className='icon-actions icon-actions-room' />
                                                        <span className="tooltiptext">{this.CONSTANT_TEXT[language].rooms}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>


                {/* {/ todo: detail  /} */}
                <Drawer
                    isOpen={this.state.isOpenDetail}
                    autoFocus
                    canEscapeKeyClose
                    canOutsideClickClose
                    enforceFocus
                    hasBackdrop
                    position={Position.RIGHT}
                    size={DrawerSize.STANDARD}
                    usePortal
                    icon="info-sign"
                    onClose={this.handleCloseDetail}
                    title="Detail Hotel"
                >
                    <DetailTemp
                        locationName={(id) => this.getLocationNameBy(id)}
                        dataHotelDetail={this.state.dataDetail} />
                </Drawer>
                <Drawer
                    isOpen={this.state.isOpen}
                    autoFocus
                    canEscapeKeyClose
                    enforceFocus
                    hasBackdrop
                    position={Position.Right}
                    size={DrawerSize.LARGE}
                    usePortal
                    icon="info-sign"
                    onClose={this.handleClose}
                    title={
                        this.state.mode === "add" ? "Add hotel" : "Edit hotel"
                    }
                >
                    <AddHotel
                        mode={this.state.mode}
                        hotel={this.state.hotel}
                        locations={this.state.locations}
                        isOpenForm={(params) => this.isOpenForm(params)}
                        isAddSuccess={(result) => this.isAddSuccess(result)}
                        onPageChange={(pageNumber) => this.handlePageChange(pageNumber)}
                    />
                </Drawer>
                <Drawer
                    isOpen={this.state.isOpenList}
                    autoFocus
                    canEscapeKeyClose
                    canOutsideClickClose
                    enforceFocus
                    hasBackdrop
                    position={Position.RIGHT}
                    size={"50%"}
                    usePortal
                    icon="info-sign"
                    onClose={this.handleCloseList}
                    title={this.CONSTANT_TEXT[language].listroom}
                >
                    <Room
                        nameHotel={this.state.nameListRoom}
                        idHotel={this.state.idHotel}
                    />
                </Drawer>
                {this.state.show && (
                    <Delete onDelete={this.handleDeleteHotels}
                        onCloseModal={() => this.setState({ show: false })}
                    />
                )}

                {this.state.openModal && this.showModal()}
                {this.state.isReady && <PaginationComponent
                    total={this.state.total}
                    limit={this.state.limit}
                    currentPage={this.state.currentPage}
                    itemsCount={this.state.hotels.length}
                    onPageChange={(pageNumber) =>
                        this.handlePageChange(pageNumber)
                    }
                />}
            </div>
        );
    }
}
