import React, { Component } from 'react';
import { Button } from 'antd';
import {
    SyncOutlined,
  } from '@ant-design/icons';
import './view4.css';
import LineChart from '../../charts/LineChart';
const total_community_amount = Array(115).fill(0).map((_, i) =>i +1)

export default class View4 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            communities: -1,
            confirm: 0
        };
    }

    onChangeCommunity = value => {  
        this.setState({
            communities: value
        });
        this.props.changeNodeCommunity(value)
    };

    onChangeConfirm = e => {  
        this.setState({
            confirm: 1
        });
        console.log(this.state.communities)
    };

    render() {
        const {data} = this.props;
        const {communities, confirm} = this.state;
        return (
            <div id='view4' className='pane' style={{ position: 'relative' }}>
                <div className='header'>Community</div>
                <div style={{ marginTop: 15, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    <LineChart data={data} confirm={confirm} communities={communities} onChangeCommunity={this.onChangeCommunity} />
                    {/* <Button
                        style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
                        onClick={this.onChangeConfirm}
                    >
                        confirm
                    </Button> */}
                </div>
            </div>
        )
    }
}