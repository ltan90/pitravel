import React, { Component } from "react";
import "../../css/PaginationComponent.css";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import Pagination from "react-js-pagination";
import HotelMiddleware from '../utils/HotelMiddleware'
import CommonLanguage from "../utils/CommonLanguage";


export default class PaginationComponent extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.state = {
            isHidden: false,
        };
        this.CONSTANT_TEXT = {
            vi: {
                display: 'Hiển thị',
                no_data: 'Không có dữ liệu'
            },
            en: {
                display: 'Display',
                no_data: 'No data'
            }
        }
        this.HotelMiddleware = new HotelMiddleware();
    }

    async handlePageChange(pageNumber) {
        this.setState({
            ...this.state,
            activePage: pageNumber,
            pageNumber: pageNumber
        });
        this.props.onPageChange(pageNumber);
    }

    render() {
        let language = this.currentLanguages;
        let showStart = (this.props.currentPage - 1) * this.props.limit + 1;
        return (
            this.props.itemsCount > 0
                ? this.props.total > this.props.limit && <div className="hotel-pagination">
                    <div className="btn-container">
                        <Pagination
                            hideFirstLastPages={true}
                            prevPageText={<FaCaretLeft className="fa-caret" />}
                            nextPageText={<FaCaretRight className="fa-caret" />}
                            activePage={this.props.currentPage}
                            itemsCountPerPage={this.props.limit}
                            totalItemsCount={this.props.total}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange.bind(this)}
                            disabledClass='disable-page'
                        />
                    </div>
                    <div className="text-pagination">{this.CONSTANT_TEXT[language].display} {showStart}-{showStart + this.props.itemsCount - 1}</div>
                </div>
                : <div className="text-pagination-center">{this.CONSTANT_TEXT[language].no_data}</div>

        );
    }
}
