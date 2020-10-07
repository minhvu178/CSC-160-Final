var drawAreas_renew = function(renew, renewStack, renew_columns, target_renew, xScale, yScale, color) {
    
    var area = d3.area()
        .x(d => xScale(d.data.Year))
        .y0(function(d) { return yScale(d[0]); })
        .y1(function(d) { return yScale(d[1]); });
    
    target_renew.selectAll("path")
        .data(renewStack)
        .enter()
        .append("path")
            .attr("class", function(d) { return "renew-Area " + d.key })
            .attr("fill",  function(d) { return color(d.key); })
            .attr("d", area)
        .append("title")
          .text(({key}) => key);
    
}

var drawLegends_renew = function(renewStack, renew_columns, target_renew, graph, margin, color) {
    
    var highlight = function(d){
        console.log(d)
        d3.selectAll(".renew-Area").style("opacity", .1)
        d3.select("."+d).style("opacity", 1)
        }
    var noHighlight = function(d){
        d3.selectAll(".renew-Area").style("opacity", 1)
        }
    
    var size = 10
    target_renew.selectAll("myrect")
      .data(renew_columns)
      .enter()
      .append("rect")
        .attr("x", 15)
        .attr("y", function(d,i){ return 5 + i*(size+5)})
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    target_renew.selectAll("mylabels")
      .data(renew_columns)
      .enter()
      .append("text")
        .attr("x", 15 + size*1.2)
        .attr("y", function(d,i){ return 5 + i*(size+5) + (size/2)})
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
    
}

var drawLabels_renew = function(target_renew, graph, margin) {
    target_renew.append("text")
        .text("Electricity Net Generation by Renewable Energy")
        .classed("title",true)
        .style("font-size", 18)
        .style("fill", "#808080")
        .attr("text-anchor","middle")
        .attr("x",(graph.width/2))
        .attr("y",-25)
    
    target_renew.append("text")
      .attr("text-anchor", "end")
      .attr("x", graph.width)
      .attr("y", graph.height+40 )
      .text("Time (year)");

    target_renew.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -5 )
      .text("Net Generation (Billion Killowatt-hours)")
      .attr("text-anchor", "start")
}
var drawAxes_renew = function(graph,margin,xScale,yScale) {
    
    var xAxis = d3.axisBottom(xScale)
    
    var new_margin_top = graph.height + margin.top
    
    d3.select("#elec-renew").append('g').attr('class', 'axis-x').attr("transform", "translate("+margin.left+", "+new_margin_top+")").call(xAxis)
    
    var yAxis = d3.axisLeft(yScale)
    
    d3.select("#elec-renew").append('g').attr('class', 'axis-y').attr("transform", "translate("+margin.left+", "+margin.top+")").call(yAxis)
}

var initGraph_renew = function(renew){
    
    var screen = {width:450,height:250}
    //how much space on each side
    var margin = {left:40,right:20,top:40,bottom:60}
    var graph = 
        {
            width:screen.width-margin.left-margin.right,
            height:screen.height - margin.top-margin.bottom
        }
    
    stack = d3.stack().keys(renew.columns.slice(1))
    renewStack = stack(renew)
    console.log(renewStack)
    
    renew_columns = renew.columns.slice(1)
    
    var color = d3.scaleOrdinal()
        .domain(renew_columns)
        .range(d3.schemePaired)
    
    var years = renew.map(function(d){return d.Year;})
    console.log(years)
    
    var target_renew = d3.select("#elec-renew")
    .append("g")
    .attr("transform",
          "translate("+margin.left+","+
                        margin.top+")");
    
    var xScale = d3.scaleLinear()
        .domain([years[0],years.slice(-1)[0]])
        .range([0, graph.width])
    
    var yScale = d3.scaleLinear()
        .domain([0, 800])
        .range([graph.height,0])
    
    drawAxes_renew(graph,margin,xScale,yScale)
    drawAreas_renew(renew, renewStack, renew_columns, target_renew, xScale, yScale, color)
    drawLegends_renew(renewStack, renew_columns, target_renew, graph, margin, color)
    drawLabels_renew(target_renew, graph, margin)
}


var successFCN = function(renew)
{
    initGraph_renew(renew);
}

var failFCN = function(error)
{
    console.log("error",error);
}

var renewPromise = d3.csv("data/Electricity-Renewable.csv", d3.autoType)
renewPromise.then(successFCN,failFCN);