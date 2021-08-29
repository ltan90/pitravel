import React, { Component } from 'react'
import ConfigMiddleware from '../../utils/ConfigMiddleware'
import '../../../css/Config.css'
import Cookies from "js-cookie";
import { FaHandPointRight, FaSave } from 'react-icons/fa';
export default class Config extends Component {
    constructor(props) {
        super(props);
        this.ConfigMiddleware = new ConfigMiddleware()
        this.state = {
            configs: [],
            disableSubmit: false
        }
        this.configRefs = {};
    }
    async componentDidMount() {
        await this.callApiGetList();
    }
    callApiGetList = async () => {
        const response = await this.ConfigMiddleware.getList();
        if (response) {
            this.setState({ configs: response.configs });
        }
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        this.state.configs.forEach(config => {
            this.callApiUpdate(config);
        })
    }
    getErrorString(messages, field) {
        let result = `Config ${field}: \n`;
        for (let message in messages) {
            let messageArr = messages[message];
            for (let messageEle of messageArr) {
                result += messageEle + '\n'
            }
        }
        return result;
    }
    callApiUpdate = async (config) => {
        let refValue = this.configRefs[`${config.entity_id}__${config.entity_type}`].current.value;
        if (config.value != refValue) {
            const params = {
                ...config, value: refValue
            }
            if (config.value != refValue) {
                this.setState({ disableSubmit: true });
                let response = await this.ConfigMiddleware.update(config.id, params);
                if (response.status == 200) {
                    const { configs } = this.state;
                    for (let cfg of configs) {
                        if (cfg.id == config.id) {
                            cfg.value = refValue;
                        }
                    }
                    this.setState({ configs });
                    alert(`Cập nhật ${config.entity_type} thành công!`);
                } else if (response.status == 400) {
                    alert(this.getErrorString(response.message, config.entity_type));
                } else alert('Uncaught error');
            }
        }
        this.setState({ disableSubmit: false });
    }
    inputComponent = (group, currentConfig) => {
        switch (currentConfig.entity_type) {
            case 'limit': return <input type="number" ref={this.configRefs[`${group}__${currentConfig.entity_type}`]} max={50} min={5} step={1} className="form-control" id={`${group}__${currentConfig.entity_type}`} defaultValue={currentConfig.value} />;
            case 'mailto': return <input type="email" ref={this.configRefs[`${group}__${currentConfig.entity_type}`]} className="form-control" id={`${group}__${currentConfig.entity_type}`} defaultValue={currentConfig.value} />;
            default: return <input type="text" ref={this.configRefs[`${group}__${currentConfig.entity_type}`]} className="form-control" id={`${group}__${currentConfig.entity_type}`} defaultValue={currentConfig.value} />
        }
    }
    generateInput = () => {
        let configGroups = {};
        this.state.configs.forEach(config => {
            let entity_id = config.entity_id;
            if (!configGroups[entity_id]) {
                configGroups[entity_id] = [config];
            } else {
                configGroups[entity_id].push(config);
            }
        });
        const configArr = [];
        const groupArr = [];
        for (let group in configGroups) {
            let currentConfigs = configGroups[group].map((currentConfig, idx) => {
                this.configRefs[`${group}__${currentConfig.entity_type}`] = React.createRef();
                return (
                    <div className="mb-3 d-flex flex-column align-items-start" key={idx}>
                        <label htmlFor={`${group}__${currentConfig.entity_type}`} className="form-label text-capitalize">{currentConfig.entity_type}:</label>
                        {this.inputComponent(group, currentConfig)}
                    </div>
                )
            });

            groupArr.push(<button key={groupArr.length} className={`nav-link ${groupArr.length == 0 && 'active'}`} id={`nav-${group}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${group}`} type="button" role="tab" aria-controls={`nav-${group}`} aria-selected={groupArr.length == 0}><span className='text-capitalize fs-5'>{group}</span></button>);
            configArr.push(
                <div key={configArr.length} className={`tab-pane fade ${configArr.length == 0 && 'show active'}`} id={`nav-${group}`} role="tabpanel" aria-labelledby={`nav-${group}-tab`}>
                    {currentConfigs}
                </div>
            );
        }
        const { disableSubmit } = this.state;
        return (
            <div className='shadow p-3 mb-5 bg-body rounded p-4' style={{ width: '35%', margin: '80px auto' }}>
                <div className="p-2" style={{ minHeight: '320px' }} >
                    <nav className='mb-3'>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            {groupArr}
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        {configArr}
                    </div>
                </div>
                <div className="d-flex justify-content-end align-items-center border-top border-3 pt-3">
                    <button disabled={disableSubmit} className='btn btn-success btn-lg m-1'><span><FaSave /></span><span>Save</span></button>
                </div>
            </div>
        );
    }
    render() {
        if (Cookies.get('authUser')) {
            let authUser = JSON.parse(Cookies.get('authUser'));
            if (authUser.role_id != 1) {
                return <Redirect to="/admin" />
            }
        }
        return (
            <form onSubmit={(e) => this.handleSubmit(e)}>
                {this.generateInput()}
            </form>
        )
    }
}
