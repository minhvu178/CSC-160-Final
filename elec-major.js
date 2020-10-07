var drawAreas = function(major, majorStack, columns, target, xScale, yScale, color) {
    
    var area = d3.area()
        .x(d => xScale(d.data.Year))
        .y0(function(d) { return yScale(d[0]); })
        .y1(function(d) { return yScale(d[1]); });
    
    target.selectAll("path")
        .data(majorStack)
        .enter()
        .append("path")
            .attr("class", function(d) { return "majorArea " + d.key })
            .attr("fill",  function(d) { return color(d.key); })
            .attr("d", area)
        .append("title")
          .text(({key}) => key);
    
}

var drawLegends = function(majorStack, columns, target, graph, margin, color) {
    
    var highlight = function(d){
        console.log(d)
        d3.selectAll(".majorArea").style("opacity", .1)
        d3.select("."+d).style("opacity", 1)
        }
    var noHighlight = function(d){
        d3.selectAll(".majorArea").style("opacity", 1)
        }
    
    var size = 10
    target.selectAll("myrect")
      .data(columns)
      .enter()
      .append("rect")
        .attr("x", 15)
        .attr("y", function(d,i){ return 5 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    target.selectAll("mylabels")
      .data(columns)
      .enter()
      .append("text")
        .attr("x", 15 + size*1.2)
        .attr("y", function(d,i){ return 5 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
    
}

var drawLabels = function(target, graph, margin) {
    target.append("text")
        .text("Electricity Net Generation by Major Energy")
        .classed("title",true)
        .style("font-size", 18)
        .style("fill", "#808080")
        .attr("text-anchor","middle")
        .attr("x",(graph.width/2))
        .attr("y",-25)
    
    target.append("text")
      .attr("text-anchor", "end")
      .attr("x", graph.width)
      .attr("y", graph.height+40 )
      .text("Time (year)");

    target.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -5 )
      .text("Net Generation (Billion Killowatt-hours)")
      .attr("text-anchor", "start")
}
var drawAxes = function(graph,margin,xScale,yScale) {
    
    var xAxis = d3.axisBottom(xScale)
    
    var new_margin_top = graph.height + margin.top
    
    d3.select("#elec-major").append('g').attr('class', 'axis-x').attr("transform", "translate("+margin.left+", "+new_margin_top+")").call(xAxis)
    
    var yAxis = d3.axisLeft(yScale)
    
    d3.select("#elec-major").append('g').attr('class', 'axis-y').attr("transform", "translate("+margin.left+", "+margin.top+")").call(yAxis)
}

var initGraph = function(major){
    
    var screen = {width:450,height:250}
    //how much space on each side
    var margin = {left:60,right:20,top:40,bottom:60}
    var graph = 
        {
            width:screen.width-margin.left-margin.right,
            height:screen.height - margin.top-margin.bottom
        }
    
    stack = d3.stack().keys(major.columns.slice(1))
    majorStack = stack(major)
    console.log(majorStack)
    
    columns = major.columns.slice(1)
    
    var color = d3.scaleOrdinal()
        .domain(columns)
        .range(d3.schemeSet2)
    
    var years = major.map(function(d){return d.Year;})
    console.log(years)
    
    var target = d3.select(".elec-major").select("#elec-major")
    .append("g")
    .attr("transform",
          "translate("+margin.left+","+
                        margin.top+")");
    
    var xScale = d3.scaleLinear()
        .domain([years[0],years.slice(-1)[0]])
        .range([0, graph.width])
    
    var yScale = d3.scaleLinear()
        .domain([0, 4500])
        .range([graph.height,0])
    
    drawAxes(graph,margin,xScale,yScale)
    drawAreas(major, majorStack, columns, target, xScale, yScale, color)
    drawLegends(majorStack, columns, target, graph, margin, color)
    drawLabels(target, graph, margin)
}


var successFCN = function(major)
{
    console.log("major",major);
    this.initGraph(major);
}

var failFCN = function(error)
{
    console.log("error",error);
}

var majorPromise = d3.csv("data/Electricity-Major.csv", d3.autoType)
majorPromise.then(successFCN,failFCN);