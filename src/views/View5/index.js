import React, { Component } from 'react';
import BarChart from '../../charts/BarChart';
import './view5.css';

export default class View5 extends Component {
    render() {
        const {data, changeNodeBrush} = this.props;
        const height = window.innerHeight;
        return (
            <div id='view5' className='pane'>
                <div className='header'>Knowledge Graph</div>
                <div style={{ }}>
                    {/* <BarChart data={data} width={1000} height={1020}/> */}
                    <BarChart data={data} width={1000} height={0.9 * height} changeNodeBrush={changeNodeBrush}/>
                </div>                
            </div>
        )
    }
}