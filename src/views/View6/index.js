import React, { Component } from 'react';
import { List, Divider, Statistic, Collapse, BackTop } from 'antd';
import './view6.css';
import InfiniteScroll from 'react-infinite-scroll-component';
const { Panel } = Collapse;

export default class View6 extends Component {

    selectUser = (user) => {
        this.props.changeSelectUser(user);
    }

    render() {
        const {data} = this.props;
        console.log(data)
        return (
            <div id='view6' className='pane'>
                <div className='header'>Info List</div>
                {/* <List
                    size="small"
                    bordered
                    dataSource={data}
                    renderItem={user => <List.Item onClick = {() => this.selectUser(user)}>
                        <div>
                            {user.name + ':' + user.age}
                        </div>
                    </List.Item>}
                /> */}

                <div
                    id="scrollableDiv"
                    style={{
                        marginTop:'20px',
                        height: 0.44 * window.innerHeight,
                        width: 0.19 * window.innerWidth,
                        overflow: 'auto',
                        padding: '0 16px',
                        // border: '1px solid rgba(140, 140, 140, 0.35)',
                    }}
                >
                    <InfiniteScroll
                        dataLength={data.nodes.length}
                        // next={loadMoreData}
                        // hasMore={filteredObject.length < 50}
                        // loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        scrollableTarget="scrollableDiv"
                    >
                        
                        <List
                            header={<div><Statistic title="Nodes" value={data.nodes.length} suffix={"/ "+3428} /></div>}
                            // footer={<div>Footer</div>}
                            bordered
                            dataSource={data.nodes}
                            renderItem={item => (
                                <List.Item >
                                {/* <List.Item onClick = {() => this.props.changeClickID(item.id)}> */}
                                    {/* <div>
                                        {'id: ' + item}
                                    </div> */}
                                    <Collapse >
                                        <Panel header={'id: ' + item.id} style={{width: 0.14 * window.innerWidth}}>
                                        <p>{"type: "+ item.type}</p>
                                        <p>{"country: "+ item.country}</p>
                                        <p>{"community: "+ item.community}</p>
                                        </Panel>
                                    </Collapse>
                                </List.Item>
                            )}>
                                
                            </List>
                    </InfiniteScroll>
                </div>

                <div
                    id="scrollableDiv"
                    style={{
                        marginTop:'20px',
                        height: 0.44 * window.innerHeight,
                        width: 0.19 * window.innerWidth,
                        overflow: 'auto',
                        padding: '0 16px',
                        // border: '1px solid rgba(140, 140, 140, 0.35)',
                    }}
                >
                    
                    <InfiniteScroll
                        dataLength={data.links.length}
                        // next={loadMoreData}
                        // hasMore={filteredObject.length < 50}
                        // loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        scrollableTarget="scrollableDiv"
                    >
                        <List
                            header={<div><Statistic title="Links" value={data.links.length} suffix={"/ "+11069} /></div>}
                            // footer={<div>Footer</div>}
                            bordered
                            dataSource={data.links}
                            renderItem={item => (
                                <List.Item >
                                {/* <List.Item onClick = {() => this.props.changeClickID(item.id)}> */}
                                    {/* <div>
                                        {'id: ' + item}
                                    </div> */}
                                    <Collapse >
                                        <Panel header={'source: ' + item.source.id + '\n target: ' + item.target.id} style={{width: 0.14 * window.innerWidth, whiteSpace: 'pre-line'}}>
                                        <p>{"type: "+ item.type}</p>
                                        <p>{"source: "+ item.source.id}</p>
                                        <p>{"target: "+ item.target.id}</p>
                                        <p>{"weight: "+ item.weight}</p>
                                        </Panel>
                                    </Collapse>
                                </List.Item>
                            )}
                        >
                            
                        </List>
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}