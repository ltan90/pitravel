import React, { Component } from "react";
import {
    FaEdit,
    FaPlusCircle,
    FaTrashAlt,
    FaSearch,
    FaSave,
    FaArrowLeft,
    FaSquare,
    FaMinusSquare,
    FaCheckSquare,
    FaRegSquare,
} from "react-icons/fa";
import "../../../css/ServiceAdmin.css";
import { Drawer, DrawerSize, Position, Icon } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "../../../css/ListRoomAdmin.css";
import HotelRoomMiddleware from "../../utils/HotelRoomMiddleware";
import HotelMiddleware from "../../utils/HotelMiddleware";
import BedMiddleware from "../../utils/BedMiddleware";
import PaginationComponent from "../../components/PaginationComponent";
import CommonLanguage from "../../utils/CommonLanguage";
import ShowSuccess from "../../components/ShowSuccess";

export default class ListRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rooms: [],
            allBeds: [],
            isOpen: false,
            hotel_id: this.props.idHotel,
            room: {
                hotel_id: this.props.idHotel,
                id: 0,
                name: "",
                description: "",
                amount: 1,
                beds: [],
            },
            isCheckedAll: false,
            mode: "add",
            timeout: 0,
            searchText: "",
            limit: 15,
            total: 0,
            currentPage: 1,
            isReady: false,
            checkIcon: "none",
            checkRoomName: true,
            disableSubmit: false,
            openModal: false,
            succeed_delete_message: '',
        };
        this.idsDelete = [];
        this.HotelRoomMiddleware = new HotelRoomMiddleware();
        this.BedMiddleware = new BedMiddleware();
        this.HotelMiddleware = new HotelMiddleware();
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            vi: {
                actions: 'Hành động',
                delete: 'Xoá',
                add: 'Thêm',
                addRoom: 'Thêm phòng',
                editRoom: 'Chỉnh sửa phòng',
                cancel: 'Huỷ bỏ',
                save: 'Lưu',
                search: 'Tìm kiếm',
                roomName: 'Tên loại phòng',
                description: 'Mô tả',
                amount: 'Số lượng',
                back: 'Quay lại',
                beds: 'Quản lý giường',
            },
            en: {
                actions: 'Actions',
                delete: 'Delete',
                add: 'Add',
                addRoom: 'Add new room type',
                editRoom: 'Edit room type',
                cancel: 'Cancel',
                save: 'Save',
                search: 'Search',
                roomName: 'Room type name',
                description: 'Description',
                amount: 'Amount',
                back: 'Back',
                beds: 'Beds',
            }
        }
    }

    async componentDidMount() {
        const roomParams = {
            limit: this.state.limit,
            offset: 0,
        };
        const bedParams = {
            limit: 1000,
            offset: 0,
        };
        let dataBeds = await this.BedMiddleware.getBeds(bedParams);
        dataBeds = dataBeds?.beds || [];

        const dataRooms = await this.HotelRoomMiddleware.getRoomsByHotelId(
            this.props.idHotel,
            roomParams
        );

        let allBeds = dataBeds.map((bed) => ({ ...bed, amount: 0 }));
        let rooms = dataRooms?.hotel_rooms.hotel_room || [];
        rooms = rooms.map((room) => ({
            ...room,
            beds: this.mixBeds(room.beds, allBeds),
        }));
        let total = dataRooms?.hotel_rooms.total || 0;
        this.setState({ rooms, total, allBeds, isReady: true });
    }

    mixBeds = (curRoomBeds, allBeds) => {
        let result = [];
        if (curRoomBeds.length === 0) {
            result = allBeds;
        } else {
            result = allBeds.map(
                (bed) =>
                    curRoomBeds.find((curRoomBed) => curRoomBed.id == bed.id) ||
                    bed
            );
        }
        return JSON.parse(JSON.stringify(result));
    };

    handleAddRoom = () => {
        this.setState({
            isOpen: true,
            mode: "add",
            room: {
                id: 0,
                hotel_id: this.props.idHotel,
                name: "",
                description: "",
                amount: 1,
                beds: JSON.parse(JSON.stringify(this.state.allBeds)),
            },
            checkRoomName: true,
            disableSubmit: false
        });
    };

    handleEditRoom = (item) => {
        this.setState({
            room: JSON.parse(JSON.stringify(item)),
            isOpen: true,
            mode: "edit",
            checkRoomName: true,
            disableSubmit: false
        });
    };

    handleClose = () => {
        this.setState({ isOpen: false });
    };

    handleInputChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let type = e.target.type;

        let room = { ...this.state.room };
        if (type == "number") value = parseInt(value);
        room[name] = value;
        this.setState({ room });
    };

    validateInput = (input) => {
        let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        let formatedInput = input.trim();
        if (formatedInput.length === 0) return false
        for (let c of formatedInput) if (c.match(format)) return false;
        return true;
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.validateAll()) {
            if (this.state.mode === "add") {
                // if (!this.validateInput(this.state.room.name)) {
                //     alert('Name cannot contain special characters')
                //     return;
                // }
                const room = { ...this.state.room };
                // const beds = room.beds
                const beds = room.beds;
                room.hotel_id = this.state.hotel_id;
                const params = {
                    ...room,
                    beds: beds.map((bed) => JSON.stringify(bed)),
                };
                this.setState({ disableSubmit: true });
                const response = await this.HotelRoomMiddleware.createRoom(
                    this.state.hotel_id,
                    params
                );
                if (response.status && response.status === 200) {
                    // let newRoom = response.data;
                    // newRoom.beds = beds;
                    // let rooms = [newRoom, ...this.state.rooms];
                    await this.refreshItemsWhenAdd();
                    this.setState({ isOpen: false });
                } else if (response.response.status === 400) {
                    let messages = response.response.data.message;
                    let messageAlert = '';
                    for (let message in messages) {
                        let messageArr = messages[message];
                        for (let messageEle of messageArr) {
                            messageAlert += messageEle + '\n'
                        }
                    }
                    alert(messageAlert);
                }


            } else if (this.state.mode === "edit") {
                if (!this.validateInput(this.state.room.name)) {
                    alert('Name cannot contain special characters')
                    return;
                }
                const room = JSON.parse(JSON.stringify(this.state.room));
                const beds = room.beds;
                room.hotel_id = this.state.hotel_id;
                const params = {
                    ...room,
                    beds: beds
                        // .filter((bed) => bed.amount > 0)
                        .map((bed) => JSON.stringify(bed)),
                };
                this.setState({ disableSubmit: true });
                const response = await this.HotelRoomMiddleware.updateRoom(
                    room.id,
                    params
                );

                if (response.status && response.status === 200) {
                    // const rooms = JSON.parse(JSON.stringify(this.state.rooms));
                    // let index = rooms.findIndex((roomIter) => roomIter.id == room.id);
                    // rooms[index] = room;
                    await this.refreshItemsWhenAdd();
                    this.setState({ isOpen: false });
                } else if (response.response.status === 400) {
                    let messages = response.response.data.message;
                    let messageAlert = '';
                    for (let message in messages) {
                        let messageArr = messages[message];
                        for (let messageEle of messageArr) {
                            messageAlert += messageEle + '\n'
                        }
                    }
                    alert(messageAlert);
                }

            }
        }

        this.setState({ disableSubmit: false });
    };
    handlePageChange = async (pageNumber) => {
        const params = {
            limit: this.state.limit,
            offset: (pageNumber - 1) * this.state.limit,
            search: this.state.searchText,
        };
        const dataRooms = await this.HotelRoomMiddleware.getRoomsByHotelId(
            this.state.hotel_id,
            params
        );

        let rooms = dataRooms?.hotel_rooms.hotel_room || [];
        rooms = rooms.map((room) => ({
            ...room,
            beds: this.mixBeds(room.beds, this.state.allBeds),
        }));
        let total = dataRooms?.hotel_rooms.total || 0;

        this.setState({ rooms, total, currentPage: pageNumber });
        this.deCheckAll();
    };
    handleChangeBedAmount = (e, bedId) => {
        let room = { ...this.state.room };
        let beds = room.beds;
        let value = e.target.value;

        beds.find((bed) => bed.id == bedId).amount = parseInt(value);

        this.setState({ room });
    };
    generateBedChecks = () => {
        let result = [];

        this.state.room.beds.map((bed) =>
            result.push(
                <div
                    key={bed.id}
                    className="rounded border border-3 bed-amount-container"
                >
                    <label className='label-beds' htmlFor={bed.id}>{bed.name}</label>
                    <input
                        type="number"
                        min={0}
                        name={bed.id}
                        value={bed.amount}
                        step={1}
                        className="form-control"
                        onChange={(e) => this.handleChangeBedAmount(e, bed.id)}
                        required
                    />
                </div>
            )
        );
        return result;
    };
    handleDeleteRoom = async (id) => {
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [id],
            };
            let response = await this.HotelRoomMiddleware.deleteRoom(params);
            if (response.status && response.status === 200) {
                let rooms = this.state.rooms.filter((room) => room.id != id);

                if (rooms.length == 0 && this.isLastPageNow()) {
                    if (this.currentPage == 1) this.refreshItemsWhenDelete(1);
                    else this.refreshItemsWhenDelete(this.state.currentPage - 1);
                } else this.refreshItemsWhenDelete(this.state.currentPage);
                this.setState({
                    openModal: true,
                    succeed_delete_message: response.message
                })
            } else {
                this.setState({
                    openModal: true,
                    succeed_delete_message: response.message
                })
            }

        }
    };
    doSearch = (e) => {
        let searchText = e.target.value; // this is the search text
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.doCallApiSearch(searchText);
        }, 500);
        this.setState({ searchText: searchText });
    };
    doCallApiSearch = async (searchText) => {
        const roomParams = {
            limit: this.state.limit,
            offset: 0,
            search: searchText,
        };

        const dataRooms = await this.HotelRoomMiddleware.getRoomsByHotelId(
            this.props.idHotel,
            roomParams
        );

        let rooms = dataRooms?.hotel_rooms.hotel_room || [];
        let total = dataRooms?.hotel_rooms.total || 0;
        this.setState({ rooms, total, currentPage: 1 });
    };
    handleToggleCheck = (e, id) => {
        let value = e.target.checked;
        if (value) {
            this.idsDelete = [...this.idsDelete, id]
        } else {
            this.idsDelete = this.idsDelete.filter(idDelete => idDelete != id);
        }
        let checkIcon;
        if (this.idsDelete.length == this.state.rooms.length) checkIcon = 'all';
        else if (this.idsDelete.length == 0) checkIcon = 'none';
        else checkIcon = 'deAll';
        this.setState({ checkIcon });
    };
    deCheckAll = () => {
        this.idsDelete = [];
        let checks = document.querySelectorAll('.check-hotelroom');
        checks.forEach(check => {
            check.checked = false;
        })

        this.setState({ checkIcon: "none" });
    };
    checkAll = () => {
        this.idsDelete = this.state.rooms.map(room => room.id);
        let checks = document.querySelectorAll('.check-hotelroom');
        checks.forEach(check => {
            check.checked = true;
        })
        this.setState({ checkIcon: "all" });
    };
    handleDeleteCheckedRooms = async () => {
        if (confirm("Are you sure? You won't able to revert this!")) {
            const params = {
                ids: [...this.idsDelete],
            };
            let response = await this.HotelRoomMiddleware.deleteRoom(params);
            if (response.status && response.status === 200) {
                let rooms = this.state.rooms.filter(
                    (room) => !this.idsDelete.includes(room.id)
                );
                if (rooms.length == 0 && this.isLastPageNow()) {
                    if (this.currentPage == 1) this.refreshItemsWhenDelete(1);
                    else this.refreshItemsWhenDelete(this.state.currentPage - 1);
                } else this.refreshItemsWhenDelete(this.state.currentPage);
                // this.deCheckAll();
                // this.setState({ rooms });
                this.setState({
                    openModal: true,
                    succeed_delete_message: response.message
                })
            } else {
                this.setState({
                    openModal: true,
                    succeed_delete_message: response.message
                })
            }
        }
    };
    refreshItemsWhenAdd = async () => {
        await this.handlePageChange(1);
    }
    refreshItemsWhenDelete = async (page) => {
        await this.handlePageChange(page);
    }
    isLastPageNow = () => {
        if (this.state.currentPage == Math.ceil(this.state.total / this.state.limit)) return true;
        return false;
    }
    handleInputValidationRoomName = () => {
        const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;
        if (this.state.room.name.length === 0
            || this.state.room.name.match(regex)
        ) {
            this.setState({
                checkRoomName: false,
            })
            return false;
        } else {
            this.setState({
                checkRoomName: true,
            })
            return true;
        }
    };
    validateAll = () => {
        let checkRoomName = this.handleInputValidationRoomName();
        return checkRoomName;
    }
    getIconCheck = (nameIcon) => {
        switch (nameIcon) {
            case 'all': return (<FaCheckSquare onClick={this.deCheckAll} />)
            case 'deAll': return (<FaMinusSquare onClick={this.deCheckAll} />)
            case 'none': return (<FaRegSquare onClick={this.checkAll} />)
        }
    }
    showModal = () => {
        setTimeout(() => {
            this.setState({ openModal: false })
        }, 1200);
        return (
            <ShowSuccess textConfirm={this.state.succeed_delete_message} />
        )
    }
    render() {
        let language = this.currentLanguages;
        let nameIcon = this.state.checkIcon;
        return (
            <div className="service hotel-rooms-container">
                <h1>{this.props.nameHotel}</h1>
                <div className="table-service table-hotelroom">
                    <div className="actions-table">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={this.handleDeleteCheckedRooms}
                            disabled={nameIcon == "none" || this.state.rooms.length == 0}
                        >
                            <FaTrashAlt />
                            &ensp;{this.CONSTANT_TEXT[language].delete}
                        </button>
                        <div className='group-search-add'>
                            <div className="search-table">
                                <input
                                    placeholder={`${this.CONSTANT_TEXT[language].search}...`}
                                    onChange={this.doSearch}
                                    name="search"
                                    defaultValue={this.state.searchText}
                                />
                                <span>
                                    <FaSearch />
                                </span>
                            </div>

                            <button
                                type="button"
                                className='btn btn-primary btn-add-room'

                                onClick={this.handleAddRoom}
                                disabled={!this.state.isReady}
                            >
                                <FaPlusCircle className="fa-plus" />
                                &ensp;{this.CONSTANT_TEXT[language].add}
                            </button>
                        </div>

                    </div>

                    <table className="table table-striped table-hover table-rooms">
                        <thead>
                            <tr>
                                <th>
                                    {this.getIconCheck(nameIcon)}
                                </th>
                                <th>#</th>
                                <th>{this.CONSTANT_TEXT[language].roomName}</th>
                                <th>{this.CONSTANT_TEXT[language].description}</th>
                                <th>{this.CONSTANT_TEXT[language].amount}</th>
                                <th>{this.CONSTANT_TEXT[language].actions}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Array.isArray(this.state.rooms) && this.state.rooms.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                className='check-hotelroom'
                                                type="checkbox"
                                                name="check"
                                                id="check"
                                                onChange={(e) =>
                                                    this.handleToggleCheck(e, item.id
                                                    )
                                                }
                                                defaultChecked={false}
                                            />
                                        </td>
                                        <td>{item.id}</td>
                                        <td className="text-truncate-table">
                                            {item.name}
                                        </td>
                                        <td className="text-truncate-table">
                                            {item.description}
                                        </td>
                                        <td>{item.amount}</td>
                                        <td>
                                            <FaEdit
                                                className="fa fa-edit"
                                                onClick={() =>
                                                    this.handleEditRoom(item)
                                                }
                                            />
                                            &ensp;
                                            <FaTrashAlt
                                                className="fa fa-delete"
                                                onClick={() =>
                                                    this.handleDeleteRoom(
                                                        item.id
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <Drawer
                    isOpen={this.state.isOpen}
                    autoFocus
                    canEscapeKeyClose
                    canOutsideClickClose
                    enforceFocus
                    hasBackdrop
                    position={Position.RIGHT}
                    size={"30%"}
                    usePortal
                    icon="info-sign"
                    onClose={this.handleClose}
                    title={
                        this.state.mode === "add" ? this.CONSTANT_TEXT[language].addRoom : this.CONSTANT_TEXT[language].editRoom
                    }
                >
                    <form
                        className="form form-edit-beds"
                        method="post"
                        onSubmit={this.handleSubmit}
                    >
                        <div className="room-inputs">
                            <div className='group-info-beds'>
                                <div className="form-group-bed">
                                    <label htmlFor="name">{this.CONSTANT_TEXT[language].roomName}:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        id="name"
                                        defaultValue={this.state.room.name}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                    <label className={`default-validation ${!this.state.checkRoomName && 'show'}`}>Invalid room name!</label>
                                </div>
                                <div className="form-group-bed">
                                    <label htmlFor="description">
                                        {this.CONSTANT_TEXT[language].description}:
                                    </label>
                                    <textarea
                                        type="text"
                                        rows="5"
                                        className="form-control room-description"
                                        name="description"
                                        id="description"
                                        defaultValue={this.state.room.description}
                                        onChange={this.handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group-bed">
                                    <label htmlFor="amount">{this.CONSTANT_TEXT[language].amount}:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="amount"
                                        id="amount"
                                        min={1}
                                        step={1}
                                        defaultValue={this.state.room.amount}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group-bed">
                                <label htmlFor="beds">{this.CONSTANT_TEXT[language].beds}:</label>
                                <div className="border border-5 rounded beds-container">
                                    {this.generateBedChecks()}
                                </div>
                            </div>
                            <div className="room-buttons">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-md"
                                    onClick={() =>
                                        this.setState({ isOpen: false })
                                    }
                                >
                                    <FaArrowLeft /> {this.CONSTANT_TEXT[language].back}
                                </button>
                                <button
                                    disabled={this.state.disableSubmit}
                                    type="submit"
                                    className="btn btn-primary btn-md button-save-bed"
                                >
                                    <FaSave className="fa-icon-save" /> {this.CONSTANT_TEXT[language].save}
                                </button>
                            </div>
                        </div>
                    </form>
                </Drawer>
                {this.state.openModal && this.showModal()}
                {this.state.isReady && <PaginationComponent
                    total={this.state.total}
                    limit={this.state.limit}
                    currentPage={this.state.currentPage}
                    itemsCount={this.state.rooms.length}
                    onPageChange={(pageNumber) =>
                        this.handlePageChange(pageNumber)
                    }
                />}
            </div>
        );
    }
}
