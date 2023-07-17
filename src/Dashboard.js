import React, { Component } from 'react';
import data from './data';
import mc1_data from './data/mc1';
import { Layout } from 'antd';
// import View1 from './views/View1';
// import View2 from './views/View2';
import View3 from './views/View3';
// import View4 from './views/View4';
import View5 from './views/View5';
// import View6 from './views/View6';
import './dashboard.css';

import graphFilter from './Functions/graphFilter';

const { Sider, Content, Footer, Header } = Layout;

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedUser: data[0],
            greaterThenAge: 0,
            includedGender: ['Male', 'Female','Unknown'],
            graphInput: mc1_data,

            mainEntityMode: 0,
            includedNodeType: ['None','person', 'organization', 'company', 'political_organization', 'location', 'vessel', 'event', 'movement'],
            includedNodeCountry: ['all'],
            includedNodeID: ['all'],
            includedNodeBfsLevel: -1,

            includedLinkType: ['all'],
            includedLinkSource: ['all'],
            includedLinkTarget: ['all'],

            includedNodeCommunity: -1,
            includedBrushNode: -1,

        }
    }

    changeSelectUser = value => {
        this.setState({
            selectedUser: value
        })
    }

    changeGreaterThenAge = value => {
        this.setState({
            greaterThenAge: value
        })
    }

    changeIncludedGender = value => {
        this.setState({
            includedGender: value
        })
    }

    changeIncludedNodeType = value => {
        this.setState({
            includedNodeType: value
        })
    }
    
    changeEntityMode  = e => {
        console.log(e)
        this.setState({
            mainEntityMode: e
        })
    }

    changeNodeBfsLevel  = value => {
        this.setState({
            includedNodeBfsLevel: value
        })
    }

    changeNodeCountry  = value => {
        this.setState({
            includedNodeCountry: value
        })
    }

    changeNodeID  = value => {
        this.setState({
            includedNodeID: value
        })
    }

    // link
    changeLinkType  = value => {
        this.setState({
            includedLinkType: value
        })
    }

    // community
    changeNodeCommunity = value => {
        this.setState({
            includedNodeCommunity: value
        })
    }

    // brush node
    changeNodeBrush = value => {
        this.setState({
            includedBrushNode: value
        })
    }

    // recommend
    changeRecommend = value => {
        this.setState({
            mainEntityMode: 1,
            includedNodeType: 'all',
            includedNodeBfsLevel: 1,
            includedNodeCountry: 'all',
            includedNodeID: 'all',
            includedLinkType: 'all',
            includedNodeCommunity: -1,
            includedBrushNode: -1,
        });
    }
    
    // reset
    changeReset = value => {
        this.setState({
            mainEntityMode: 0,
            includedNodeType: 'all',
            includedNodeBfsLevel: -1,
            includedNodeCountry: 'all',
            includedNodeID: 'all',
            includedLinkType: 'all',
            includedNodeCommunity: -1,
            includedBrushNode: -1,
        });
    }

    render() {
        const innerHeight = window.innerHeight;
        const innerWidth = window.innerWidth;
        const {selectedUser, greaterThenAge, includedGender, graphInput} = this.state;
        const { mainEntityMode, includedNodeType, includedNodeCountry, includedNodeID, includedNodeBfsLevel, includedNodeCommunity, includedBrushNode} = this.state;
        const { includedLinkType, includedLinkSource, includedLinkTarget } = this.state

        const filteredData = data.filter(user=>includedGender.indexOf(user.gender)!==-1)
                                 .filter(user=>user.age>greaterThenAge);
        console.log(includedNodeType)
        console.log(graphInput)
        let curData = graphFilter(mainEntityMode, includedNodeType, includedNodeCountry, includedNodeID, includedNodeBfsLevel,
            includedLinkType, includedLinkSource, includedLinkTarget, includedNodeCommunity, includedBrushNode)
        console.log(curData)
        console.log(includedBrushNode)

        // 计算当前数据中不同类型的node和link的个数
        function countArr(arr) {
            //数组去重
              var hashArr = [...new Set(arr)];
              var list=[];
              hashArr.forEach((element) => {
                list.push(arr.filter(i=>i==element));
              });
              var newArr=[]
              hashArr.forEach((item,index)=>{
                newArr.push({
                  name:item,
                  value:list[index].length
                })
              })
             return newArr;
        }

        let curNodeTypes = []
        let curLinkTypes = []
        for(let i = 0; i < curData.nodes.length; i++){
            if(curData.nodes[i].hasOwnProperty("type")){
                curNodeTypes.push(curData.nodes[i].type)
            }
            else{
                curNodeTypes.push('None')
            }  
        }
        curNodeTypes = countArr(curNodeTypes)
        console.log(curNodeTypes)

        for(let i = 0; i < curData.links.length; i++){
            curLinkTypes.push(curData.links[i].type)
        }
        curLinkTypes = countArr(curLinkTypes)
        console.log(curLinkTypes)
        
        return (
            <div>
                {/* <Layout>
                    <Header style={{ height: 0.04 * innerHeight, backgroundColor: 'white'}}>
                        <div style={{ height: 0.04 * innerHeight, marginLeft: "-1.4%", marginTop: "-7px", fontSize: '20px', fontWeight: 'bold'}}>
                             NoFishingViz - Displaying and Exploring Patterns that may Indicate Illegal Fishing based on Knowledge Graph
                        </div>
                    </Header>
                </Layout> */}

                <Layout style={{ height: 0.96 * innerHeight }}>
                    <Sider width={0.23 * innerWidth} style={{backgroundColor:'#eee'}}>
                        <Content style={{ height: "99%" }}>
                            <View3 
                                changeGreaterThenAge={this.changeGreaterThenAge}
                                changeIncludedGender={this.changeIncludedGender}
                                changeEntityMode={this.changeEntityMode}
                                changeIncludedNodeType={this.changeIncludedNodeType}
                                changeNodeBfsLevel={this.changeNodeBfsLevel}
                                changeNodeCountry={this.changeNodeCountry}
                                changeNodeID={this.changeNodeID}
                                changeLinkType={this.changeLinkType}
                                changeNodeCommunity={this.changeNodeCommunity}
                                changeNodeBrush={this.changeNodeBrush}
                                changeRecommend={this.changeRecommend}
                                changeReset={this.changeReset}
                            />
                        </Content>
                        {/* <Content style={{ height: "37%" }}>
                            {/* <View2 
                                curNodeTypes={curNodeTypes}
                                curLinkTypes={curLinkTypes}
                            /> */}
                        {/* </Content>
                        <Content style={{ height: "26.5%" }}>
                            <View1 data={curData}/>
                        </Content> */} */}
                    </Sider>
                    {/* <Layout> */}
                        {/* <Content style={{ height: 300 }}>
                            <View4 user={selectedUser}/>
                        </Content> */}
                    {/* <Layout style={{ height: 900 }}> */}
                    <Layout style={{ height: "99%" }}>
                        <Content>
                            <Content style={{ height: "99%" }}>
                                <View5 data={curData} changeNodeBrush={this.changeNodeBrush}/>
                            </Content>
                            {/* <Content style={{ height: "26.5%" }}>
                                <View4 data={curData} changeNodeCommunity={this.changeNodeCommunity}/>
                            </Content> */}
                        </Content>
                        {/* <Sider width={0.2 * innerWidth} style={{backgroundColor:'#eee'}}>
                            <View6 data={curData} changeSelectUser={this.changeSelectUser}/>
                        </Sider> */}
                    </Layout>
                    {/* </Layout> */}
                </Layout>
                {/* <Layout>
                    <Footer style={{ height: 20 }}>
                        <div style={{marginTop: -10}}>
                            Source Code <a href='https://github.com/sdq/react-d3-dashboard'>https://github.com/sdq/react-d3-dashboard</a>;
                            Author <a href='https://sdq.ai'>sdq</a>;
                        </div>
                    </Footer>
                </Layout> */}
            </div>
        )
    }
}
