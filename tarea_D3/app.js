//Define SVG area Dimensions
var svgWidth = 960;
var svgHeight = 500;

//Define Chart margins as object

var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};

//Define dimensions og the chart area
var chartwidth = svgWidth - margin.left - margin.right;
var chartheight = svgHeight - margin.top - margin.bottom;

//select body,append svg area 
var svg = d3.select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append group area
var chartgroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import Data
d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv("data.csv", function(err, healthdata){
    if (err) throw err;
    console.log(healthdata)
//parse data cast
    healthdata.forEach(function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
});

//create scales
var xlinearscale = d3.scaleLinear()
        .range([0, chartwidth]);
var ylinearscale = d3.scaleLinear()
        .range ([chartheight, 0]);

//create axis
var bottomaxis = d3.axisBottom(xlinearscale);
var leftaxis = d3.axisLeft(ylinearscale);

var xmin;
var xmax;
var ymin;
var ymax;

xmin = d3.min(healthdata, function(data){
    return data.healthcare;
});

xmax = d3.max(healthdata, function(data){
    return data.healthcare;
});

ymin = d3.min(healthdata, function(data){
    return data.poverty;
});

ymax = d3.max(healthdata, function(data){
    return data.poverty;
});
//append axes to chartgroup
xlinearscale.domain([xmin, xmax]);
ylinearscale.domain([ymin, ymax]);

console.log(xmin);
console.log(ymax);
// add bottom axis
chartgroup.append("g")
    .attr("transform", `translate(0, ${chartheight})`)
    .call(bottomaxis);

// add left axis
chartgroup.append("g")
    .call(leftaxis);

var circlegroup = chartgroup.selectAll("circle")
    .data(healthdata)
    .enter()
    .append("circle")
    .attr("cx", d => xlinearscale(d.healthcare +1.5))
    .attr("cy", d => ylinearscale(d.poverty +0.3))
    .attr("r", "12")
    .attr("fill", "blue")
    .attr("opacity", .5)

//mouse out function

.on("mouseout" , function(data, index){
    tooltip.hide(data);
})

var tooltip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d){
        return (abbr + '%');
    });

chartgroup.call(tooltip);

circlegroup.on ("click", function(data){
    tooltip.show(data);
})
//event listener mouse out
.on("mouseout", function(data, index){
    tooltip.hide(data);
});

chartgroup.append("text")
    .style("font-size", "11px")
    .selectAll("tspan")
    .data(healthdata)
    .enter()
    .append("tspan")
        .attr("x", function(data){
            return xlinearscale(data.healthcare +1.3);
})
        .attr("y", function(data){
            return ylinearscale(data.poverty +.1);
})
        .text(function(data){
            return data.abbr
});

chartgroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (chartheight / 2))
    .attr("dy", "1em")
    .attr("class", "axistext")
    .text("lacks healthcare(%)");

chartgroup.append("text")
    .attr("transform", `translate(${chartwidth / 2}, ${chartheight + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In poverty (%)");
});
 



