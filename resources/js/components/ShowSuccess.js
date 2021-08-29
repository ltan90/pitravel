import React, { Component } from 'react'
import "../../css/BookingComponent.css";
import tichYes from '../../../public/images/Group95.png';

export default class ShowSuccess extends Component {
    render() {
        return (
            <div className="container-mess">
                <div className="modal-dialog modal-dialog-centered modal-sbumit" role="document">
                    <div className="modal-content ">
                        <div className="modal-body center_Child">
                            <img src={tichYes} alt={'Liên hệ'} />
                            <p className="text-confirm text-center">
                                {this.props.textConfirm}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
