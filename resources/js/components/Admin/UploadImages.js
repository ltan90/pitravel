import React, { Component } from 'react'
import CommonLanguage from '../../utils/CommonLanguage';
export default class UploadImages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            selectedFile: null,
            inputList: [],
            removeImg: this.props.removeImg,
            fileInput: [],
            filesState: [],
            isRemove: false,
            randomNumber: this.randomNumber(),
            isDefault: false,
            count: 0,
        }
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguage = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            en: {
                add_image: 'Add image'
            },
            vi: {
                add_image: 'Thêm ảnh'
            }
        }
    }
    randomNumber = () => {
        return Math.random();
    }
    componentDidUpdate() {
        const formInput = document.querySelectorAll('.form-img')
        if (this.state.isDefault === true)
            for (let i = 0; i < formInput.length; i++) {
                if (formInput.length === 1 && formInput[0].childNodes.length > 1) {
                    formInput[0].childNodes[1].style.display = "none"
                }
                else {
                    formInput[0].childNodes[1].style.display = "block"
                }
            }
    };
    onAddBtnClick = () => {
        let id = this.randomNumber();
        const inputList = this.state.inputList;
        this.setState({
            isDefault: true,
            count: this.state.count + 1,
            inputList: inputList.concat(
                <div key={inputList.length} className="form-group form-img mb-3 position-relative sub-intput">
                    <input className={`form-control inputClear removeImg ${id}`} type="file" name="image[]" accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => this.fileSelectedHandler(e, id)}
                    />
                    <div className="sub-input" onClick={() => this.removeInput(id)}>
                        <span>X</span>
                    </div>
                </div>)
        });
    };
    removeInput = (id) => {
        document.getElementsByClassName(`${id}`)[0].parentElement.remove();
        const filesState = this.state.files.filter((el) => el.id !== id);
        this.setState({ ...this.state, files: filesState, filesState });
        filesState.map(value => {
            this.state.filesState.push(value)
        })
        this.setState({ isRemove: true, count: this.state.count - 1 })
        this.props.handleUpload(filesState)
    }
    fileSelectedHandler = (e, id) => {
        let input = [];
        if (e.target.files) {
            const files = this.state.files;
            if (files.length !== 0) {
                input = this.state.files.filter((el) => el.id === id);
            }
            if (input.length !== 0) {
                this.state.files.map((item, index) => {
                    if (item.id === input[0].id) {
                        item.file = e.target.files[0]
                    }
                })
            } else {
                this.state.files.push({ id, file: e.target.files[0] });
            }
            this.setState({ ...this.state, files });
            this.props.handleUpload(files);
        }
    };
    render() {
        let language = this.currentLanguage;
        const id = this.state.randomNumber;
        return (
            <div>
                <div className="form-group form-img mb-3 position-relative default-input">
                    <input className={`form-control inputClear removeImg ${id}`} type="file" name="image[]" accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => this.fileSelectedHandler(e, id)}
                    />
                    <div className={this.state.count > 0 ? "d-block sub-input" : "d-none"} onClick={() => this.removeInput(id)}>
                        <span>X</span>
                    </div>
                </div>
                {this.state.inputList.map(function (input, index) { return input; })}
                {this.props.isMultiple ?
                    <div className="d-grid d-md-flex justify-content-md-end me-1">
                        <span onClick={() => this.onAddBtnClick()} className="btn btn-primary">{this.CONSTANT_TEXT[language].add_image}</span>
                    </div> : null}
            </div>
        )
    }
}
