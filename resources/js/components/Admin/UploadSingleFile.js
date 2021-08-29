import React, { Component } from 'react'
export default class UploadSingleFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            selectedFile: null,
            inputList: [],
            removeImg: this.props.removeImg,
            fileInput: [],
        }
    }
    fileSelectedHandler = (e) => {
        this.setState({
            files: [],
        });
        if (e.target.files) {
            // const files = this.state.files;
            this.state.files.push(e.target.files[0]);
            // this.setState({ ...this.state, files });
            this.props.handleUpload(this.state.files);
        }
    };
    render() {
        return (
            <div>
                <div className="form-group mb-3">
                    <input className="form-control inputClear"
                        type="file"
                        name="image[]"
                        accept="image/png, image/jpeg, image/jpg"
                        aria-describedby="input-image"
                        onChange={this.fileSelectedHandler}
                    />
                </div>
            </div>
        )
    }
}
