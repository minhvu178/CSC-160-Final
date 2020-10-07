var drawLines = function(dataReady, avg, target_avg, xScale, yScale, color) {
    
    var line = d3.line()
      .x(function(d) { return xScale(+d.time) })
      .y(function(d) { return yScale(+d.value) })
    target_avg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("id", function(d){ return d.name })
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return color(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none")

    target_avg.selectAll("myDots")
      .data(dataReady)
      .enter()
        .append('g')
        .style("fill", function(d){ return color(d.name) })
        .attr("id", function(d){ return d.name })
      .selectAll("myPoints")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return xScale(d.time) } )
        .attr("cy", function(d) { return yScale(d.value) } )
        .attr("r", 5)
        .attr("stroke", "white")
        .on("mouseenter" ,function(d)
          {

          var xPos = d3.event.pageX;
          var yPos = d3.event.pageY;

            d3.select("#tooltip")
                .classed("hidden",false)
                .style("top",yPos+"px")
                .style("left",xPos+"px")

            d3.select("#avgCost")
                .text(d.time+": "+d.value+" $/kW")
          })//tool tip off
        .on("mouseleave",function()
        {
            d3.select("#tooltip")    
            .classed("hidden",true)
            .selectAll(".text")
            .text(null)
        })
      
    
    target_avg.selectAll("myLegend")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .attr('x', function(d,i){ return 285 + i*80})
          .attr('y', 10)
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return color(d.name) })
          .style("font-size", 15)
        .on("click", function(d){
          currentOpacity = d3.selectAll("#" + d.name).style("opacity")
          d3.selectAll("#" + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)})
    
}

var drawAxesAvg = function(graph,margin,xScale,yScale) {
    
    var xAxis = d3.axisBottom(xScale)
    
    var new_margin_top = graph.height + margin.top
    
    d3.select("#avg-cost").append('g').attr('class', 'axis-x').attr("transform", "translate("+margin.left+", "+new_margin_top+")").call(xAxis)
    
    var yAxis = d3.axisLeft(yScale)
    
    d3.select("#avg-cost").append('g').attr('class', 'axis-y').attr("transform", "translate("+margin.left+", "+margin.top+")").call(yAxis)
    
}

var drawLabelsAvg = function(target_avg, graph, margin) {
    target_avg.append("text")
        .text("Construction cost data for electric generators")
        .classed("title",true)
        .style("font-size", 18)
        .style("fill", "#808080")
        .attr("text-anchor","middle")
        .attr("x",(graph.width/2))
        .attr("y",-15)
    
    target_avg.append("text")
      .style("font-size", 12)
      .attr("text-anchor", "end")
      .attr("x", graph.width+25)
      .attr("y", graph.height+25 )
      .text("Time (year)");

    target_avg.append("text")
      .style("font-size", 12)
      .attr("text-anchor", "end")
      .attr("x", 10)
      .attr("y", 0)
      .text("Dollars Per Kilowatt $/kW")
      .attr("text-anchor", "start")
}

var initGraphAvg = function(avg) {
    
    var screen = {width:550,height:190}
    //how much space on each side
    var margin = {left:40,right:30,top:30,bottom:30}
    var graph = 
        {
            width:screen.width-margin.left-margin.right,
            height:screen.height - margin.top-margin.bottom
        }
    
    var avg_columns = avg.columns.slice(1)
    
    var dataReady = avg_columns.map( function(grpName) { 
      return {
        name: grpName,
        values: avg.map(function(d) {
          return {time: d.Year, value: +d[grpName]};
        })
      };
    })
    
    var color = d3.scaleOrdinal()
        .domain(avg_columns)
        .range(d3.schemeSet1)
    
    var years = avg.map(function(d){return d.Year;})  
    
    var target_avg = d3.select("#avg-cost")
        .append("g")
        .attr("transform",
              "translate("+margin.left+","+
                            margin.top+")");
    
    var xScale = d3.scaleLinear()
        .domain([years[0],years.slice(-1)[0]])
        .range([0, graph.width])
    
    var yScale = d3.scaleLinear()
        .domain([0, 3800])
        .range([graph.height,0])
    
    drawAxesAvg(graph,margin,xScale,yScale)
    drawLines(dataReady, avg, target_avg, xScale, yScale, color)
    drawLabelsAvg(target_avg, graph, margin)
    
}

var successFCN = function(avg)
{
    console.log("avg",avg);
    this.initGraphAvg(avg);
}

var failFCN = function(error)
{
    console.log("error",error);
}

var avgPromise = d3.csv("data/average-cost.csv", d3.autoType)
avgPromise.then(successFCN,failFCN);