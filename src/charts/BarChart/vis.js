import * as d3 from 'd3';
import './style.css';
import topicLavoro from '../../data/topic_lavoro'
import flareData from '../../data/flare';

const draw = (props) => {
    d3.select('.vis-barchart > *').remove();
    const data = props.data;
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    const x = 0.64 * document.body.clientWidth;
    const y = 0.96 * document.body.clientHeight;

    // let dataTree = topicLavoro;
    let dataTree = flareData;
    let topicName = "lavoro";


    const svg = d3.select('.vis-barchart')
        .append('svg')
        .style("width", "100%")
        // .style("height", "100%")
        .style("height", height)
        .style("padding", "10px")
        .style("box-sizing", "border-box")
        // .style("font", "18px sans-serif");
        .style("font", "12px sans-serif");

    //   .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    //   .style("display", "block")
    //   .style("margin", "0 -14px")
    //   .style("background", 'white')

    const g = svg.append("g");

    const linkgroup = g.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .attr("transform","translate("+((x))/2+","+(y)/2+")");
    
    const nodegroup = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("transform","translate("+((x))/2+","+(y)/2+")");

    const radius = 517.7777777777777;
    
    const radialColor = d3.scaleOrdinal(["#ffd65a","#CF8140","#9e2b25","#4f1631","#00364B","#6EB3B7","#7a918d","#dfe2e1","#4a9554"]);

    const maxValue = () => {
        const topics = dataTree;
        const root = topics.name;
        let arrValue = []

        for(const i of topics.children) {
            arrValue.push(sumValue(i, root))
        }
        return(
            // d3.max(d3.values(topics)[1].map(d=> d.children.map(e=>+e.value)).flat())
            d3.max(arrValue)
        )
    }
    function tree(data){
        return(
            d3.tree()
                .size([2 * Math.PI, radius])
                .separation((a, b) => (a.parent == b.parent ? 1 : 3) / a.depth)
                (d3.hierarchy(data))
        )
    }

    // function maxValue(){
    //     // const topics = flareData;
    //     const topics = topicLavoro;
    //     const root = topics.name;
    //     let arrValue = []

    //     for(const i of topics.children) {
    //         arrValue.push(sumValue(i, root))
    //     }
    //     return(
    //         // d3.max(d3.values(topics)[1].map(d=> d.children.map(e=>+e.value)).flat())
    //         d3.max(arrValue)
    //     )
    // }

    function scaleCircle(name, value){
        return(
            d3.scaleSqrt().domain([0,maxValue()]).range([0,30])(value) // min max dei valori che puà assumere il cerchio.
        )
    }

    function sumValue(current, root){
        if(current.name === root) return 0;
        if(current.children) {
            let sum = 0;
            for(const i of current.children) {
                if(i.children) {
                    sum += sumValue(i);
                }
                else {
                    sum += parseFloat(i.value);
                }
            }
            return sum;
        }
        else return parseFloat(current.value);
    }

    function getSourceNode(current) {
        if(current.depth === 1) return current.data.name;
        else return getSourceNode(current.parent);
    }

    function newdata(animate = true) {
        let root = tree(dataTree);
        let links_data = root.links();
        let links = linkgroup
            .selectAll("path")
            .data(links_data, d => d.source.data.name+"_"+d.target.data.name);

        links.exit().remove();
        
        let newlinks = links
            .enter()
            .append("path")
            .attr("d", d3.linkRadial()
                        .angle(d => d.x)
                        .radius(0.1))
            ;
    
        
        let t = d3.transition()
            .duration(animate ? 400 : 0)
            .ease(d3.easeLinear)
            // .on("end", function() {
            //     console.log(g.node())
            //     const box = g.node().getBBox();
            //     svg.transition().duration(1000).attr("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
            // });
        
        let alllinks = linkgroup.selectAll("path")
        alllinks
            .transition(t)
            .attr("stroke", d => {
                if(d.source.parent === null) {
                    return radialColor(d.target.data.name);
                }
                else {
                    return radialColor(getSourceNode(d.target.parent));
                }
                // return d.target.data.children? radialColor(d.target.data.name) : radialColor(d.source.data.name)
            })
            .attr("d", d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y));
    

        let rootName = root.data.name;

        let nodes_data = root.descendants().reverse();
        let nodes = nodegroup
            .selectAll("g")
            .data(nodes_data, function (d) { 
            if (d.parent) {
                return d.parent.data.name+d.data.name;
            }
            return d.data.name});
        
        nodes.exit().remove();
    
        let newnodes = nodes
            .enter().append("g");
        
        let allnodes = animate ? nodegroup.selectAll("g").transition(t) : nodegroup.selectAll("g");
        allnodes
            .attr("transform", d => `
            rotate(${d.x * 180 / Math.PI - 90})
            translate(${d.y},0)
            `);
        
        newnodes.append("circle")
            .attr("r", d => {
                // console.log(sumValue(d.data, rootName))
                // return d.data.children ? scaleCircle(topicName, d.data.children.reduce((accumulator, current) => accumulator + parseFloat(current.value),0)) : scaleCircle(topicName,d.data.value)
                return scaleCircle(topicName, sumValue(d.data, rootName));
            })
            .on ("click", function (d) {
                let altChildren = d.data.altChildren || [];
                let children = d.data.children;
                d.data.children = altChildren;
                d.data.altChildren = children;
                newdata(); 
            });
            
        nodegroup.selectAll("g circle")
        .attr("fill", d => {
            if(d.parent === null) {
                return radialColor(d.data.name);
            }
            else {
                return radialColor(getSourceNode(d));
            }
        })
        .attr("fill-opacity",0.9)
        // .attr("stroke",d => d.data.children ? radialColor(d.data.name) : radialColor(d.parent.data.name))
        .attr("stroke", d => {
            if(d.parent === null) {
                return radialColor(d.data.name);
            }
            else {
                return radialColor(getSourceNode(d));
            }
        })
        .attr("stroke-width",0.5)

        newnodes.append("text")
            .attr("dy", "0.31em")
            .text(d => d.data.name)
            .clone(true).lower()
            .attr("stroke", "white");
        
        
        
        nodegroup.selectAll("g text")
            .attr("x", d => d.x < Math.PI === !d.children ? scaleCircle(topicName, d.data.value)+3: -scaleCircle(topicName,d.data.value)-3)
            .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
            .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null);
    }
    newdata(false); 

    // document.body.appendChild(svg.node());

    // const box = g.node().getBBox();
    
    // //box.width = box.height = Math.max(box.width, box.height)*1.2;
    // svg.remove()
    //     .attr("width", box.width)
    //     .attr("height", box.height)
    //     .attr("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);

    // 缩放
    function zoomed() {
        svg.select('g').attr('transform', d3.event.transform.toString());
    }

    const zoom = d3
        .zoom()
        .scaleExtent([0.5, 6])
        .on('zoom', zoomed);
    svg.call(zoom);
}

export default draw;