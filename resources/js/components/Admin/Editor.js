import React, { Component } from 'react';
import CKEditor from 'ckeditor4-react';
import HotelMiddleware from '../../utils/HotelMiddleware'
import CommonLanguage from '../../utils/CommonLanguage';
import '../../../css/Editor.css'
class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postName: '',
            postContent: '',
            data: [],
            type: '',
            hotel_id: this.props.hotelId,
            message: '',
        };
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguage = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            en: {
                title: 'Title',
                content: 'Content'
            },
            vi: {
                title: 'Tiêu đề',
                content: 'Nội dung'
            }
        }
        this.HotelMiddleware = new HotelMiddleware();
    }
    async componentDidMount() {
        const params = {
            hotel_id: this.state.hotel_id,
            param_id: 'hotel_id'
        };
        if (params.hotel_id > 0) {
            const dataPost = await this.HotelMiddleware.getPostById(params);
            if (Object.keys(dataPost).length > 0) {
                if (dataPost.name === "undefined") dataPost.name = "";
                if (dataPost.content === "undefined") dataPost.content = "";
                this.setState({
                    postName: dataPost.name,
                    id: dataPost.id,
                    postContent: dataPost.content,
                })
            }
        }

    }
    getInputEditor = (event) => {
        const data = event.editor.getData();
        this.setState({
            postContent: data
        })
        this.props.handleInputEditor(event.editor.getData())
    };
    getInput = (event) => {
        this.setState({
            postName: event.target.value
        });
        this.props.handleInputPostName(event.target.value)
    };
    componentWillUpdate() {
        if (this.props.removeContent && CKEDITOR.instances.editor1) {
            CKEDITOR.instances.editor1.setData("");
            // this.setState({
            //     postName: '',
            // })
            return;
        }

    }
    render() {
        let language = this.currentLanguage;
        let postName = this.state.postName;
        let postContent = this.state.postContent;
        let pageMode = false;
        if (this.props.page) {
            postName = this.props.page?.name
            postContent = this.props.page?.content
            pageMode = true;
        }
        // if (postContent == '') {
        //     CKEDITOR.instances.editor.setData("");
        // }
        return (
            <div className="mt-4">
                <div className="form-group mb-3 leftify-children">
                    <label className="mb-2">{this.CONSTANT_TEXT[language].title}:</label>
                    <input type="text" className="form-control inputClear" name='post_name'
                        value={postName}
                        onChange={(event) => this.getInput(event)}
                    />
                    {pageMode && <label className={`default-validation ${!this.props.checkPageTitle && 'show'}`}>Invalid title!</label>}
                </div>
                <div className="form-group mb-3 leftify-children">
                    <label className="mb-2 ">{this.CONSTANT_TEXT[language].content}:</label>
                    <CKEditor editor={CKEditor} data={postContent}
                        onChange={(event) => this.getInputEditor(event)} />
                    {pageMode && <label className={`default-validation ${!this.props.checkPageContent && 'show'}`}>Invalid content!</label>}
                </div>
            </div>

        );
    }
}

export default Editor;

