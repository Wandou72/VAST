import mc1_data from "../data/mc1";

const delete_link = (links, ids) => {
    let new_links = []
    for(let i = 0;i < links.length;i++){
        if(ids.indexOf(links[i]["source"].id) !== -1 || ids.indexOf(links[i]["target"].id) !== -1) { //注意数据类型
            new_links.push(links[i])
        }
    }
    return new_links
}

const delete_node = (nodes, links) => {
    let valid_nodes = new Set();
    let new_nodes = [];
    for(let i = 0;i < links.length;i++){
        valid_nodes.add(links[i]['source'].id) //注意数据类型
        valid_nodes.add(links[i]['target'].id)
    }
    for(let i = 0;i < nodes.length;i++){
        if(valid_nodes.has(nodes[i]['id'])){
            new_nodes.push(nodes[i])
        }    
    }
    return [[...new Set(new_nodes)], [...valid_nodes]]
}

const n_level_relation = (n, links, nodes, ids) => {
    let new_links = delete_link(links, ids)
    let temp = delete_node(nodes, new_links)
    let new_nodes = [...temp[0]]
    let valid_ids = [...temp[1]]
    for(let i = 1;i < n;i++){
        new_links = delete_link(links, valid_ids)
        
        temp = delete_node(nodes, new_links)
        new_nodes = [...temp[0]]
        valid_ids = [...temp[1]]
    }
    return [new_links, new_nodes]
}



