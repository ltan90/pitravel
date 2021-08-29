import React, { Component } from 'react'
import '../../css/layouts.css';
import CommonLanguage from "../utils/CommonLanguage";

export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.CommonLanguage = new CommonLanguage();
        this.currentLanguages = this.CommonLanguage.getData();
        this.CONSTANT_TEXT = {
            vi: {
                title: 'Chúng tôi luôn đồng hành cùng các bạn với chất lượng phục vụ, thuận lợi, luôn bên bạn mọi lúc mọi nơi!',
                pi_text: ' Pibooking.vn là một phần của Tập đoàn Pi Group với những sản phẩm công nghệ chất lượng và là đối tác tin cậy.'
            },
            en: {
                title: 'We always accompany you with quality service, convenient, always with you anytime, anywhere!',
                pi_text: 'Pibooking.vn is part of Pi Group with the technology product quality and reliable partner.'
            }
        }
    }
    render() {
        let language = this.currentLanguages;
        return (
            <div className='footer'>
                <p className="content-detail">
                    {this.CONSTANT_TEXT[language].title}
                    <br />
                    {this.CONSTANT_TEXT[language].pi_text}
                </p>
                <div className='content-footer'>
                    <img src='../images/Group34.png' alt={'Đối tác'} />
                    <img src='../images/Group35.png' alt={'Đối tác'} />
                    <img src='../images/Group36.png' alt={'Đối tác'} />
                    <img src='../images/Group37.png' alt={'Đối tác'} />
                    <img src='../images/Group38.png' alt={'Đối tác'} />
                    <img src='../images/Group40.png' alt={'Đối tác'} />
                </div>
            </div>
        )
    }
}
