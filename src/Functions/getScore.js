const getScore = (data) => {
    let nodes_length = data.nodes.length
    let links_length = data.links.length

    // connection score
    let dict = new Object()
    let res_arr = []
    for(let i = 0; i < nodes_length;i++){
        dict[data.nodes[i].id] = i
    }
    let arr_count = []
    for(let i = 0;i < nodes_length; i++) {
        arr_count.push(new Set())
    }

    // console.log(arr_count)
    for(let i = 0; i < links_length;i++){
        let temp1 = data.links[i].source instanceof Object ? data.links[i].source.id:data.links[i].source
        let temp2 = data.links[i].target instanceof Object ? data.links[i].target.id:data.links[i].target
        arr_count[dict[temp1]].add(temp2)
        arr_count[dict[temp2]].add(temp1)
    }

    let set_threshhold = 0.5
    let count_nodes = 0
    for(let i = 0; i < arr_count.length;i++){
        if(arr_count[i].size / (nodes_length - 1) > set_threshhold) count_nodes++
        res_arr.push(arr_count[i].size / (nodes_length - 1))
    }
    let connection_score = 100 * (count_nodes / nodes_length).toFixed(2)
    
    // weight score
    let sum_score = 0
    for(let i = 0; i < links_length;i++){
        sum_score += data.links[i].weight
    }
    let weight_score = 100 * (sum_score / links_length).toFixed(2)

    // Node type score
    let node_type_map = {
        'None': 1,
        'organization': 0.9, 
        'company': 0.9, 
        'political_organization': 0.9, 
        'person': 0.7, 
        'location': 0.2, 
        'vessel': 0.2, 
        'event': 0.5, 
        'movement': 0.5,
    }
    let node_type_sum = 0
    for(let i = 0;i < nodes_length; i++) {
        node_type_sum += node_type_map[data.nodes[i].hasOwnProperty('type')? data.nodes[i].type:'None']
    }

    let node_type_score = 100 * (node_type_sum/nodes_length).toFixed(2)

    // link type score
    let link_type_map = {
        'membership': 1,
        'partnership': 1, 
        'ownership': 0.8, 
        'family_relationship': 0.1, 
    }
    let link_type_sum = 0
    for(let i = 0;i < links_length; i++) {
        link_type_sum += link_type_map[data.links[i].type]
    }

    let links_type_score = 100 * (link_type_sum/links_length).toFixed(2)

    // console.log(res_arr)
    return [connection_score, weight_score, node_type_score, links_type_score]
}

export default getScore;