const graphFilter = (mainEntityMode, includedNodeType, includedNodeCountry, includedNodeID, includedNodeBfsLevel,
    includedLinkType, includedLinkSource, includedLinkTarget, includedNodeCommunity, includedBrushNode) => {
        let curData = {...mc1_data}
        if(mainEntityMode === 1){
            let ids = ["Mar de la Vida OJSC", 979893388, "Oceanfront Oasis Inc Carriers", 8327]
            if(includedNodeBfsLevel > 0){
                let temp = n_level_relation(includedNodeBfsLevel, [...curData.links], [...curData.nodes], ids)
                curData.links = temp[0]
                curData.nodes = temp[1]
            }
        }
        else {
            if(includedNodeID.indexOf('all')===-1){
                // 注意数据类型，数字和文本
                let ids = [...includedNodeID]
                if(includedNodeBfsLevel > 0){
                    let temp = n_level_relation(includedNodeBfsLevel, [...curData.links], [...curData.nodes], ids)
                    curData.links = temp[0]
                    curData.nodes = temp[1]
                }
                console.log()
            }
            else{
                console.log(curData.nodes.length)
            }
        }

        if(includedNodeType.indexOf('all')===-1){
            let types = [...includedNodeType]
            let temp_nodes = []
            let temp_links = []
            let nodes_id = new Set()
            if(includedNodeType.indexOf('None')!==-1){
                for(let i = 0;i < curData.nodes.length;i++){
                    if(!curData.nodes[i].hasOwnProperty("type") || types.indexOf(curData.nodes[i].type) !== -1){
                        temp_nodes.push(curData.nodes[i])
                        nodes_id.add(curData.nodes[i].id)
                    }
                }
            }
            else{
                for(let i = 0;i < curData.nodes.length;i++){
                    if(curData.nodes[i].hasOwnProperty("type") && types.indexOf(curData.nodes[i].type) !== -1){
                        temp_nodes.push(curData.nodes[i])
                        nodes_id.add(curData.nodes[i].id)
                    }
                }
            }
            for (let i = 0;i < curData.links.length;i++){
                if( ((nodes_id.has(curData.links[i].source.id)) || (nodes_id.has(curData.links[i].source)))
                 && ((nodes_id.has(curData.links[i].target.id)) || (nodes_id.has(curData.links[i].target)) )) {//这里要再确认一下source的数据类型
                    temp_links.push(curData.links[i])
                } 
            }
            curData.links = temp_links
            curData.nodes = temp_nodes
        }

        console.log(curData.nodes.length)

        if(includedNodeCountry.indexOf('all')===-1){
            let countries = [...includedNodeCountry]
            let temp_nodes = []
            let temp_links = []
            let nodes_id = new Set()
            if(includedNodeCountry.indexOf('None')!==-1){
                for(let i = 0;i < curData.nodes.length;i++){
                    if(!curData.nodes[i].hasOwnProperty("country") || countries.indexOf(curData.nodes[i].country) !== -1){
                        temp_nodes.push(curData.nodes[i])
                        nodes_id.add(curData.nodes[i].id)
                    }
                }
            }
            else{
                for(let i = 0;i < curData.nodes.length;i++){
                    if(curData.nodes[i].hasOwnProperty("country") && countries.indexOf(curData.nodes[i].country) !== -1){
                        temp_nodes.push(curData.nodes[i])
                        nodes_id.add(curData.nodes[i].id)
                    }
                }
            }
            for (let i = 0;i < curData.links.length;i++){
                if( ((nodes_id.has(curData.links[i].source.id)) || (nodes_id.has(curData.links[i].source)))
                 && ((nodes_id.has(curData.links[i].target.id)) || (nodes_id.has(curData.links[i].target)) )) {//这里要再确认一下source的数据类型
                    temp_links.push(curData.links[i])
                } 
            }
            curData.links = temp_links
            curData.nodes = temp_nodes
        }

        console.log(curData.nodes.length)

        // link筛选

        if(includedLinkType.indexOf('all')===-1){
            let types = [...includedLinkType]
            let temp_nodes = []
            let temp_links = []
            let link_ids = new Set()
            for(let i = 0;i < curData.links.length;i++){
                if(curData.links[i].hasOwnProperty("type") && types.indexOf(curData.links[i].type) !== -1){
                    temp_links.push(curData.links[i])
                    link_ids.add(curData.links[i].source.id)
                    link_ids.add(curData.links[i].target.id)
                }
            }
            for (let i = 0;i < curData.nodes.length;i++){
                if( link_ids.has(curData.nodes[i].id)) {//这里要再确认一下source的数据类型
                    temp_nodes.push(curData.nodes[i])
                } 
            }
            curData.links = temp_links
            curData.nodes = temp_nodes

        }

        // community筛选
        console.log(includedNodeCommunity)
        if(includedNodeCommunity !== -1) {
            let communities = [...includedNodeCommunity]
            let temp_nodes = []
            let temp_links = []
            let nodes_id = new Set()
            
            for(let i = 0;i < curData.nodes.length;i++){
                if(communities.indexOf(curData.nodes[i].community) !== -1){
                    temp_nodes.push(curData.nodes[i])
                    nodes_id.add(curData.nodes[i].id)
                }
            }
            for (let i = 0;i < curData.links.length;i++){
                if( ((nodes_id.has(curData.links[i].source.id)) || (nodes_id.has(curData.links[i].source)))
                 && ((nodes_id.has(curData.links[i].target.id)) || (nodes_id.has(curData.links[i].target)) )) {//这里要再确认一下source的数据类型
                    temp_links.push(curData.links[i])
                } 
            }
            curData.links = temp_links
            curData.nodes = temp_nodes
        }

        if(includedBrushNode !== -1) {
            let brush_nodes = [...includedBrushNode]
            let temp_nodes = []
            let temp_links = []
            let nodes_id = new Set()
            
            for(let i = 0;i < brush_nodes.length;i++){
                temp_nodes.push(brush_nodes[i])
                nodes_id.add(brush_nodes[i].id)
            }
            for (let i = 0;i < curData.links.length;i++){
                if( ((nodes_id.has(curData.links[i].source.id)) || (nodes_id.has(curData.links[i].source)))
                 && ((nodes_id.has(curData.links[i].target.id)) || (nodes_id.has(curData.links[i].target)) )) {//这里要再确认一下source的数据类型
                    temp_links.push(curData.links[i])
                } 
            }
            curData.links = temp_links
            curData.nodes = temp_nodes
        }
        console.log(curData.nodes.length)
        return curData
}

export default graphFilter;