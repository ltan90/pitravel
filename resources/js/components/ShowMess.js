import React, { Component } from 'react'

export default class ShowMess extends Component {
    render() {
        return (
            <div className="container-mess">
                <div className="modal-dialog modal-dialog-centered modal-sbumit" role="document">
                    <div className="modal-content ">
                        <div className="modal-body center_Child">
                            <img src="../../images/Cancel.png" alt={'Hủy'} />
                            <p className="text-confirm text-center">{this.props.showMess}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
