import React, { Component } from 'react';
import { Col, Row, Statistic } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import './view1.css';
import getScore from '../../Functions/getScore';

export default class View1 extends Component {
    render() {
        let {data} = this.props;
        let score_arr = getScore(data)
        console.log(score_arr)
        
        let total_score = (0.4 * score_arr[0] + 0.1 * score_arr[1] + 0.2 * score_arr[2] + 0.3 * score_arr[3]).toFixed(0)
        let curColor
        if(total_score < 60) curColor = 'green'
        else if (total_score < 80) curColor = 'orange'
        else curColor = 'red'

        return (
            <div id='view1' className='pane'>
                <div className='header'>Score</div>
                <div >
                <Row gutter={16}>
                    <Col span={24}>
                    <Statistic className='center-view' title="Total Score" value={total_score} suffix="/ 100" 
                        valueStyle={{
                            color: curColor}
                          }
                    />
                    </Col>
                    {/* <Col span={12}>
                    <Statistic className='right-view' title="Unmerged" value={93} suffix="/ 100" />
                    </Col> */}
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                    <Statistic className='left-view' title="Connection Score" value={score_arr[0]} suffix="/ 100" />
                    </Col>
                    <Col span={12}>
                    <Statistic className='right-view' title="Weight Score" value={score_arr[1]} suffix="/ 100" />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                    <Statistic className='left-view' title="Node Type Score" value={score_arr[2]} suffix="/ 100" />
                    </Col>
                    <Col span={12}>
                    <Statistic className='right-view' title="Link Type Score" value={score_arr[3]} suffix="/ 100" />
                    </Col>
                </Row>
                </div>
            </div>
        )
    }
}
