import React, {Component} from "react";
import {FaTimes} from "react-icons/fa";
import "../../../../css/DeleteAdmin.css";

export default class Delete extends Component {
    constructor(props) {
        super(props);
    }

    onCloseModal = () => {
        this.props.onCloseModal();
    };

    render() {
        return (
            <div className="modal-delete">
                <div className="modal-content delete">
                    <span onClick={this.onCloseModal} className="closeModal">
                        <FaTimes/>
                    </span>
                    <p className="label-delete">Delete confirmation</p>
                    <div className="content-delete">
                        <p>
                            Are you sure you want to delete? <b>{this.props.nameRouter}</b>
                        </p>
                        <b className="nameDelete">{this.props.nameToDelete}</b>
                    </div>
                    <div className="two-button">
                        <button
                            onClick={() => this.props.onDelete()}
                            className="btn-danger button-yes"
                        >
                            Delete
                        </button>
                        <button
                            onClick={this.onCloseModal}
                            className="btn-secondary button-cancel"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
