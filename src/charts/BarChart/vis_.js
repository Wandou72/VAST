import * as d3 from 'd3';
import './style.css';
import pubMapData from '../../data/pubMapData';
// import * as tubeMap from '../../../node_modules/d3-tube-map/dist/d3-tube-map.min';

const tubeMap = require('d3-tube-map');

const draw = (props) => {
    d3.select('.vis-barchart > *').remove();
    const data = props.data;
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    console.log(props.width, props.height)
    console.log(width, height)
    
    // let svg = d3.select('.vis-barchart').append('svg')
    //         .attr('width',width + margin.left + margin.right)
    //         .attr('height',height + margin.top + margin.bottom)
    //         .append("g")
    //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const container = d3.select('.vis-barchart');
    const map = tubeMap.tubeMap()
        .width(width)
        .height(height)
        .margin({
            top: height / 50,
            right: width / 7,
            bottom: height / 10,
            left: width / 7,
        })
        .on("click", function (name) {
            console.log(name);
        });

    container
        .datum(pubMapData).call(map);
    
    const svg = container.select('svg')
        .attr("width", width)
        .attr("height",0.75*height);

    function zoomed() {
        svg.select('g').attr('transform', d3.event.transform.toString());
    }

    const zoom = d3
        .zoom()
        .scaleExtent([0.5, 6])
        .on('zoom', zoomed);

    const zoomContainer = svg.call(zoom);
    const initialScale = 2;
    const initialTranslate = [100, 200];
    
    
    // // format the data
    // data.forEach(function(d) {
    //     d.age = +d.age;
    // });

    // // Scale the range of the data in the domains
    // let x = d3.scaleBand()
    //       .range([0, width])
    //       .padding(0.1);
    // let y = d3.scaleLinear()
    //       .range([height, 0]);
    // x.domain(data.map(function(d) { return d.name; }));
    // y.domain([0, d3.max(data, function(d) { return d.age; })]);

    // // append the rectangles for the bar chart
    // svg.selectAll(".bar")
    //     .data(data)
    //     .enter().append("rect")
    //     .attr("class", "bar")
    //     .attr("x", function(d) { return x(d.name); })
    //     .attr("width", x.bandwidth())
    //     .attr("y", function(d) { return y(d.age); })
    //     .attr("height", function(d) { return height - y(d.age); });

    // // add the x Axis
    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x));

    // // add the y Axis
    // svg.append("g")
    //     .call(d3.axisLeft(y));
}

export default draw;