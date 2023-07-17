import React, { Component } from 'react';
import { Radio, Tooltip, Button, Checkbox, Divider, Select, InputNumber } from 'antd';
import './view3.css';
import all_countries from '../../data/all_countries';
import all_ids from '../../data/all_ids';

import {
    HeartFilled,
    SyncOutlined,
  } from '@ant-design/icons';

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Male', 'Female', 'Unknown'];
const defaultCheckedList = ['Male', 'Female', 'Unknown'];

const { Option } = Select;

const options = [];

// country
for (let i = 0; i < all_countries.length; i++) {
    options.push({
      value: all_countries[i],
      label: all_countries[i],
    });
  }
options.push({value:'all', label:'all'})
options.push({value:'None', label:'None'})

const id_options = []
//id
for(let i = 0; i < all_ids.length; i++) {
    id_options.push({
      value: all_ids[i],
      label: all_ids[i],
    });
  }
id_options.push({value:'all', label:'all'})
// id_options.push({value:'None', label:'None'})


export default class View3 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedList: defaultCheckedList,
            indeterminate: true,
            checkAll: false,

            node_type: 'all',
            entitiesChoose: 0,
            BFS: -1,
            country: 'all',
            ids: 'all',
            link_type: 'all',
        };
    }

    onChangeCheckbox = checkedList => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            checkAll: checkedList.length === plainOptions.length,
        });
        this.props.changeIncludedGender(checkedList);
    };

    onCheckAllChange = e => {
        const checkedList = e.target.checked ? plainOptions : [];
        this.setState({
            checkedList: checkedList,
            indeterminate: false,
            checkAll: e.target.checked,
        });
        this.props.changeIncludedGender(checkedList);
    };

    onChangeSilder = value => {
        this.props.changeGreaterThenAge(value);
    };

    onChangeNodeType = checkedList => {  
        this.setState({
            node_type: checkedList,
        });
        this.props.changeIncludedNodeType(checkedList);
    };

    onChangeEntityMode= e => {
        this.setState({
            entitiesChoose: e.target.value
        });
        this.props.changeEntityMode(e.target.value);
    };

    onChangeNodeBfsLevel= value => {
        this.setState({
            BFS: value
        });
        this.props.changeNodeBfsLevel(value)
    };

    onChangeNodeCountry = checkedList => {  
        this.setState({
            country: checkedList,
        });
        this.props.changeNodeCountry(checkedList);
    };

    onChangeNodeID = checkedList => {  
        this.setState({
            ids: checkedList,
        });
        this.props.changeNodeID(checkedList);
    };

    // link
    onChangeLinkType = checkedList => {  
        this.setState({
            link_type: checkedList,
        });
        this.props.changeLinkType(checkedList);
    };

    // recommend
    onChangeRecommend = e => {  
        this.setState({
            node_type: 'all',
            entitiesChoose: 1,
            BFS: 1,
            country: 'all',
            ids: 'all',
            link_type: 'all',
        });
        // this.props.changeEntityMode(1);
        // this.props.changeIncludedNodeType('all');
        // this.props.changeNodeCountry('all');
        // this.props.changeNodeID('all');
        // this.props.changeNodeBfsLevel(1)
        // this.props.changeLinkType('all');
        // this.props.changeNodeCommunity(Array(115).fill(0).map((_, i) =>i +1));
        // this.props.changeNodeBrush(-1);
        this.props.changeRecommend(e)
    };

    // reset
    onChangeReset = e => {  
        this.setState({
            node_type: 'all',
            entitiesChoose: 0,
            BFS: -1,
            country: 'all',
            ids: 'all',
            link_type: 'all',
        });
        // this.props.changeEntityMode(0);
        // this.props.changeIncludedNodeType('all');
        // this.props.changeNodeCountry('all');
        // this.props.changeNodeID('all');
        // this.props.changeNodeBfsLevel(-1)
        // this.props.changeLinkType('all');
        // this.props.changeNodeCommunity(Array(115).fill(0).map((_, i) =>i +1));
        // this.props.changeNodeBrush(-1);
        this.props.changeReset(e)
    };
    

    render() {
        const {node_type, entitiesChoose, BFS, country, ids, link_type} = this.state;
        return (
            <div id='view3' className='pane'>
                <div className='header'>Filter</div>
                <div className='rowStyle' style={{ marginLeft: 10 }}>
                    <div className='tagText'>
                        4 Entities: 
                    </div>
                    <Radio.Group defaultValue={0} onChange={this.onChangeEntityMode} value={entitiesChoose} className='radioText'>
                        <Radio value={1}>
                            <Tooltip title="Yes">
                                Yes
                            </Tooltip>
                        </Radio>
                        <Radio value={0}>
                            <Tooltip title="No">
                                No
                            </Tooltip>
                        </Radio>
                    </Radio.Group>
                    <div style={{clear: 'both'}}></div>

                    <div className='tagText' >
                        Node Type: 
                    </div>

                    
                    <Select defaultValue={['all']} className='filter_box' value={node_type}
                        onChange={this.onChangeNodeType} mode="multiple"
                    >
                        <Option value="all">all</Option>
                        <Option value="person">person</Option>
                        <Option value="organization">organization</Option>
                        <Option value="company">company</Option>
                        <Option value="political_organization">political_organization</Option>
                        <Option value="location">location</Option>
                        <Option value="vessel">vessel</Option>
                        <Option value="event">event</Option>
                        <Option value="movement">movement</Option>
                        <Option value="None">None</Option>
                    </Select>
                    <div style={{clear: 'both'}}></div>

                    <div className='tagText'>
                        Node Country: 
                    </div>
                    <Select
                        mode="tags" className='filter_box' defaultValue={['all']} value={country}
                        onChange={this.onChangeNodeCountry}
                        tokenSeparators={[',']}
                        options={options}
                    />
                    <div style={{clear: 'both'}}></div>

                    <div className='tagText'>
                        Node Id: 
                    </div>
                    <Select
                        mode="tags" className='filter_box' defaultValue={['all']} value={ids}
                        onChange={this.onChangeNodeID}
                        tokenSeparators={[',']}
                        options={id_options}
                    />
                    <div style={{clear: 'both'}}></div>

                    <div className='tagText'>
                        Node BFS层级: 
                    </div>

                    <InputNumber min={-1} max={10} defaultValue={-1} 
                        onChange={this.onChangeNodeBfsLevel} className='filter_box' value={BFS}
                    />
                    <div style={{clear: 'both'}}></div>

                    <div className='tagText'>
                        Link Type: 
                    </div>
                    <Select defaultValue={['all']} className='filter_box' value={link_type}
                        onChange={this.onChangeLinkType} mode="multiple"
                    >
                        <Option value="all">all</Option>
                        <Option value="family_relationship">family_relationship</Option>
                        <Option value="membership">membership</Option>
                        <Option value="ownership">ownership</Option>
                        <Option value="partnership">partnership</Option>
                    </Select>
                    <div style={{clear: 'both'}}></div>

                    {/* <div style={{marginTop:'20px', textAlign: 'center'}}> */}
                    <Button 
                        className='icon' shape="circle" 
                        icon={<HeartFilled style={{fontSize: '22px', color: 'hotpink'}} />} size='large' 
                        onClick={this.onChangeRecommend}
                    />
                    <span className='buttonText'> Recommend </span>
                    
                    <Button 
                        className='icon' shape="circle" 
                        icon={<SyncOutlined style={{fontSize: '22px', color: '#1890ff'}} />} size='large' 
                        onClick={this.onChangeReset}
                    />
                    <span className='buttonText'> Reset </span>
                    {/* </div> */}
                </div>
            </div>
        )
    }
}