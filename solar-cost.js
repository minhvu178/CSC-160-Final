var drawLine = function(solar, target_solar, xScale, yScale) {
    
    target_solar.append("path")
      .datum(solar)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return xScale(d.Year) })
        .y(function(d) { return yScale(d.Unitcost) }))
    
    target_solar.append("g")
      .selectAll("dot")
      .data(solar)
      .enter()
      .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function(d) { return xScale(d.Year) } )
        .attr("cy", function(d) { return yScale(d.Unitcost) } )
        .attr("r", 2)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .on("mouseenter" ,function(d)
          {

          var xPos = d3.event.pageX;
          var yPos = d3.event.pageY;

            d3.select("#tooltip")
                .classed("hidden",false)
                .style("top",yPos+"px")
                .style("left",xPos+"px")

            d3.select("#solarCost")
                .text(d.Year+": "+d.Unitcost+" $/W")
          })//tool tip off
        .on("mouseleave",function()
        {
            d3.select("#tooltip")    
            .classed("hidden",true)
            .selectAll(".text")
            .text(null)
        })
    
}

var drawAxesSolar = function(graph,margin,xScale,yScale) {
    
    var xAxis = d3.axisBottom(xScale)
    
    var new_margin_top = graph.height + margin.top
    
    d3.select("#solar-cost").append('g').attr('class', 'axis-x').attr("transform", "translate("+margin.left+", "+new_margin_top+")").call(xAxis)
    
    var yAxis = d3.axisLeft(yScale)
    
    d3.select("#solar-cost").append('g').attr('class', 'axis-y').attr("transform", "translate("+margin.left+", "+margin.top+")").call(yAxis)
    
}

var drawLabelsSolar = function(target_solar, graph, margin) {
    target_solar.append("text")
        .text("Solar PV module prices")
        .classed("title",true)
        .style("font-size", 18)
        .style("fill", "#808080")
        .attr("text-anchor","middle")
        .attr("x",(graph.width/2))
        .attr("y",-10)
    
    target_solar.append("text")
      .style("font-size", 12)
      .attr("text-anchor", "end")
      .attr("x", graph.width+25)
      .attr("y", graph.height+20 )
      .text("Time (year)");

    target_solar.append("text")
      .style("font-size", 12)
      .attr("text-anchor", "end")
      .attr("x", 10)
      .attr("y", 10)
      .text("Dollars Per Watt $/W")
      .attr("text-anchor", "start")
}

var initGraphSolar = function(solar) {
    
    var screen = {width:550,height:190}
    //how much space on each side
    var margin = {left:40,right:30,top:30,bottom:30}
    var graph = 
        {
            width:screen.width-margin.left-margin.right,
            height:screen.height - margin.top-margin.bottom
        }
    
    var years = solar.map(function(d){return d.Year;})
    
    var target_solar = d3.select("#solar-cost")
        .append("g")
        .attr("transform",
              "translate("+margin.left+","+
                            margin.top+")");
    
    var xScale = d3.scaleLinear()
        .domain([years[0],years.slice(-1)[0]])
        .range([0, graph.width])
    
    var yScale = d3.scaleLinear()
        .domain([0, 110])
        .range([graph.height,0])
    
    drawAxesSolar(graph,margin,xScale,yScale)
    drawLine(solar, target_solar, xScale, yScale)
    drawLabelsSolar(target_solar, graph, margin)
    
}

var successFCN = function(solar)
{
    console.log("solar",solar);
    this.initGraphSolar(solar);
}

var failFCN = function(error)
{
    console.log("error",error);
}

var solarPromise = d3.csv("data/solar-pv-prices.csv", d3.autoType)
solarPromise.then(successFCN,failFCN);