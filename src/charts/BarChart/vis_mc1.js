import * as d3 from 'd3';
import './style.css';
import topicLavoro from '../../data/topic_lavoro'
import mc1_data from '../../data/mc1_test';

const draw = (props) => {
    d3.select('.vis-barchart > *').remove();
    const graph_data = props.data
    console.log(graph_data)
    // const data = props.data;
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    const x = 0.64 * document.body.clientWidth;
    const y = 0.96 * document.body.clientHeight;
    
    const data = {...graph_data};
    const nodes = data['nodes']
    const links = data['links']

    //nodes-type
    let nodes_type = []
    nodes.forEach(e => nodes_type.push(e.type))
    nodes_type = [...new Set(nodes_type)]
    // console.log(nodes_type);

    //links-type
    let links_type = []
    links.forEach(e => links_type.push(e.type))
    links_type = [...new Set(links_type)]
    // console.log(links_type);

    //id
    let ids = ["Mar de la Vida OJSC", 979893388, "Oceanfront Oasis Inc Carriers", 8327]

    //颜色设置
    const color_nodes = d3.scaleOrdinal()
        .domain(nodes_type)   //use allTypes to ensure the same legend in all timestamps
        .range(d3.schemePastel1);  
    const colorMapNode = {
        '人物': "#52c41a",
        '事件': "#1890ff",
        '机构': "#9254de",
        '文献': "#ff85c0",
        '地点': "#9c755f",
        'vessel': "#fa8c16",
        'event': "#5cdbd3",
        'movement': "#8c8c8c",
        'None': "#ff4d4f",
    }
    const color_links = d3.scaleOrdinal()
        .domain(links_type)
        .range(["#95de64","#69c0ff","#ff7875","#ffc069"])

    const colorMapLink = {
        '人物-人物': "#95de64",
        '人物-机构': "#ffc069",
        '人物-文献': "#69c0ff",
        '人物-地点': "#ff7875",
        '人物-事件': "#95c075",
    }
    const Tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)


    const svg = d3.select('.vis-barchart')
        .append('svg')
        .style("width", "100%")
        // .style("height", "100%")
        .style("height", height)
        .style("padding", "10px")
        .style("box-sizing", "border-box")
        // .style("font", "18px sans-serif");
        .style("font", "12px sans-serif");

    // 创建一个刷子
    let brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("start", function(){
                            let brushdata=[]
                    })
        .on("end", brush_end)
        .filter((event) => (event.ctrlKey || event.metaKey) && !event.button);

    // 将刷子添加到SVG画布上
    svg.append("g")
        .attr("class", "brush")
        .call(brush);

    function brush_end({ selection }) {
        if (selection) {
            let [[x0, y0], [x1, y1]] = selection;

            x0 = test.invert([x0, y0])[0]
            y0 = test.invert([x0, y0])[1]
            x1 = test.invert([x1, y1])[0]
            y1 = test.invert([x1, y1])[1]

            let value = node
                // .style("stroke", "gray")
                .filter(d => x0 <= d.x && d.x < x1 && y0 <= d.y && d.y < y1)
                .style("fill", "black")
                .data();
            console.log(value);
            props.changeNodeBrush(value)
            d3.select(this).call(brush.move, null);
        } 
    }
    
    let group = svg
                .append('g')
                .attr("cursor", "grab");

    let link = group
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr('class', 'link')
        .style("stroke", function (d) {
            return colorMapLink[d.type]
        })
        .style('stroke-width', 1.5)


    // Initialize the nodes
    let node = group
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr('class', 'node')
        .attr("r", function (d) {
            if (ids.indexOf(d.id) !== -1) {
                // console.log(d)
                return 80
            } else {
                return 20
            }
        })
        .attr("stroke", "yellow")
        .attr("stroke-width",function (d) {
            if (ids.indexOf(d.id) !== -1) {
                return 40
            } else {
                return 0
            }
        })
        .attr("stroke-opacity", 0.2)
        .style("fill", function (d) {
            return d.hasOwnProperty('type')? colorMapNode[d.type]:colorMapNode['None']
        })


    let mouseover = function (event, d) {
        // console.log('event',event)
        // console.log('d',d)
        
        Tooltip
            .transition()
            .duration(200)
            .style("opacity", 0.9)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY + 15) + "px")

        d3.select(this)
            .style("stroke", "brown")
            .style("opacity", 1)

        d3.select(this)
            .classed("hover", true)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")

        //filter出mouseover出来circle与其对应的link
        //以hover到的circle为source的数据
        let source_data = links.filter(function (e) {
            return e.source.id == d.id
        })

        //以hover到的circle为target的数据
        let target_data = links.filter(function (e) {
            return e.target.id == d.id
        })

        // console.log('filter',source_data, target_data);

        let highlight_circle = []
        highlight_circle.push(d.id) //将hover的circle加上
        source_data.forEach(item => highlight_circle.push(item.target.id)) //以该circle为source的target
        target_data.forEach(item => highlight_circle.push(item.source.id)) //以该circle为target的source
        highlight_circle = [...new Set(highlight_circle)] //去重
        // console.log('highlight',highlight_circle);

        // //highlight circle
        d3.selectAll('.node')
            .select(function (e, i) {
                if (highlight_circle.indexOf(e.id) >= 0) {
                    return this
                }
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('fill', 'lightgrey')
                    .style('opacity', 0.2)
            })

        // //highligh path
        // d3.selectAll('.link')
        //     .select(function (e, i) {
        //         if ((e.target.id != d.id) || (e.source.id != d.id)) {
        //             return this
        //         }
        //         d3.select(this)
        //             .transition()
        //             .duration(200)
                    
        //             // .style('stroke-width', 3)
                    

        //     })

        d3.selectAll('.link')
            .select(function (e, i) {
                if ((e.target.id == d.id) || (e.source.id == d.id)) {
                    d3.select(this)
                    .transition()
                    .duration(200)
                    // .style('opacity', 0.05)
                    .style('stroke-width', '18px')
                    return this
                }
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 0.05)
                    // .style('stroke-width', '3px')
            })



        Tooltip.html("type:" + d.type + "<br>" + "id:" + d.id)
    }



    let mousemove = function (event, d, i) {
        return
        Tooltip
            .transition()
            .duration(200)
            .style("opacity", 0.9)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY + 15) + "px")

        d3.select(this)
            .style("stroke", "brown")
            .style('stroke-width', 1.5)


        // d3.select(this)
        //     .classed("hover", true)
        //     .attr("stroke", "black")
        //     .attr("stroke-width", "1px")

        //filter出mouseover出来circle与其对应的link
        //以hover到的circle为source的数据
        let source_data = links.filter(function (e) {
            return (e.source.id == d.id)
        })

        //以hover到的circle为target的数据
        let target_data = links.filter(function (e) {
            return (e.target.id == d.id)
        })

        // console.log(source_data, target_data);

        let highlight_circle = []
        highlight_circle.push(d.id) //将hover的circle加上
        source_data.forEach(item => highlight_circle.push(item.target.id)) //以该circle为source的target
        target_data.forEach(item => highlight_circle.push(item.source.id)) //以该circle为target的source
        highlight_circle = [...new Set(highlight_circle)] //去重
        // console.log(highlight_circle);

        // //highlight circle
        d3.selectAll('.node')
            .select(function (e, i) {
                if (highlight_circle.indexOf(e.id) >= 0) {
                    return this
                }
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('fill', 'lightgrey')
                    .style('opacity', 0.2)
            })

        // //highligh path
        d3.selectAll('.link')
            .select(function (e, i) {
                if ((e.target.id != d.id) || (e.source.id != d.id)) {
                    return this
                }
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('stroke-width', 3)

            })


        d3.selectAll('.link')
            .select(function (e, i) {
                if ((e.target.id == d.id) || (e.source.id == d.id)) {
                    return this
                }
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 0.05)

            })



        Tooltip.html("type:" + d.type + "<br>" + "id:" + d.id)
    }


    let mouseleave = function (event, d) {
        Tooltip.transition()
            .duration(200)
            .style("opacity", 0);
        d3.selectAll(".node")
            .transition()
            .duration(200)
            .style("opacity", 1)
            // .style("stroke", "none")
            .style("fill", function (d) {
                return d.hasOwnProperty('type')? colorMapNode[d.type]:colorMapNode['None']
            })
            .attr("stroke", "yellow")
            .attr("stroke-width",function (d) {
                if (ids.indexOf(d.id) >= 0) {
                    return 40
                } else {
                    return 0
                }
            })
        d3.selectAll('.link').transition()
            .duration(200).style('stroke-width', '1.5px').style("opacity", 1)
    }

    node
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)



    let simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function (d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-600))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
        .on("end", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x + 6; })
            .attr("cy", function (d) { return d.y - 6; });
    }

    let test = d3.zoomIdentity
    
    svg.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.01, 8])
        .on("zoom", zoomed));

    function zoomed({ transform }) {
        test = transform
        group.attr("transform", transform);
    }

}

export default draw;