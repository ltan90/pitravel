export default class CommonLanguage {
    constructor() {
        this.languageType = ['vi', 'en']
        let language = '';
        if (!sessionStorage.getItem('language')) {
            language = 'vi';
            sessionStorage.setItem('language', 'vi');
        } else {
            language = sessionStorage.getItem('language');
            if (!this.languageType.includes(language)) {
                language = 'vi';
                sessionStorage.setItem('language', 'vi');
            }
        }
        this._data = language;
    }
    getData() {
        return this._data;
    }
}